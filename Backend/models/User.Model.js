import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"username is required"]
    },
    email:{
        type:String,
        required:[true,"email is required"],
        minlength:[12,`email must be atleast 12 characters long`]
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength:[8,`password must be atleast 8 characters long`]
    }
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
    next();
})
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.getSignedToken = function(res){
    const accessToken = JWT.sign({id:this._id},process.env.JWT_ACCESS_SECRET , {expiresIn:process.env.JWT_ACCESS_EXPIREIN})
    const refreshToken = JWT.sign({id:this._id},process.env.JWT_REFRESH_SECRET , {expiresIn:process.env.JWT_REFRESH_EXPIREIN})
    
    res.cookie('refreshToken', refreshToken, {
    maxAge: 86400 * 14000, // milliseconds
    httpOnly: true, // frontend will not be able to access this token
    secure:true
    });
    return accessToken;
}
const userModel = mongoose.model('User',userSchema)
export default userModel