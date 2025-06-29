const cloudinary = require("../helpers/deleteImgFromCloudinary");
const { successResponse } = require("../helpers/successResponse");
const SliderModel = require("./SliderModel");



const addSlider = async(req, res) => { 
    try {
        const {data} = req.body;
        console.log(data);

        if(!Array.isArray(data) || data.length === 0){
            return res.status(400).json({ error: true, message: "No slider data provided" });
        }

        const finalData = data.map((val) => {
            return {public_id: val.public_id, imgUrl: val.secure_url}
        })

        SliderModel.insertMany(finalData);

        res.status(200).json({success: true, message: "Slider image saved successfully"}) 
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: true, message: error.message});
    }
};

const getSlider = async(req, res) => {
    try {
        const sliderImages = await SliderModel.find();
        if(!sliderImages){
            return res.status(400).json({error: true, message: "No images found"});
        }

        res.status(200).json({success: true, message: "Images found", sliderImages});
    } catch (error) {
        res.status(500).json({error: true, message: error.message});
    }
};

const deleteSlider = async(req, res) => {
    try {
        const {public_id} = req.params; 
       
        if (!public_id) {
            return res.status(400).json({ message: "Public ID is required" });
          }
      
        // Delete image from Cloudinary
        const result = await cloudinary.uploader.destroy(public_id);
        if(!result){
            return res.status(400).json({error: true, message: "Image cannot be deleted from cloudinary"})
        }

        // Delete image from mongodb
        const deleteFromDB = await SliderModel.findOneAndDelete({public_id}, {new: true});
        if(!deleteFromDB){
            return res.status(400).json({error: true, message: "Image cannot be deleted from DB"})
        }
        
        return successResponse(res, 200, true, "Image is deleted successfully");
    } catch (error) {
        res.status(500).json({error: true, message: error.message});
    }
}


module.exports = {addSlider, getSlider, deleteSlider};