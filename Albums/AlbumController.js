const cloudinary  = require("../helpers/deleteImgFromCloudinary");
const { successResponse } = require("../helpers/successResponse");
const AlbumModel = require("./AlbumModel");


const createAlbum = async(req, res) => {
    try {
        const {albumName, coverImg} = req.body;

        const create = new AlbumModel({albumName, coverImg});
        await create.save();

        return successResponse(res, 200, true, 'Album created successfully'); 
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
  const { id, allImages } = req.body;

  const albumExist = await AlbumModel.findOne({ _id: id });

  if (!albumExist) {
    return res.status(400).json({ error: true, message: "Album not found" });
  }

  const addImages = await AlbumModel.updateOne(
    { _id: id }, // <-- Correct filter
    { $push: { albumImages: { $each: allImages } } } // <-- Push multiple
  );
  console.log(addImages);
  if (addImages.modifiedCount === 0) {
    return res.status(400).json({ error: true, message: "Images could not be added" });
  }

  return res.status(200).json({
    success: true,
    message: "Images added to the album successfully"
  });

} catch (error) {
  res.status(500).json({ error: true, message: error.message });
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