const express = require("express");
const { adminRegister, adminLogin, getAdminDetail, adminLogout, refreshToken } = require("./AdminController");
const verifyAdmin = require("../middlewares/verifyAdmin");
const router = express.Router();


router.post('/register', adminRegister);
router.post('/login', adminLogin);
router.get('/getAdmin', verifyAdmin, getAdminDetail);
router.post('/logout', verifyAdmin, adminLogout);
router.get('/refresh-token', refreshToken);

module.exports = router; 
