const Comment = require('../models/comment');
const Post = require('../models/post');
const queue = require('../config/kue');
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');


module.exports.create = async function(req,res){
    try{
        let post= await Post.findById(req.body.post)
        .sort('-createdAt');
        if(post){
            let comment = await Comment.create({
                content:req.body.content,
                post:req.body.post,  
                user:req.user._id   
            });   
            post.comments.push(comment);
            post.save(); 
            comment  = await comment.populate([{path:'user', select:'name email'}]);
            // console.log("comment.user.name",comment.user.name);
            // commentsMailer.newComment(comment);
            let job = queue.create('emails',comment).save(function(err){
                if(err){
                    console.log("Error in creating the queue",err);
                    return;
                }
                console.log("job enqueued",job.id);
            });
                if(req.xhr){
                    return res.status(200).json({
                        data:{
                            comment:comment
                        },
                        message:"Comment created!"
                    });
                } 
                
                
                req.flash('success','Comment added to the post!')
                return res.redirect('/');
                }
    }catch(err){
        req.flash("Error in creating the comment:",err)
        return res.redirect('back');
            
    }
}
module.exports.destroy =async function(req,res){
    try{
        let comment = await Comment.findById(req.params.id);
    
        if(comment.user == req.user.id){
        let postId = comment.post;

        await Comment.deleteOne({ _id: req.params.id });
                
        let post = await Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}});
        await Like.deleteMany({likeable:comment._id,onModel:'Comment'});
        if(req.xhr){
            return res.status(200).json({
                data:{
                    comment_id:req.params.id
                },
                message:"Comment deleted successfully"
            });
        }
        req.flash('success','Comment deleted!')
        return res.redirect('back');
                
                

        }else{
            req.flash('error','You cannot delete this comment!')
            return res.redirect('back');
        }
    }catch(err){
        console.log("Error",err);
        return res.redirect('back');
    }

    
}