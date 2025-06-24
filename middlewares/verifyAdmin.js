const jwt = require("jsonwebtoken");
const AdminModel = require("../Admins/AdminModel");

const verifyToken = async (req, res, next) => {
  const refreshToken = req?.cookies?.refreshToken;
  const header = req?.headers?.authorization;

  const accessToken = header?.split(" ")[1];
 
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (!accessToken) {
    return res.status(401).json({ success: false, message: "Unauthorized!" });
  } else {
    jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET_KEY,
      async (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res
              .status(401)
              .json({ success: false, message: "Unauthorized" });
          }
          return res
            .status(401)
            .json({ success: false, message: "Unauthorized" });
        } else {
          const isAdmin = await AdminModel.findOne({ _id: decoded.id });

          if (!isAdmin) {
            return res.status(401).json({ message: "UnAuthorized!" });
          }

          req.id = isAdmin?._id;
          next();
        }
      }
    );
  }
};

module.exports = verifyToken;
