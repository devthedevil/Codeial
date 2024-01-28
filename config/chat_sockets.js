module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer,{
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            },
    });
    // io.sockets.on("connection_error", (err) => {
    //     console.log(err.req);      // the request object
    //     console.log(err.code);     // the error code, for example 1
    //     console.log(err.message);  // the error message, for example "Session ID unknown"
    //     console.log(err.context);  // some additional error context
    //   });
    io.on('connection', function(socket){
        console.log('new connection received', socket.id);

        socket.on('disconnect', function(){
            console.log('socket disconnected!');
        });
        socket.on('join_room',function(data){
            console.log("Joining request recieved",data);

            socket.join(data.chatroom);

            io.in(data.chatroom).emit('user_joined',data);
        });
        socket.on('send_message',function(data){
            io.in(data.chatroom).emit('receive_message',data);
        });
    });
    
    
    

}