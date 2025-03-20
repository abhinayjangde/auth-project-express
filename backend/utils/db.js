import mongoose from "mongoose";

const db = ()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("database connected!")
    })
    .catch((err)=>{
        console.log("ERROR while connecting database.", err)
    })
   
}

export default db;
