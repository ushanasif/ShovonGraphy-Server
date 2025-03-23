const cloudinary  = require("../helpers/deleteImgFromCloudinary");
const { successResponse } = require("../helpers/successResponse");
const AlbumModel = require("./AlbumModel");


const createAlbum = async(req, res) => {
    try {
        const {albumName, coverImg} = req.body;

        const create = new AlbumModel({albumName, coverImg});
        const saveAlbum = await create.save();

        return successResponse(res, 200, 'Album created successfully');
    } catch (error) {
        res.status(500).json({error: true, message: error.message});
    }
}

const getAlbums = async(req, res) => {
    try {
        
        const albums = await AlbumModel.find();
        if(!albums){
            return res.status(400).json({error: true, message: "Albums not found"})
        }
        return successResponse(res, 200, true, "Album is deleted successfully", albums);
    } catch (error) {
        res.status(500).json({error: true, message: error.message});
    }
}

const addSingleAlbumImg = async(req, res) => {
    try {
        const {id, public_id, imgUrl} = req.body;
        console.log(req.body);
        const albumExist = await AlbumModel.findOne({_id: id});

        if(!albumExist){
            return res.status(400).json({error: true, message: "Album not found"})
        }

        const addImage = await AlbumModel.updateOne({$push: {albumImages: {public_id, imgUrl}}});

        if(!addImage){
            return res.status(400).json({error: true, message: "Image cannot be added to the album"});
        }

       

        return successResponse(res, 200, "Image added to the album successfully")

    } catch (error) {
        res.status(500).json({error: true, message: error.message});
    }
}

const deleteAlbumImg = async(req, res) => {
    try {
        const {public_id} = req.params; 
       
        if (!public_id) {
            return res.status(400).json({ message: "Public ID is required" });
          }
      
        //Delete image from Cloudinary
        const result = await cloudinary.uploader.destroy(public_id);
        if(!result){
            return res.status(400).json({error: true, message: "Image cannot be deleted from cloudinary"})
        }

        // Delete image from mongodb
        const deleteFromDB = await AlbumModel.updateOne({"albumImages.public_id": public_id}, {$pull: {albumImages: {public_id: public_id}}});
        if(!deleteFromDB){
            return res.status(400).json({error: true, message: "Image cannot be deleted from DB"})
        }
        
        return successResponse(res, 200, "Image is deleted successfully");
    } catch (error) {
        res.status(500).json({error: true, message: error.message});
    }
}

const deleteAlbum = async (req, res) => {
    try {
      const _id = req.params.id;
      const {publicIds} = req.body;
      
      const result = await cloudinary.api.delete_resources(publicIds);
      if(!result){
           return res.status(400).json({error: true, message: "Images cannot be deleted from cloudinary"});
      }

      const albumDelete = await AlbumModel.findOneAndDelete({_id});
      if(!albumDelete){
        return res.status(400).json({error: true, message: "Album cannot be deleted from db"});
      }
      
      return successResponse(res, 200, true, "Album deleted successfully");
    } catch (error) {
      console.error("Error deleting images:", error);
    }
  };

module.exports = {createAlbum, getAlbums, addSingleAlbumImg, deleteAlbumImg, deleteAlbum};