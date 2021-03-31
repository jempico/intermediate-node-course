const express= require('express');
const mongoose= require('mongoose');
const bodyParser= require('body-parser');
const port=8000;
const app= express();
//const User=require('./models/User');
//const Hobby=require('./models/Hobby');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');


const HobbySchema = Schema({
  title: { type: String, required: true},
  description: { type: String}
});

let Hobby = mongoose.model('hobby', HobbySchema);

const UserSchema = Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hobbies: [{ type: Schema.Types.ObjectId, ref:'Hobby'}]
});

let User = mongoose.model('user',UserSchema)

User
  .find()
  .populate("hobby")
  .then(user => {
    res.json(user);
  });
  
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

app.use("/", async (req, res) => {
  await Hobby.remove({});
  await Hobby.create({
    title : "Jogging",
    description: 'Running in the park'
  })
  await Hobby.create({
    title : "Cooking",
    description : 'preparing yummy meals'
  })
  await Hobby.create({
    title : "Reading",
    description: 'smart enough to read 5 books a month'
  })
  await User.remove({});
  await User.create({
      name : "Eloi",
      email : "eloi@email.com",
      password :"secretPassword",
      hobbies : await Hobby.findOne({title: 'Jogging'})
  })
  await User.create({
    name : "Ivan",
    email : "ivan@email.com",
    password :"secretPassword",
    hobbies : await Hobby.find()
})
  res.json({
    hobbies: await Hobby.find(),
    users: await User.find(),
  })
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