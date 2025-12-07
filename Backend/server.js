import 'dotenv/config'
import express from 'express'
// import variable from package name
import router from './routes/auth.route.js'
import cors from 'cors'
import connectDB from './config/DB.config.js'
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
connectDB();
const PORT = process.env.PORT_NO || 5000;
app.get("/",(req,res)=>{
    res.send("server is running")
})
app.use('/api/v1/auth',router)
app.listen(5000,()=>{
    console.log(`Server is running on port ${PORT}`)
})