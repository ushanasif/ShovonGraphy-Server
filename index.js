require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const adminRouter = require('./Admins/AdminRoute');
const galleryRouter = require('./Gallery/GalleryRoute');
const albumRouter = require('./Albums/AlbumRoute')
connectDB();

const PORT = 3000;

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/admin', adminRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/album', albumRouter); 


app.listen(PORT, ()=>{ 
    console.log(`Server is running successfully at http://localhost:${PORT}`);
});

