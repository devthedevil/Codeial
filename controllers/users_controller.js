// module.exports.profile = function(res,res){
//     res.end('<h1>User Profile</h1>');
// };
module.exports.profile = function(req,res){
    return res.render('users',{
        title:"Profile of users"
    });
};
// module.exports.users = function(res,res){
//     res.end('<h1>Users</h1>');
// };

module.exports.post = function(res,res){
    res.end('<h1>Post</h1>');
};
//render the sign up page
module.exports.signUp = function(req,res){
    return res.render('user_sign_up',{
        title:"Codeial | Sign Up"
    });
}
//render the sign in page
module.exports.signIn = function(req,res){
    return res.render('user_sign_in',{
        title: "Codeial | Sign In"
    });
}

//get the sign up data
module.exports.create = function(req,res){
    //To do later
}

//get the sign in and create a session for the users
module.exports.createSession = function(req,res){
    //To do later
}