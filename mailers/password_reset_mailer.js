const nodeMailer = require('../config/nodemailer');

//this is another way of exporting a method

exports.newPasswordResetLink = (user,link)=>{
    let htmlString = nodeMailer.renderTemplate({user:user,link:link},'/password_reset/password_reset.ejs');
    // console.log('inside new comment mailer',htmlString);

    nodeMailer.transporter.sendMail({
        from:'devpatna2017@gmail.com',
        to:user.email,
        subject:"Your Password Reset link for Codeial",
        html:htmlString
    },(err,info)=>{
        if(err){
            console.log("Error in sending mail",err);
            return;
        }
        return;
    });
}