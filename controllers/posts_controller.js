const Post = require('../models/post');
const Comment = require('../models/comment');
module.exports.create = function(req,res){
    // console.log(req.user_id);
    Post.create({
        content:req.body.content,
        user:req.user._id
        
    })
    .then((post)=>{return res.redirect('back')})
    .catch(err=>{console.log("Error in creating the post"); return; });
}
module.exports.destroy = function(req,res){
    Post.findById(req.params.id)
    .then(post=>{
        //.id means converting the object id into string
        if(post.user == req.user.id){
            Post.deleteOne({ _id: req.params.id })
                .then(() => {
                    Comment.deleteMany({post:req.params.id})
                        .then((post)=>{
                            return res.redirect('back');
                            })
                        .catch(err=>{"error in post.delete many",err});;
                    })
                .catch(err=>{"error in post.deleteone",err});
        }else{
            return res.redirect('back');
        }
    })
    .catch(err=>{console.log("error in finding post to be deleted",err);});
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