{
    document.getElementById("password-link").addEventListener("click",function(){
        
        let messageDiv = $('#message');
        let email = $('#email').val();
        let formElement = $('#form');

        // console.log(email);
        // console.log(form);

        // Update the content of the div with the message
        if(email=="")
        {
            messageDiv.html('Please provide your email address');
            return;
        }
        
            console.log("ji");
            // Set the display property of the form to 'none'
            
            messageDiv.html('Password reset link has been sent to your email address');
            formElement.style.display = 'none';
    
        
    });
}