const express = require('express');
const jsonParser = express.json();
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();

// enable files upload
app.use(fileUpload({
  createParentPath: true
}));

//add other middleware
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/upload', jsonParser, async (req, res) => {
  try {
    if(!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      });
    } else {
      //Use the name of the input field (i.e. "image") to retrieve the uploaded file
      const image = req.files.image;
      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      image.mv('./uploads/' + image.name);

      //send response
      res.send({
        status: true,
        message: 'File is uploaded',
        data: {
          name: image.name,
          mimetype: image.mimetype,
          size: image.size,
        }
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

//start app 
const port = process.env.PORT || 3000;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);