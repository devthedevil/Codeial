const Post = require('../models/post');
const User = require('../models/user');
const Friendship = require('../models/friendship');
const Message = require('../models/message');
const { post } = require('./users_controller');
module.exports.home =async function(req,res){

    try{
    //populate the user for each post(using then)
    let posts = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
        path:'comments',
        populate:{
            path:'user'
        }
    })
    .populate({
        path:'comments',
        populate:{
            path:'likes'
        }
    })
    .populate('likes');
    // console.log(posts[0].user.name);
    let message = await Message.find({})
    .populate('from_user');

    // console.log(message[0].id);
   
    let users = await User.find({})
    
     /* new step 4: finding the friends of the logged in user */
   let friends = new Array();
   let home_posts = new Array();
   if (req.user)/* friends list will only be loaded if thhe user is signed in */
   {
       let all_friendships = await Friendship.find({ $or: [{ from_user: req.user._id }, { to_user: req.user._id }] })
        //    .populate('from_user')
           .populate({
            path:'from_user',
            populate:{
                path:'post',
                populate:{
                    path:'comments',
                    populate:{
                        path:'user',
                        options: { strictPopulate: false }
                    }
                }
            }
            })
            .populate({
                path:'from_user',
                populate:{
                    path:'post',
                    populate:{
                        path:'user'
                    }
                }
                })
            .populate({
                path:'to_user',
                populate:{
                    path:'post',
                    populate:{
                        path:'comments',
                        populate:{
                            path:'user',
                            options: { strictPopulate: false }
                        }
                    }
                    
                }
                })
                .populate({
                    path:'to_user',
                    populate:{
                        path:'post',
                        populate:{
                            path:'user'
                        }
                    }
                    });
        //    .populate('to_user');/* checking the friendship model in the fields "from user" and "to_user". the current logged in user has to be in one of them. and at the same time we are also populating it to see the user ids*/

       for (let fs of all_friendships)/* storing all the friendships in an array so that it is easy to load them in the front end quickly */
       {
        // console.log(fs);
           if (fs.from_user._id.toString() == req.user._id.toString())
           {
               friends.push({
                   friend_name: fs.to_user.name,
                   friend_id: fs.to_user._id,
                   friend_avatar:fs.to_user.avatar,
                   friend_post:fs.to_user.post
               });
           }
           else if (fs.to_user._id.toString() == req.user._id.toString())
           {
               friends.push({
                   friend_name: fs.from_user.name,
                   friend_id: fs.from_user._id,
                   friend_avatar:fs.from_user.avatar,
                   friend_post:fs.from_user.post
               });
           }
       }
//    console.log(req.user._id.toString());
//    console.log(posts[0].user._id.toString());

//    for(p of posts){
//         let f=friends.find(friend=> friend.friend_id.toString() == p.user._id.toString());
//         if(f || (req.user && req.user._id.toString()==p.user._id.toString()))
//         {
//             // home_posts.push(p);
//         }
//    }
   
   let home_user = await User.findById({ _id: req.user._id })
   .populate({
        path:'post',
        populate:{
            path:'comments',
            populate:{
                path:'user',
                options: { strictPopulate: false }
            }
        }
    
    })
    .populate({
            path:'post',
            populate:{
                path:'user'
            }
        
        })
//    console.log("id",home_user.post[0].user._id);
   for(p of home_user.post)
   {
    home_posts.push(p);
   }

   
//    console.log(home_posts);
}
    for(f of friends){
        // console.log("printing s");
        // console.log(f.friend_post[0]);
        // console.log("printing e");
            for(p of f.friend_post){
            home_posts.push(p);
            }
    }
home_posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


    
    return res.render('home',{
        title:"Strangers",
        posts:posts,
        all_users:users,
        friends: friends,
        message:message,
        home_posts:home_posts
    });
    }
    catch(err){
        console.log('Error',err);
        return;
    }
};
