import userModel from "../models/User.Model.js";
import ErrorHandling from "../utils/ErrorHandling.js";
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
const loginController = async (req,res,next)=>{
    try {
        const {username , password} = req.body;
        if(!username || !password) return next(new ErrorHandling("Data not entered",400))
        const user = await userModel.findOne({username : username});
        if(user){
            const isMatch = await user.matchPassword(password)
            if(isMatch){
                sendToken(user,200,res)
            }
            else{
                return next(new ErrorHandling("username or password is incorrect",401))
            }
        }
        else{
            return next(new ErrorHandling("User Not found",404))
        }
    } catch (error) {
        next(error)
    }
}
const logoutController = async (req,res,next) => {
    try {
        res.clearCookie('refreshToken',{
            httpOnly :true,
            secure:true
        })
        return res.status(200).json({
            success:true,
            message:"Logout Successfully"
        })
    } catch (error) {
        next(error)
    }
}
export {logoutController,loginController,registerController}