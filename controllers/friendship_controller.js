const User = require('../models/user');
const Friendship = require('../models/friendship');

module.exports.toggle_friendship = (req, res) =>
{
    let from_id = req.user._id;
    let to_id = req.params.id;
    Friendship.findOne({ $or: [{ from_user: from_id, to_user: to_id }, { from_user: to_id, to_user: from_id }] })
        
        .then(existing_friendship =>{
            console.log('**********************************', existing_friendship);
            
            if (existing_friendship)
            {
                /* updating users database */
                User.findByIdAndUpdate(from_id, { $pull: { friendships: existing_friendship._id } })
                .then(data=>{
                    console.log(data);
                })
                .catch(error=>{
                    console.log('Error in removing the friendship from the user', error);
                    return;
                });
                User.findByIdAndUpdate(to_id, { $pull: { friendships: existing_friendship._id } })
                .catch(error=>{
                    console.log('Error in removing the friendship from the user', error);
                    return;
                    
                });

                /* updating friendships database */
                Friendship.deleteOne({$or:[{ from_user: from_id, to_user: to_id }, { from_user: to_id, to_user: from_id }]})
                .then(user=>{
                    console.log('Deleted Friendship!');
                })
                .catch(error=>{
                    console.log('Unable to remove friendship', error);
                        return;
                });
            }
            else
            {
                /* updating friendships database */
                Friendship.create({ from_user: from_id, to_user: to_id })
                .then(new_friendship=>{
                    
                    new_friendship.save();
                    /* updating users database */
                    User.findByIdAndUpdate(from_id, { $push: { friendships: new_friendship._id } })
                    .then(data=>{
                        console.log(data);
                    })
                    .catch(error=>{
                        console.log('Error in adding the friendship to the user database', error);
                        return;
                    });
                    User.findByIdAndUpdate(to_id, { $push: { friendships: new_friendship._id } })
                    .then( data=>{
                        console.log(data);
                    })
                    .catch(error=>{
                        console.log('Error in adding the friendship to the user database', error);
                        return;
                    });
                })
                .catch(error=>{
                    console.log('There was an error in creating a friendship!', error);
                    
                });
            }
            return res.redirect('back');
        })
        .catch(error=>{
            if (error)
            {
                console.log('There was an error in finding the friendship between the users');
            }
        });
}