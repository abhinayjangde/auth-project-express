import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    name: {type: String},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    role: {type: String, enum: ["user","admin"], default: "user"},
    isVerified: {type: Boolean, default: false},
    verificationToken : {type: String},
    resetPasswordToken: {type: String},
    resetPasswordTokenExpiry: {type: Date}
},{timestamps: true})

// middleware (hook)
userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})


const User = mongoose.model("User", userSchema)

export default User