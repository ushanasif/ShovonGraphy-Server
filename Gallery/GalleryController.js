const cloudinary  = require("../helpers/deleteImgFromCloudinary");
const { successResponse } = require("../helpers/successResponse");
const GalleryModel = require("./GalleryModel");



const galleryPost = async(req, res) => {
    try {
        const {public_id, imgUrl} = req.body;

        const imgExist = await GalleryModel.findOne({public_id, imgUrl});

        if(imgExist){
            return res.status(400).json({error: true, message: "Image id already exist"});
        }

        const image = new GalleryModel({public_id, imgUrl});
        const saveImage = await image.save();

        if(!saveImage){
            return res.status(400).json({error: true, message: "Gallery image not saved"});  
        }

        res.status(200).json({success: true, message: "Gallery image saved successfully"}) 
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: true, message: error.message});
    }
};


const getGallery = async(req, res) => {
    try {
        const galleryData = await GalleryModel.find();
        if(!galleryData){
            return res.status(400).json({error: true, message: "No images found"});
        }

        res.status(200).json({success: true, message: "Images found", galleryData});
    } catch (error) {
        res.status(500).json({error: true, message: error.message});
    }
};

const deleteGalleryImg = async(req, res) => {
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
        const deleteFromDB = await GalleryModel.findOneAndDelete({public_id}, {new: true});
        if(!deleteFromDB){
            return res.status(400).json({error: true, message: "Image cannot be deleted from DB"})
        }
        
        return successResponse(res, 200, "Image is deleted successfully");
    } catch (error) {
        res.status(500).json({error: true, message: error.message});
    }
}

module.exports = {galleryPost, getGallery, deleteGalleryImg};

