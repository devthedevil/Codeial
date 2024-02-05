class ChatEngine{
    constructor(chatBoxId,userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        this.socket = io.connect('http://34.229.233.50:5000');

        if(this.userEmail){
            this.connectionHandler();
        }
    }
    connectionHandler(){
        let self = this;
        this.socket.on('connect',function(){
            console.log('connection established using sockets...!');

            self.socket.emit('join_room',{
                user_email:self.userEmail,
                chatroom:'codeial'
            });
            self.socket.on('user_joined',function(data){
                console.log("User has joined",data);
            })
        });
        // CHANGE :: send a message on clicking the send message button
        let keyDown=false;
        $('#chat-message-input').keydown(function(e){
            
            if(e.keyCode == 13) {
            //    console.log(e.keyCode);
            let msg = $('#chat-message-input').val();

            if (msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codeial'
                });
                keyDown=true;
            }
        }});
        
        $('#send-message').click(function(){
            
            let msg = $('#chat-message-input').val();
            
            if (!keyDown && msg != '' ){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codeial'
                });
            }
        });
        

        self.socket.on('receive_message', function(data){
            // console.log('message received', data);


            let newMessage = $('<li>');

            let messageType = 'other-message';

            if (data.user_email == self.userEmail){
                messageType = 'self-message';
            }

            newMessage.append($('<span>', {
                'html': data.message
            }));

            // newMessage.append($('<sub>', {
            //     'html': data.user_email
            // }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
        });
    

    }
    
}
function scrollToBottom() {
    var messageList = document.getElementById("chat-messages-list");
    if (messageList) {
        messageList.scrollTop = messageList.scrollHeight;
      } else {
        console.error("Element with ID 'chat-messages-list' not found.");
      }
  }
  
  // Scroll to bottom when the page is loaded or refreshed
  window.onload = scrollToBottom;

    

