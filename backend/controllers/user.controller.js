import User from "../models/User.js"
import crypto from "crypto"
import nodemailer from "nodemailer"

const registerUser = async (req, res) => {
    // get data from req.body
    const { name, email, password } = await req.body

    // validate
    if (!name || !email || !password) {
        res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }

    try {
        // check if user already exists
        const existingUser = await User.findOne({ email: email })

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exists!"
            })
        }

        // create a user in database
        const user = await User.create({
            name: name,
            email: email,
            password: password,
        })

        // check if user is created or not
        if (!user) {
            res.status(400).json({
                success: false,
                message: "Error while creating user in database"
            })
        }

        // create a verification token
        const token = crypto.randomBytes(32).toString("hex");
        user.verificationToken = token

        // save token in database
        await user.save()

        console.log("database user", user)
        // send token as email to user
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false, // true for port 465, false for other ports
            auth: {
                user: process.env.MAILTRAP_USERNAME,
                pass: process.env.MAILTRAP_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.MAILTRAP_SENDER_EMAIL, // sender address
            to: user.email, // list of receivers
            subject: "Verify your email", // Subject line
            text: `Please click on the following link:
            ${process.env.BASE_URL}/api/v1/users/verify/${token}`, // plain text body
            html: `
                <h1>Click here to verify your account</h1>

                <a href=${process.env.BASE_URL}/api/v1/users/verify/${token} >${process.env.BASE_URL}/api/v1/users/verify/${token}</a>
            `, // html body

        }

        const isMailSend = await transporter.sendMail(mailOptions)

        // send success status to user
        res.status(201).json({
            success: true,
            message: "User register successfylly"
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error while registering user",
            error
        })
    }

}

const verifyUser = async (req,res)=>{
    // get token from url (params)
    const {token} = req.params
    console.log(token)
    // validate
    if(!token){
        res.status(400).json({
            success: false,
            message: "Invalid token"
        })

    }
    try {
        // find user based on token
    const user = await User.findOne({verificationToken: token})
    // if not
    if(!user){
        res.status(400).json({
            success: false,
            message: "Invalid token"
        })
    }
    // set isVerified field true
    user.isVerified = true
    // remove verification token
    user.verificationToken = undefined
    // save
    await user.save()
    // return response
    res.status(200).json({
        success: true,
        message: "User verified successfully."
    })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "User verification error",
            error
        })
    }
}

export { registerUser, verifyUser }