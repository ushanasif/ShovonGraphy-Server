const verifyAdmin = require("../middlewares/verifyAdmin");
const { galleryPost, getGallery, deleteGalleryImg } = require("./GalleryController");

const router = require("express").Router();


router.post('/store-gallery', verifyAdmin, galleryPost);
router.get('/get-gallery', getGallery);
router.delete('/delete-gallery-img/:public_id', deleteGalleryImg);

module.exports = router;