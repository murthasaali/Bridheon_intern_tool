const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json()); // Add this line to parse JSON data in requests
app.use(express.urlencoded({ extended: true }));


const CONNECTION_STRING = "mongodb+srv://admin:Murth%40123@cluster0.nwezlpm.mongodb.net/?retryWrites=true&w=majority";
const DATABASE_NAME = "tododb";

app.listen("3001",()=>{
    MongoClient.connect(CONNECTION_STRING, (err, client) => {
        if (err) {
          console.error('Error connecting to MongoDB:', err);
        } else {
          database = client.db(DATABASE_NAME);
          console.log('Successfully connected to MongoDB');
        }
      });
      

})

app.get('/api/todoapp/getnotes',(req,res)=>{
    database.collection("todoapp").find({}).toArray((err,result)=>{
        
        res.send(result)
    })
})
// ... (previous code)

app.delete('/api/todoapp/DeleteNotes', (req, res) => {
    const noteIdToDelete = req.query.id; // Assuming the note ID is passed as a query parameter
    
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
  


    app.post('/api/todoapp/addName', (req, res) => {
        const newName = req.body.name
         // Assuming 'name' is sent in the request body
         console.log('Received new name:', newName);

        if (!newName) {
        res.status(400).send('Name is required');
        return;
        }
    
        database.collection('todoapp').insertOne({ name: newName }, (err, result) => {
        if (err) {
            console.error('Error adding name:', err);
            res.status(500).send('Error adding name');
        } else {
            console.log('Name added successfully');
            res.status(201).send('Name added successfully');
        }
        });
    });