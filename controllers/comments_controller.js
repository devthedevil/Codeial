const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req,res){
    console.log('hey mm');
    Post.findById(req.body.post)
    .then(post => {
        if(post){
            Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id
            }).then(comment=>{
                    
                    post.comments.push(comment);
                    post.save();
                    return res.redirect('/');
                })
            .catch(err=>{
                if(err){
                    console.log("Error in creating the comment:",err);
                }
            })
        }
    })
    .catch(err=>{
        console.log("Error in finding the comment");
    });
}