const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
    public_id: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String,
        required: true
    }
}, {timestamps: true});


const SliderModel = mongoose.model('slider', sliderSchema);

module.exports = SliderModel;