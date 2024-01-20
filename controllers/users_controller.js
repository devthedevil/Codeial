const User =require('../models/user');
const fs =require('fs');
const path = require('path');

module.exports.profile = async function(req,res){
    try{

    let user = await User.findById(req.params.id)
    if(user){
    return res.render('user_profile',{
            title:"Profile of users",
            profile_user:user
    })
    }else{
        return res.redirect('back');
    }
    }catch(err){
        console.log("Error in finding the user by id",err);
    }
    
};
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
                    const imagePath = path.join(__dirname,'..',user.avatar);
                    if(user.avatar && isUserLinkedWithImage(imagePath)){
                        fs.unlinkSync(imagePath);
                    }
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

