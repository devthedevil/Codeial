const User =require('../models/user');
// module.exports.profile = function(res,res){
//     res.end('<h1>User Profile</h1>');
// };
module.exports.profile = function(req,res){
    User.findById(req.params.id)
    .then(user=>{
        return res.render('user_profile',{
            title:"Profile of users",
            profile_user:user
        });
    })
    .catch(err=>{console.log("Error in finding the user by id",err);});
    
};
module.exports.update = function(req,res){
    console.log("hey");
    if(req.user.id == req.params.id){
        // User.findByIdAndUpdate(req.params.id,{name:req.body.name,email:req.body.email})
        User.findByIdAndUpdate(req.params.id,req.body)
        .then(user=>{
            return res.redirect('back');
        })
        .catch(err=>{
            console.log("Error in finding the user id for update",err);
        });
       
    }else{
        console.log("id doesn't matches");
        return res.status(401).send('Unauthorized');
    }
}
// module.exports.users = function(res,res){
//     res.end('<h1>Users</h1>');
// };

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
module.exports.create = function(req,res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email:req.body.email}).then((user)=>{
        if(!user){
            User.create(req.body).then(user =>{
                return res.redirect('/users/sign-in');
            }).catch((err)=>{
            if(err){
                console.log('Error in creating user while signing up');
                return;
            }
        }); 
        }else{
            return res.redirect('back');
        }
    }).catch((err)=>{
        if(err){
            console.log('Error in finding user in signing up');
            return;
        }
    });
        
        
    
}

//get the sign in and create a session for the users
module.exports.createSession = function(req,res){
    return res.redirect('/');
}

module.exports.destroySession = function(req,res){
    // console.log('hey');
    req.logout(function (err) {
        console.log('Error in sign out');
    });
    return res.redirect('/');
}