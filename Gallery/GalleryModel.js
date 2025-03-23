const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    public_id: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String,
        required: true
    }
}, {timestamps: true});


const GalleryModel = mongoose.model('gallery', gallerySchema);

module.exports = GalleryModel;