export const successResponse = (res, statusCode, success, message, payload) => {
    return res.status(statusCode).json({success: success, message: message, payload})
};

