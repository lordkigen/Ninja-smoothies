const { render } = require("ejs")
const jwt = require('jsonwebtoken')
const User = require('../model/Users')


const errorHandler =  (err) =>{
        console.log(err.message, err.code)
        // declare email anf password empty initial
        let errors = {email: '', password: ''}

        // duplicate error key
        if(err.code === 11000){
            errors.email = "email is already registered try another";
            return errors;
        }

        // incorect email
        if(err.message == 'incorrect email'){
            errors.email = "Invalid email"
        }

        // incorect password
        if(err.message == 'incorrect password'){
            errors.password = "invalid password"
        }

        // assingning the object value path with the message
        if(err.message.includes('user validation failed')){
         Object.values(err.errors).forEach( ({properties} )=>{
            console.log(properties)
            errors[properties.path] = properties.message
         })
        }

        return errors;

}
// create expire 
const maxAge = 1 * 24 * 60 *60

// create jwt 
const createToken =  (id) => {
   return    jwt.sign({id}, 'lordkigen secret', {
    expiresIn: maxAge
   })
}

module.exports.signup_get = (req, res) =>{
    res.render('signup')
}

module.exports.login_get = (req, res) =>{
     res.render('login')
}

// signup
module.exports.signup_post =  async (req, res) =>{
      const { email, password } =  req.body
     
    try{
    // After creating user then respond
    const user = await User.create({  email, password })
    const token =  createToken(user._id)
    // set cookie
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})
    res.status(201).json({user: user._id})
    }
    catch (err) {
      const errors  = errorHandler(err)
       res.status(400).json({ errors })
    }
}

// login
module.exports.login_post =  async (req, res) =>{
    const { email, password } =  req.body
  
    try{
        // wait user is the model
      let user =  await User.login(email, password)
      const token =  createToken(user._id)
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})
      res.status(200).json({user: user._id})
      }
    catch (err){
        const errors = errorHandler(err)
        res.status(400).json({ errors })
    }
}

module.exports.logout_get = (req, res) =>{
    res.cookie('jwt', ' ', { maxAge: 1})
    res.redirect('/')
}