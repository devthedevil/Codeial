const Post = require('../models/post');
module.exports.home = function(req,res){
    // console.log(req.cookies);
    // res.cookie('user_id',25);
//populate the user for each post
    Post.find({}).populate('user').exec({}).then(posts=>{
        return res.render('home',{
            title:"Codeial | Home",
            posts:posts});
        })
    .catch(err=>{console.log("Error in showing the posts");});
   
    
};
// module.exports.pic = function(req,res){
//     return res.end('<h1> Express is up for pic!</h1>')
// };

// module.exports.actionName = function(req,res){}