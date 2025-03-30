const verifyAdmin = require("../middlewares/verifyAdmin");
const { addSlider, getSlider, deleteSlider } = require("./SliderController");

const router = require("express").Router();


router.post('/add-slider', verifyAdmin, addSlider);
router.get('/get-slider', getSlider);
router.delete('/delete-slider-img/:public_id', verifyAdmin, deleteSlider);

module.exports = router;