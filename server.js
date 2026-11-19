import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);

// Настраиваем Socket.IO. origin: '*' разрешает подключение с любого сайта (для тестов).
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Проверка, что сервер жив (Railway использует это для мониторинга)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', connections: io.engine.clientsCount });
});

io.on('connection', (socket) => {
  console.log('Игрок подключился:', socket.id);

  // Когда игрок присылает сообщение (движение, действие), пересылаем его ВСЕМ ОСТАЛЬНЫМ
  socket.on('game-message', (data) => {
    socket.broadcast.emit('game-message', data);
  });

  socket.on('disconnect', () => {
    console.log('Игрок отключился:', socket.id);
  });
});

// Railway сам подставит порт в переменную PORT. Слушаем 0.0.0.0 (обязательно!)
const port = process.env.PORT || 3000;
httpServer.listen(port, '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${port}`);
});
