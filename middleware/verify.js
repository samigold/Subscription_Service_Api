import verifyToken from "../utils/verifyToken.js";

const authorize = async (req, res, next) => {
    let token = req.cookies.jwt;

    //console.log("Token from cookie:", token);

    if(!token) {
        return res.status(401).json({
            success: "false",
            message: "You're not Logged in"
        })
    }

    try{
        const result = await verifyToken(token);
        if(!result) {
            return res.status(401).json({
                success: "false",
                message: "Invalid token"
            });
        }

        //console.log("Authorized user:", result);
        
        req.user = result;
        next();
    } catch(error) {
        return res.status(500).json({
            success: "false",
            message: "Internal server error"
        });
    }
}

export default authorize;