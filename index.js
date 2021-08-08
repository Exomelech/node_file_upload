const express = require('express');
const urlencodedParser = express.urlencoded({
  limit: '10mb',
  extended: true,
});
const cors = require('cors');
const fs = require('fs');
const path = require('path');
// const getUuid = require('uuid-by-string');
const { v1, v5 } = require('uuid');
const app = express();
const {isDir, makeDir,} = require('./src/tools');

const NAMESPACE = '01cab0ba-64a8-4375-927e-c28ba92d50e1';

app.use(cors());
app.use('/uploads', express.static('uploads'));

const onImageUpload = async ({image, username, type}, callback) => {
  // const userUUID = getUuid(username);
  const userUUID = v5(username, NAMESPACE);
  const pathExist = await isDir('/uploads/'+userUUID);
  if (!pathExist) await makeDir(path.join(__dirname, '/uploads/'+userUUID));
  const decoded_image = Buffer.from(image, 'base64');
  const file_name = v1();
  const file_url = `/uploads/${userUUID}/${file_name}.${type}`
  fs.writeFile('.'+file_url, decoded_image, 'base64', () => callback(file_url));
};

app.post('/upload', urlencodedParser, async (req, res) => {
  const { body } = req;
  if (!body.image || !body.username) {
    res.send({
      status: false,
      message: 'No username or body!'
    });
  } else {
    onImageUpload(body, (file_url) => {
      res.send({
        status: true,
        data: {
          file_url,
        }
      });
    });
  }
});

//start app 
const port = process.env.PORT || 3000;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);
