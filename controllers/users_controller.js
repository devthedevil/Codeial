const User =require('../models/user');
const crypto = require('crypto');
const AccessToken =require('../models/reset_password_tokens');
const fs =require('fs');
const path = require('path');
const resetPasswordMailer = require('../mailers/password_reset_mailer');
const Friendship = require('../models/friendship');


module.exports.passwordResetDone = async function(req,res){
    
    try{ 
        let accessTokenObject = await AccessToken.findOne({accessToken: req.params.accessToken});
        accessTokenObject = await accessTokenObject.populate([{path:'user', select:'_id'}]);
        let user = await User.findOne({_id: accessTokenObject.user._id});
        const password = req.body.password;
        // console.log(accessTokenObject);
        console.log(password.length);
        console.log(typeof(password));
        // console.log(typeof(accessTokenObject));
            if(accessTokenObject.isValid)
            {   
               if(password.length==0)
                {
                    req.flash('error', "Kindly provide the password!");
                    console.log("ki");
                    return res.redirect('back');
                } 
                else if(req.body.password == req.body.confirm_password )
                {
                    user.password = req.body.password;
                    accessTokenObject.isValid = false;
                    user.save();
                    req.flash('success', "Password updated. Login now!");
                    return res.redirect('/users/sign-in') 
                }
                else
                {
                    req.flash('error', "Passwords don't match!");
                    return res.redirect('back');
                }
            }
            else
            {
                req.flash('error', 'Link expired');
                return res.redirect('/users/reset_password');
            }
        
        // accessToken  = await accessToken.populate([{path:'user', select:'name email'}]);
    }
    catch(err){
        console.log(err);
    }
}
module.exports.resetPassword = async function(req,res){
    try{    
        let accessToken = await AccessToken.findOne({accessToken:req.query.accesstoken});
        // console.log(accessToken);
        if(accessToken==null)
        {
            return res.redirect('/');
        }
        else{
            return res.render('reset_password',{
                title:'reset_password',
                accessToken:accessToken

        });
    }
    }catch(err){

    }
}


module.exports.emailSent = async function(req,res){
    try{ 
        let user = await User.findOne({email:req.body.email});
        if(user){
            let accessTokenObj = await AccessToken.create({
                isValid:true,
                accessToken:crypto.randomBytes(10).toString('hex'),  
                user:user._id 

                });
            const baseURL = 'http://localhost:8000/users/reset_password/';
            const link = `${baseURL}?accesstoken=${accessTokenObj.accessToken}`;
            // let accessTokenObject = await accessTokenObj.populate([{path:'user', select:'name password email'}]);
            // console.log(typeof(accessTokenObj));
           
            resetPasswordMailer.newPasswordResetLink(user,link);
                return res.render('email_sent',{
                title:'email_sent',
                content:'Password reset link has been sent to your email address'
            });
        }else{
                return res.render('email_sent',{
                title:'email_sent',
                content:'Your email is not registered, kindly sign up'
                });
        }
        
        
    }catch(err){
        console.log(err);
    }
}
module.exports.provideEmail = async function(req,res){
    try{ 
        return res.render('provide_email',{
            title:"Email"

        });
    }catch(err){
        console.log(err);
    }
}
module.exports.profile = async function(req,res){
    let user = await User.findById(req.params.id);

    let are_friends = false;

    await Friendship.findOne({
            $or: [{ from_user: req.user._id, to_user: req.params.id },
            { from_user: req.params.id, to_user: req.user._id }]})
            .then(friendship=>{
                if (friendship)
            {
                are_friends = true;
            }
            }) 
            .catch(error=>{
                console.log('There was an error in finding the friendship', error);
                return;
            });
        
            

        return res.render('user_profile', {
            title: 'User Profile',
            profile_user:user,
            are_friends: are_friends
        });
    // try{

    // let user = await User.findById(req.params.id)
    // if(user){
    // return res.render('user_profile',{
    //         title:"Profile of users",
    //         profile_user:user
    // })
    // }else{
    //     return res.redirect('back');
    // }
    // }catch(err){
    //     console.log("Error in finding the user by id",err);
    // }
    
}
module.exports.profile_picture = async function(req,res){
    try{

    let user = await User.findById(req.params.id)
    return res.render('profile_picture',{
        title:"Profile Picture",
        profile_user:user,
        avatar:user.avatar

    });
    }catch(err){
        console.log("Error in finding the user by id",err);
    }
    
};

function isUserLinkedWithImage(imagePath) {
  
    try {
      // Check if the image file exists
      fs.accessSync(imagePath, fs.constants.F_OK);
      return 1; // File exists
    } catch (err) {
      return 0; // File doesn't exist or there was an error
    }
  }
module.exports.update = async function(req,res){
    
    if(req.user.id == req.params.id){
        try{
            //step 1 find the user
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log('*********Multer Error: ***********',err);
                }
                
                user.name=req.body.name;
                user.email = req.body.email;
                if(req.file){
                    
                    if(user.avatar){
                        
                        let fileExists = fs.existsSync(path.join(__dirname , '..' , user.avatar));
                        if(fileExists){
                            fs.unlinkSync(path.join(__dirname , '..' , user.avatar));
                        }
                    }
                    // console.log('********* Error: ***********');
                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath +'/'+ req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });

        }catch(err){
            req.flash("Error",err); 
            return res.redirect('back');

        }
       
    }else{
        req.flash('error','Unauthorized!!');
        return res.status(401).send('Unauthorized');
    }
}

module.exports.post = function(res,res){
    res.end('<h1>Post</h1>');
};
//render the sign up page
module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
    return res.render('user_sign_up',{
        title:"Codeial | Sign Up"
    });
}
//render the sign in page
module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
    return res.render('user_sign_in',{
        title: "Codeial | Sign In"
    });
}

//get the sign up data
module.exports.create = async function(req,res){
    try{
        if(req.body.password != req.body.confirm_password){
            return res.redirect('back');
        }
    
        let user = await User.findOne({email:req.body.email});
            if(!user){
                await User.create(req.body);
                return res.redirect('/users/sign-in');
            }else{
                return res.redirect('back');
            }

    }catch(err){
        if(err){
            req.flash('error','Error in Logging in');
            }
        console.log("Error",err);
    }
}

//get the sign in and create a session for the users
module.exports.createSession = function(req,res){
    // console.log('createSession');
    req.flash('success','Logged in Successfully');
    
    return res.redirect('/');
}

module.exports.destroySession = function(req,res){
    
    req.logout((err) =>{
        if(err){
        req.flash('error','Error in Logging out');
        console.log('Error in sign out',err);
        }
        req.flash('success','You have logged out!');
        return res.redirect('/');
        
    });
}

