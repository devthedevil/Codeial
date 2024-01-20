const Comment = require('../models/comment');
const Post = require('../models/post');

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
                if(req.xhr){
                    // comment  = await comment.populate('user','name').execPopulate();
                    return res.status(200).json({
                        data:{
                            comment:comment,
                            username:req.user.name
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