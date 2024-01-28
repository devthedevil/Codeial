{
    document.getElementById("submit").addEventListener("click",function(){
        
        let password = $('#password').val();
        let confirmPassword = $('#confirm_password').val();
        // let formElement = $('#form');
        // let messageDiv = $('#message');
        // console.log(password);
        if(password.length==0){
            new Noty({
                theme: 'relax',
                text: "Kindly provide the password",
                type: 'error',
                layout: 'topRight',
                timeout: 1500
                
            }).show();
        }
        else if(password == confirmPassword ){
            new Noty({
                theme: 'relax',
                text: "Password updated. Login now",
                type: 'success',
                layout: 'topRight',
                timeout: 1500
                
            }).show();
        }
        else{
            new Noty({
                theme: 'relax',
                text: "Passwords don't match",
                type: 'error',
                layout: 'topRight',
                timeout: 1500
                
            }).show();
        }
       
        
    
        
    });
}