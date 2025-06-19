const AdminModel = require("./AdminModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { successResponse } = require("../helpers/successResponse");
const { createJwToken } = require("../helpers/createJwToken");


const adminRegister = async(req, res) => {
    try {
        const {email, password} = req.body;

        const adminExist = await AdminModel.findOne({email});
        if(adminExist){
            return res.status(401).json({error: true, message: "User already exists with this email"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = new AdminModel({email, password: hashedPassword});
        const newAdmin = await admin.save();
        
        res.status(200).json({success: true, message: "Admin is registered successfully", payload: newAdmin});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: true, message: error.message});
    }
};

const adminLogin = async(req, res) => {
    try {
        const {email, password} = req.body;
        
        const adminExist = await AdminModel.findOne({email});
        if(!adminExist){
            return res.status(401).json({error: true, message: 'Invalid email/password'})
        }

        const isMatch = await bcrypt.compare(password, adminExist.password)

        if(!isMatch){
            return res.status(401).json({error: true, message: "Invalid email/password"})
        }

        const payload = {
            id: adminExist._id
        }
        

        const accessToken = createJwToken(payload, process.env.JWT_ACCESS_SECRET_KEY, '10m');

        const refreshToken = createJwToken(payload, process.env.JWT_REFRESH_SECRET_KEY, '30d');

        await AdminModel.findByIdAndUpdate(adminExist._id, {refreshToken});
        
        res.cookie('refreshToken', refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true, // Prevent JavaScript access
            secure: true,
        });


        res.status(200).json({success: true, message: "Admin is logged in successfully", accessToken, admin: adminExist})
    } catch (error) {
        res.status(500).json({error: true, message: error.message}); 
    }
};

const getAdminDetail = async(req, res) => {
    try {
        
        const adminExist = await AdminModel.findOne({_id: req.id}).select("-password");
       
        if(!adminExist){
            return res.status(400).json({error: true, message: "Please log in"})
        }

        return successResponse(res, 200, true, "Admin exist", adminExist)
    } catch (error) {
        res.status(500).json({error: error.message}); 
    }
};

const adminLogout = async(req, res) => {
    try {
        const refreshToken = req?.cookies?.refreshToken;
        res.clearCookie('refreshToken', {httpOnly: true, secure: process.env.NODE_ENV === 'production'});

        await AdminModel.findOneAndUpdate({refreshToken}, {refreshToken: ''});
        return successResponse(res, 200, true, "Logout successful");
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: true, message: error.message});
    }
};

const refreshToken = async(req, res) => {
    const refreshToken = req?.cookies?.refreshToken;
    if(!refreshToken){
        return res.status(401).json({message: 'Unauthorized!'})
    }

   try {
    const refreshTokenExist = await AdminModel.findOne({refreshToken});
    if(!refreshTokenExist){
        return res.status(401).json({message: 'Unauthorized!'})
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
    if(!decoded || decoded.id !== refreshTokenExist._id.toString()){
        return res.status(401).json({ success: false, message: "Unauthorized here" });
    }

    const newToken = createJwToken({id: decoded.id}, process.env.JWT_ACCESS_SECRET_KEY, '10m');

    res.status(200).json({accessToken: newToken});
   } catch (error) {
        res.status(500).json({error: true, message: error.message});
   }


}

module.exports = {adminRegister, adminLogin, getAdminDetail, adminLogout, refreshToken};
