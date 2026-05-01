module.exports = (io) => {
    let users = new Map();

    io.on('connection', (socket) => {
        console.log('Connected to socket.io');

        socket.on('setup', (userData) => {
            if (!userData || !userData._id) return;
            const roomName = userData._id.toString();
            socket.join(roomName);
            users.set(roomName, socket.id);
            console.log(`User ${userData.name} joined personal room: ${roomName}`);
            socket.emit('connected');
        });

        socket.on('join chat', (room) => {
            socket.join(room.toString());
            console.log('User Joined Chat Room: ' + room);
        });

        socket.on('typing', (room) => socket.in(room.toString()).emit('typing'));
        socket.on('stop typing', (room) => socket.in(room.toString()).emit('stop typing'));

        socket.on('new message', (newMessageReceived) => {
            var chat = newMessageReceived.chat;

            if (!chat.users) return console.log('chat.users not defined');

            chat.users.forEach((u) => {
                const targetId = u._id.toString();
                const senderId = newMessageReceived.sender._id.toString();
                
                if (targetId === senderId) return;

                console.log(`Brodcasting message to user: ${targetId}`);
                socket.in(targetId).emit('message received', newMessageReceived);
                
                // If receiver is connected, update sender that message is delivered
                if (users.has(targetId)) {
                     const Message = require('../models/Message');
                     Message.findByIdAndUpdate(newMessageReceived._id, { status: 'delivered' }).exec();
                     
                     socket.in(senderId).emit('message status update', {
                         messageId: newMessageReceived._id,
                         status: 'delivered',
                         chatId: chat._id
                     });
                }
            });
        });

        socket.on('mark as seen', async ({ messageId, chatId, senderId }) => {
            try {
                // Update in DB (we don't wait for it to finish to keep UI fast)
                const Message = require('../models/Message');
                Message.findByIdAndUpdate(messageId, { status: 'seen' }).exec();
            } catch (err) {
                console.error(err);
            }

            socket.in(senderId).emit('message status update', {
                messageId,
                status: 'seen',
                chatId
            });
        });

        // WebRTC Signaling
        socket.on('call user', (data) => {
            socket.to(data.userToCall).emit('call user', {
                signal: data.signalData,
                from: data.from,
                name: data.name,
                type: data.type
            });
        });

        socket.on('answer call', (data) => {
            socket.to(data.to).emit('call accepted', data.signal);
        });

        socket.on('end call', (data) => {
            socket.to(data.to).emit('call ended');
        });

        socket.on('disconnect', () => {
            console.log('USER DISCONNECTED');
            for (let [userId, socketId] of users.entries()) {
                if (socketId === socket.id) {
                    users.delete(userId);
                    break;
                }
            }
        });

        socket.off('setup', () => {
            console.log('USER DISCONNECTED');
            socket.leave(userData._id);
        });
    });
};
