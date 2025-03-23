const AdminModel = require("./AdminModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { successResponse } = require("../helpers/successResponse");


const adminRegister = async(req, res) => {
    try {
        const {email, password} = req.body;

        const adminExist = await AdminModel.findOne({email});
        if(adminExist){
            return res.status(401).json({error: true, message: "User already exists"});
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
            return res.json({error: true, message: 'Admin does not exist'})
        }

        const isMatch = await bcrypt.compare(password, adminExist.password)

        if(!isMatch){
            return res.status(401).json({error: true, message: "Password doesn't match"})
        }

        const payload = {
            id: adminExist._id
        }
        
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {
            expiresIn: '30m'
        });

        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
            expiresIn: '30d'
        });
        
        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 30, // 15 minutes
            httpOnly: true, // Prevent JavaScript access
            secure: false,
            sameSite: 'strict' // Prevent cross-site attacks
        });

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true, // Prevent JavaScript access
            secure: false,
            sameSite: 'strict' // Prevent cross-site attacks 
        });

        res.status(200).json({success: true, message: "Admin is logged in successfully"})
    } catch (error) {
        res.status(500).json({error: true, message: error.message}); 
    }
};

const getAdminDetail = async(req, res) => {
    try {
        
        const adminExist = await AdminModel.findOne({_id: req.id});
        console.log(adminExist);
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
        res.clearCookie('accessToken');
        return successResponse(res, 200, true, "Logout successful");
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: true, message: error.message});
    }
}

module.exports = {adminRegister, adminLogin, getAdminDetail, adminLogout};