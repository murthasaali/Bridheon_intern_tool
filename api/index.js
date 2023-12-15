const express = require("express");
const cors = require("cors");
const multer = require('multer');
const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); 
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
const storage = multer.memoryStorage(); 

const upload = multer({ storage: storage });

const CONNECTION_STRING = "mongodb://127.0.0.1:27017/";
const DATABASE_NAME = "tododb";

let database; // Define the database variable to be used later

app.listen("3001", () => {
  MongoClient.connect(CONNECTION_STRING, (err, client) => {
    if (err) {
      console.error('Error connecting to MongoDB:', err);
    } else {
      database = client.db(DATABASE_NAME);
      console.log('Successfully connected to MongoDB');
    }
  });
});

app.get('/api/todoapp/getnotes', (req, res) => {
  database.collection("todoapp").find({}).toArray((err, result) => {
    if (err) {
      console.error("Error fetching notes:", err);
      res.status(500).send("Error fetching notes");
    } else {
      res.send(result);
    }
  });
});

app.delete('/api/todoapp/DeleteNotes', (req, res) => {
  const noteIdToDelete = req.query.id;

  database.collection("todoapp").deleteOne({ _id: ObjectId(noteIdToDelete) }, (err, result) => {
    if (err) {
      console.error("Error deleting note:", err);
      res.status(500).send("Error deleting note");
    } else {
      console.log("Note deleted successfully");
      res.status(200).send("Note deleted successfully");
    }
  });
});

// ... (Your existing imports and setup code)

app.post('/api/todoapp/addName', upload.single('image'), (req, res) => {
  const {name,stack,week,github,linkedin,number} = req.body
  // const newStack = req.body.stack;
  // const week = req.body.week;
  const imageFile = req.file;
  console.log(req.file)
  if (!name || !imageFile) {
    res.status(400).send('Name and Image are required');
    return;
  }

  const imageBuffer = imageFile.buffer; // Get the buffer containing the file
  console.log(imageBuffer)
  const imageBase64 = imageBuffer.toString('base64'); // Convert buffer to base64

  database.collection('todoapp').insertOne({ name: name, imageUrl: imageBase64 ,week:week,stack:stack,github:github,linkedin:linkedin,number:number}, (err, result) => {
    if (err) {
      console.error('Error adding name and image:', err);
      res.status(500).send('Error adding name and image');
    } else {
      console.log('Name and Image added successfully');
      res.status(201).send('Name and Image added successfully');
    }
  });
});
app.post('/api/todoapp/addName', upload.single('image'), (req, res) => {
  const newName = req.body.name;
  const imageFile = req.file;

  if (!newName || !imageFile) {
    res.status(400).send('Name and Image are required');
    return;
  }

  const imageBuffer = imageFile.buffer; // Get the buffer containing the file

  if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
    res.status(400).send('Invalid image data');
    return;
  }

  const imageBase64 = imageBuffer.toString('base64'); // Convert buffer to base64

  database.collection('todoapp').insertOne({ name: newName, imageUrl: imageBase64 }, (err, result) => {
    if (err) {
      console.error('Error adding name and image:', err);
      res.status(500).send('Error adding name and image');
    } else {
      console.log('Name and Image added successfully');
      res.status(201).send('Name and Image added successfully');
    }
  });
});

