const mongoose = require('mongoose')
const { isEmail  } = require('validator')
const bycrpt =  require('bcrypt')

// create schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'please enter a valid email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'please enter a valid email']
    },
    password: {
        type: String,
        required:   [true, 'please enter a valid password'],
        minlength: [6, 'minmum length is 6 char']
    },
})

// hashing the password before storing in db
userSchema.pre('save',   async function (next) {
    //   get salt from bycrpt
    const salt = await bycrpt.genSalt();

    // hash the password must include await
    this.password =  await bycrpt.hash(this.password, salt)

})

// static method to login
userSchema.statics.login =  async function (email, password){
    // find user
       const user = await this.findOne({ email });
       if(user){
           const auth =  await bycrpt.compare(password, user.password);
            //    if user password match the user
           if(auth){
              return user;
           }
           throw Error('incorrect password')
       }
       throw Error('incorrect email')
}


// export model with same name but singular
const  User = mongoose.model('user', userSchema)


module.exports = User