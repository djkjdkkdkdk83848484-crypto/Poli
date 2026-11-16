const { WebSocketServer } = require('ws');

const port = process.env.PORT || 8080;
const wss = new WebSocketServer({ port });

const clients = [];

wss.on('connection', ws => {
  clients.push(ws);
  ws.isHost = (clients.length === 1);
  broadcastRoles();

  ws.on('message', raw => {
    clients.forEach(c => {
      if (c !== ws && c.readyState === 1) c.send(raw);
    });
  });

  ws.on('close', () => {
    const i = clients.indexOf(ws);
    if (i >= 0) clients.splice(i, 1);
    if (clients.length > 0) clients[0].isHost = true;
    broadcastRoles();
  });
});

function broadcastRoles() {
  clients.forEach(c => {
    if (c.readyState === 1) {
      c.send(JSON.stringify({
        type: 'role',
        host: !!c.isHost,
        players: clients.length
      }));
    }
  });
}

console.log('WebSocket server running on port ' + port);
