const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on('connection', socket => {
    socket.on('threeDPQueue', (threeDPQueue) => {
      io.emit('threeDPQueue', threeDPQueue);
    });
    socket.on('laserCutQueue', (laserCutQueue) => {
      io.emit('laserCutQueue', laserCutQueue);
    });
    socket.on('laserCutMaterial', (laserCutMaterial) => {
      io.emit('laserCutMaterial', laserCutMaterial);
    });
  });

  httpServer
    .once("error", (err) => {
      console.log(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`Server on http://${hostname}:${port}`);
    });
})