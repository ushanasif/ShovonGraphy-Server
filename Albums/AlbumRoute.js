const verifyAdmin = require("../middlewares/verifyAdmin");
const { createAlbum, getAlbums, addSingleAlbumImg, deleteAlbumImg, deleteAlbum } = require("./AlbumController");

const router = require("express").Router();


router.post('/create-album', createAlbum);
router.get('/get-albums', verifyAdmin, getAlbums);
router.put('/add-single-album-images', addSingleAlbumImg);
router.delete('/delete-album-image/:public_id', deleteAlbumImg);
router.delete('/delete-album/:id', deleteAlbum);


module.exports = router;