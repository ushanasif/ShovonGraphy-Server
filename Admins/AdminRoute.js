const express = require("express");
const { adminRegister, adminLogin, getAdminDetail, adminLogout } = require("./AdminController");
const verifyAdmin = require("../middlewares/verifyAdmin");
const router = express.Router();


router.post('/register', adminRegister);
router.post('/login', adminLogin);
router.get('/getAdmin', verifyAdmin, getAdminDetail);
router.get('/logout', verifyAdmin, adminLogout);

module.exports = router; 