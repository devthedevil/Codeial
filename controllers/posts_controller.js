const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');
const User = require('../models/user');
module.exports.create = async function(req,res){
    try{
        
        let post = await Post.create({
            content:req.body.content,
            user:req.user._id
            
        });
        let user = await User.findById(req.user._id);
        console.log(user);
        user.post.push(post);
        user.save(); 
        
        if(req.xhr){
            
            post = await post.populate([{path:'user', select:'name'}]);
            // post.username=req.user.name;
            // console.log(typeof(post.populate('user', 'name').execPopulate()));
            // Assign user details to the post
            // post.user = _user;
            // console.log(post);
            return res.status(200).json({
                data:{
                    post:post
                },
                message:"Post created!"
            });
        }
        req.flash('success','Post published!')
        return res.redirect('back');
    }catch(err){
        req.flash("Error",err); 
        return res.redirect('back');
    }
    
}
module.exports.destroy =async function(req,res){
    try{
        let post = await Post.findById(req.params.id);
        //.id means converting the object id into string
        
        if(post.user == req.user.id){

            await Like.deleteMany({likeable:post,onModel:'Post'});
            await Like.deleteMany({_id:{$in:post.comments}});

            await Post.deleteOne({ _id: req.params.id });
            
            await Comment.deleteMany({post:req.params.id});
            await User.findByIdAndUpdate(req.user._id,{$pull:{post:req.params.id}});
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id:req.params.id
                    },
                    message:"Post deleted successfully"
                });
            }
            req.flash('success','Post and associated comment deleted!')
            return res.redirect('back');
        }else{
            req.flash('error','You cannot delete this post!')
            return res.redirect('back');
        }

    }catch(err){
        req.flash("Error",err); 
        return res.redirect('back');
    }
    
    
}
// module.exports.destroy = function(req, res){
//     Post.findById(req.params.id, function(err, post){
//         // .id means converting the object id into string
//         if (post.user == req.user.id){
//             post.remove();

//             Comment.deleteMany({post: req.params.id}, function(err){
//                 return res.redirect('back');
//             });
//         }else{
//             return res.redirect('back');
//         }

//     });
// }