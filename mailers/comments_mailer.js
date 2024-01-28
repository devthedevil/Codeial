const nodeMailer = require('../config/nodemailer');

//this is another way of exporting a method

exports.newComment = (comment)=>{
    let htmlString = nodeMailer.renderTemplate({comment: comment},'/comments/new_comment.ejs');
    // console.log('inside new comment mailer',htmlString);

    nodeMailer.transporter.sendMail({
        from:'devpatna2017@gmail.com',
        to:comment.user.email,
        subject:"New Comment Published!",
        html:htmlString
    },(err,info)=>{
        if(err){
            console.log("Error in sending mail",err);
            return;
        }
        // console.log("Message sent",info);
        // console.log('inside new comment mailer',htmlString);
        return;
    });
}