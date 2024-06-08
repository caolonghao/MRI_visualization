const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());

app.post('/upload', upload.array('files'), (req, res) => {
    const files = req.files;
    const fileUrls = [];

    files.forEach(file => {
        const originalName = file.originalname;
        const filePath = path.join(file.destination, `${file.filename}.nii.gz`);
        fs.renameSync(file.path, filePath);
        fileUrls.push(`${req.protocol}://${req.get('host')}/uploads/${file.filename}.nii.gz`);
    });

    res.send(fileUrls);
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
