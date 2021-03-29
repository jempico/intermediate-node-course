const express= require('express');
const mongoose= require('mongoose');
const bodyParser= require('body-parser');
const port=8000;
const app= express();
const User=require('./models/User');
const bcrypt = require('bcrypt');

// Conntecting to Mongo local db
mongoose.connect('mongodb://localhost/userData')

app.use(bodyParser.json());

app.listen(port, ()=>{
	console.log(`server is listening on port:${port}`)
})


// CREATE: Go to Postman to see Post request
app.post('/users', (req,res)=>{
  let hash = bcrypt.hashSync(req.body.newData.password, 10);
  User.create(
    { 
      name:req.body.newData.name,
      email:req.body.newData.email,
      password:hash
    }, 
    (err,data)=>{ 
      sendResponse(res, err, data);
    }
    )
    //>To compare passwords:
    //console.log(bcrypt.compareSync(req.body.newData.password, hash));
  })

app.route('/users/:id')
// READ
.get((req,res)=>{
  User.findById(req.params.id,(err,data)=>{
    sendResponse(res, err, data);
  })
})
// UPDATE
.put((req,res)=>{
  User.findByIdAndUpdate(
    req.params.id,
    {...req.body.newData}, //> Using spread operator so as to be able to update each record passing only the body parameter to update. Otherwise, if the values were not included, they would be set to "null". 
    {
      new:true
    },
    (err,data)=>{ sendResponse(res, err, data) }
  )
})
// DELETE
.delete((req,res)=>{
  User.findByIdAndDelete(
    req.params.id,
    (err,data)=>{ sendResponse(res, err, data)}
  )
})

//Managing Response Callback

function sendResponse(res, err, data){
  if (err){
    res.json({
      success: false,
      message: err
    })
  } else if (!data){
    res.json({
      success: false,
      message: "Not Found"
    })
  } else {
    res.json({success: true,data: data
    })
  }
}