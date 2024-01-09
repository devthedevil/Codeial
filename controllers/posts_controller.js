const Post = require('../models/post')
module.exports.create = function(req,res){
    // console.log(req.user_id);
    Post.create({
        content:req.body.content,
        user:req.user._id
        
    })
    .then((post)=>{return res.redirect('back')})
    .catch(err=>{console.log("Error in creating the post"); return; });
}