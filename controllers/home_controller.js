module.exports.home = function(req,res){
    console.log(req.cookies);
    res.cookie('user_id',25);
    return res.render('home',{
        title:"Home"
    });
};
// module.exports.pic = function(req,res){
//     return res.end('<h1> Express is up for pic!</h1>')
// };

// module.exports.actionName = function(req,res){}