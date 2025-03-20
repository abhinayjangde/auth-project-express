import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import db from "./utils/db.js"

// import all route
import userRoute from "./routes/user.route.js"

const app = express()
dotenv.config()

const port = process.env.PORT || 4000

// cors
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders:[
        'Content-Type',
        'Authorization'
    ]
}))
// database connect
db()

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended: true}))
// user Route
app.use("/api/v1/users", userRoute)

// health check route
app.get("/health",(req,res)=>{
    res.json({
        success: true,
        messages: "I am healthy!"
    })
})

app.listen(port,()=>{
    console.log(`server is listening on http://localhost:${port}`)
})