import jwt from "jsonwebtoken"

export const isLoggedIn = async (req,res, next)=>{

    try {
        console.log(req.cookies)
        // const token = req.cookies.token || ""
        const token = req.cookies?.token

        console.log(token ? "Token Found" : "Token not found")

        // if token not found
        if(!token){
            res.status(401).json({
                success: false,
                message: "Authentication Failed"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded)
        
        req.user = decoded

        next()

    } catch (error) {
        console.log("error", error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }

}