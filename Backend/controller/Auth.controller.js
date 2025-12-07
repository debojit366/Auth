import userModel from "../models/User.Model.js";
import ErrorHandling from "../utils/ErrorHandling.js";
//REGISTER
const sendToken = async (user,statusCode,res)=>{
    const token = user.getSignedToken(res);
    res.status(statusCode).json({
        success:true,
        token
    })
}
const registerController = async (req,res,next)=>{
    try {
        const {username,email,password} = req.body;
        if(await userModel.findOne({email})){
        return next(new ErrorHandling("User already registered",409))
        }
        const user = await userModel.create({username,email,password})
        sendToken(user,201,res)
        console.log("user registered successfully")
    } catch (error) {
        next(error)
    }
}