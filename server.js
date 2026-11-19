// server.js — минимальный WebSocket-сервер для игры
const { WebSocketServer } = require('ws');
const http = require('http');

// Layero передаёт порт через переменную окружения PORT
const PORT = process.env.PORT || 3000;

// Создаём HTTP-сервер (нужен как основа для WebSocket)
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Game server is running');
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Игрок подключился');
  
  ws.on('message', (data) => {
    // Простейшая логика: пересылаем сообщение всем остальным
    // В реальной игре здесь будет ваша игровая логика
    for (const client of wss.clients) {
      if (client !== ws && client.readyState === client.OPEN) {
        client.send(data);
      }
    }
  });
  
  ws.on('close', () => console.log('Игрок отключился'));
});

// ВАЖНО: слушаем 0.0.0.0, а не 127.0.0.1
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
