const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const imageFileFilter = (req, file, cb) => {

    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png"
    ];

    const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png"
    ];

    const extension =
        path
            .extname(file.originalname)
            .toLowerCase();

    const validExtension =
        allowedExtensions.includes(extension);

    const validMimeType =
        allowedMimeTypes.includes(file.mimetype);

    if (
        validExtension &&
        validMimeType
    ) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only JPG, JPEG and PNG images are allowed."
            ),
            false
        );

    }

};

const imageUpload = multer({

    storage,

    fileFilter:
        imageFileFilter,

    limits: {

        fileSize:
            20 * 1024 * 1024  // 20 MB max LIMIT

    }

});

module.exports = imageUpload;