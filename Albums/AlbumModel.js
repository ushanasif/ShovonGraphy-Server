const mongoose = require('mongoose');
const { string } = require('zod');

const albumSchema = new mongoose.Schema({
    albumName: {
        type: String,
        required: true
    },
    
    coverImg: {
        public_id: String,
        imgUrl: String
    },

    albumImages: [
        {
            public_id: String,
            imgUrl: String
        }
    ]
}, {timestamps: true});


const AlbumModel = mongoose.model('album', albumSchema);

module.exports = AlbumModel; 