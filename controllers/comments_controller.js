const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req,res){
    
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
module.exports.destroy = function(req,res){
    Comment.findById(req.params.id)
    .then(comment=>{
        if(comment.user == req.user.id){
            let postId = comment.post;

            Comment.deleteOne({ _id: req.params.id })
                .then(() => {
                    Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}})
                    .then(()=>{return res.redirect('back');})
                    })
                .catch(err=>{"error in common.deleteone",err});
            
            

        }else{
            return res.redirect('back');
        }

    });
}