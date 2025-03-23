const jwt = require('jsonwebtoken');

const verifyAdmin = async(req, res, next) => {
    try {
        const accessToken = req?.cookies?.accessToken;
        if(!accessToken){
            return res.status(401).json({error: true, message: "Token not found"})
        }
        const decoded =  jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET_KEY);
        if(!decoded){
            return res.status(401).json({error: true, message: "Please sign in"})
        }
    
        req.id = decoded.id;
        next();
    } catch (error) {
        res.status(500).json({error: true, message: error.message});
    }
}

module.exports = verifyAdmin;