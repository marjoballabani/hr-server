const uuid = require('uuid');
const io = require('socket.io');
const userIds = {};

/**
 * Random ID until the ID is not in use
 */
function randomID(callback) {
    const id = uuid.v4();
    if (id in userIds) setTimeout(() => uuid.v4(), 5);
    else callback(id);
  }
/**
 * Send data to friend
 */
function sendTo(userId, done, fail) {
    const clientReciver = userIds[userId];
    if (clientReciver) {
      const next = typeof done === 'function' ? done : fail;
      next(clientReciver);
    } else {
      const next = typeof fail === 'function' ? fail : fail;
      next();
    }
  }

  /**
 * Initialize when a connection is made
 * @param {SocketIO.Socket} socket
 */
function initSocket(clientSocket) {
    let id;
    clientSocket
      .on('init', () => {
        // Save new socket connection to an array
        randomID((_id) => {
          id = _id;
          userIds[id] = clientSocket;
          clientSocket.emit('init', { id });
        });
      })
      .on('request', (data) => {
        sendTo(
          data.to,
          clientReciver => clientReciver.emit('request', { from: id }),
          (err) => clientSocket.emit('failed')
        );
      })
      .on('call', (data) => {
        sendTo(
          data.to,
          clientReciver => clientReciver.emit('call', Object.assign({}, data, {from: id })),
          (err) => clientSocket.emit('failed')
        );
      })
      .on('end', (data) => {
        sendTo(
          data.to,
          clientReciver => clientReciver.emit('end'),
          (err) => clientSocket.emit('failed')
        );
      })
      .on('disconnect', () => {
        delete userIds[id];
        console.log(id, 'disconnected');
      });

    return clientSocket;
}

var callConfig = function (server) {
    io.listen(server, { log: true })
        .on('connection', initSocket);
};

module.exports = callConfig;
