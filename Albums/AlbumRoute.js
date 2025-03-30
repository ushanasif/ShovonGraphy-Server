const verifyAdmin = require("../middlewares/verifyAdmin");
const { createAlbum, getAlbums, addSingleAlbumImg, deleteAlbumImg, deleteAlbum } = require("./AlbumController");

const router = require("express").Router();


router.post('/create-album', verifyAdmin, createAlbum);
router.get('/get-albums', getAlbums);
router.put('/add-single-album-images', verifyAdmin, addSingleAlbumImg);
router.delete('/delete-album-image/:public_id', verifyAdmin, deleteAlbumImg);
router.delete('/delete-album/:id', verifyAdmin, deleteAlbum);


module.exports = router;