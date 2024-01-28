const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User  = require('../models/user');

//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID:"415013486147-8022ddiuq9bll0o0dh9vihjcbhbtsl61.apps.googleusercontent.com",
        clientSecret:"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",
        callbackURL:"http://localhost:8000/users/auth/google/callback",
        
    },
    async function(accessToken,refreshToken,profile,done){
        try{
            // console.log(accessToken,refreshToken);
            // console.log(profile);
            //find a user
            let user =  await User.findOne({email:profile.emails[0].value}).exec();
            
                
                if(user){
                    //if found, set this user as req.user
                    return done(null,user);
                }else{
                    //if not found, create the user and set it as req.user
                    User.create({
                        name:profile.displayName,
                        email:profile.emails[0].value,
                        password:crypto.randomBytes(20).toString('hex')
                    })
                    .then(user=>{
                        return done(null,user);
                    })
                    .catch(err=>{
                        console.log("Error in google strategy passport",err);
                        return;
                    });
                }

        }catch(err){
            console.log("Error in creating user google strategy passport",err);
            return;
        }
        
                 
        }));
        
module.exports = passport;
