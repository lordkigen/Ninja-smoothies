const jwt = require('jsonwebtoken');
const User  = require('../model/Users')

// create the middleware
const requireAuth = (req, res, next) => {
    // get cookie
    const token = req.cookies.jwt;

    // verify cookie if  legit
    if(token){
         jwt.verify(token, 'lordkigen secret', (err, decodedToken) =>{
           if(err){
            console.log(err.message)
               res.redirect('/login');
           }else{
            console.log(decodedToken)
               next();
           }
         });
    }else{
         res.redirect('/login');
    }
}

// checkUser
const checkUser  = (req, res, next)  => {
    const token = req.cookies.jwt;

    if(token){
         jwt.verify(token, 'lordkigen secret',  async (err, decodedToken) =>{
           if(err){
            console.log(err.message)
            res.locals.user = null
            next()
           }else{
               console.log(decodedToken)
               let user =  await User.findById(decodedToken.id)
               res.locals.user =  user;
               next()
           }
         });
    }else{
            res.locals.user = null
        next()
    }
}
module.exports = { requireAuth, checkUser }