const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
//get the sign in and create a session for the users
module.exports.createSession = async function(req,res){
    try{
        // console.log('hii');
        // console.log('inside users api v1 users in controller');
        let user =await User.findOne({email:req.body.email});
        if(!user|| user.password!= req.body.password){
            return res.json(422,{
                message:"Invalid username or password"
            });
        }
        return res.json(200,{
            message:'Sign in successful, here is your token, please keep it safe!',
            data:{
                token:jwt.sign(user.toJSON(),'codeial',{expiresIn:'900000'})
            }
        })
    }catch(err){
        console.log("error",err);
        return res.json(500,{
            message:"Internal Server Error"
        });
    }
}