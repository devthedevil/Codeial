// module.exports.profile = function(res,res){
//     res.end('<h1>User Profile</h1>');
// };
module.exports.profile = function(req,res){
    return res.render('users',{
        title:"Profile of users"
    });
};
// module.exports.users = function(res,res){
//     res.end('<h1>Users</h1>');
// };

module.exports.post = function(res,res){
    res.end('<h1>Post</h1>');
};

