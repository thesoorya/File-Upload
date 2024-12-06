const express = require('express')
const app = express()
const multer = require('multer')
const path = require('path')
const PORT = 5000

const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
        const mimetype = fileTypes.test(file.mimetype)

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'));
        }
    }
})

app.use('/uploads', express.static('uploads'))

app.post('/upload', upload.single('photo'), (req, res) => {
    try {
        res.status(200).send({
            message: 'File uploaded successfully',
            file: req.file,
        });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
})

app.listen(PORT, () => {
    console.log('Server started')
})