const { Server } = require('socket.io');
const server = require('./server');
const io = new Server(server);

const players = [];
io.on('connection', (socket) => {
  socket.on('initial state', (state) => {
    sendAllPlayers(io, socket.id);
    players.push({ socket, state });
    io.emit('add player', state);
    socket.on('slowTick', (data) => {
      players.find((p) => p.socket === socket).state = data;
    });
    setInterval(() => {
      io.emit(
        'players update',
        players.map((p) => p.state)
      );
    }, 200);
    socket.on('disconnect', (reason) => {
      const plIndex = players.findIndex((p) => p.socket.id === socket.id);
      io.emit('disconnect player', players[plIndex].state.id);
      players.splice(players.indexOf(socket), 1);
    });
  });
});

function sendAllPlayers(io, socketID) {
  players.forEach((p) => {
    io.to(socketID).emit('add player', p.state);
  });
}
