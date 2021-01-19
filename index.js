const express = require('express');
const mongoose = require('mongoose');
const app  = express();

mongoose.connect('mongodb+srv://semo:semo@cluster0.vbrbx.mongodb.net/<dbname>?retryWrites=true&w=majority',{
   useUnifiedTopology: true

}).then(()=> {
  app.listen(()=> {
    console.log('Connected to MongoDB');
  });
}).catch(err => console.error("Could't connect to MongoDB"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
