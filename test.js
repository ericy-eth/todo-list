const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/todoListDB")

const taskSchema = {
    name: String
  };
  
  const Task = mongoose.model(
    "Task", taskSchema
  );


  Task.deleteMany({__v: 0}, function(err){
    console.log(err);
  })

Task.find({}, function(err, res){
    console.log(res);
})