module.exports.home = function(req,res){
    return res.render('home',{
        title:"Home"
    });
};
// module.exports.pic = function(req,res){
//     return res.end('<h1> Express is up for pic!</h1>')
// };

// module.exports.actionName = function(req,res){}