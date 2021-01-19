const express = require('express');
const app  = express();

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://semo:semo@cluster0.vbrbx.mongodb.net/<dbname>?retryWrites=true&w=majority',{
   useUnifiedTopology: true 
}).then(()=>{
  app.listen(()=> {
    console.log('the server is running');
  });
}).catch(err=>console.error(err));

