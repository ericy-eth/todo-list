//jshint esversion:6
require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
let isData = false;
const app = express();
app.set('view engine', 'ejs');

const serverUser = process.env.KEY;
const serverPassword = process.env.SECRET;
const _ = require("lodash")

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://"+serverUser+":"+ serverPassword +"@cluster0.qkhuswz.mongodb.net/todoListDB")

const taskSchema = {
  name: String
};

const Task = mongoose.model(
  "Task", taskSchema
);

const task1 = new Task({
  name: "Welcome to To Do List!"
})

const task2 = new Task({
  name: "Click the + to add items"
})

const defaultTasks = [task1, task2]

const listSchema = {
  name: String,
  items: [taskSchema]
}

const List = mongoose.model("List", listSchema)

app.get("/", function(req, res) {

  Task.find({}, function(err, fetchedItems){
    if(fetchedItems.length===0){
      Task.insertMany(defaultTasks, function(err){
        if(err){
          console.log(err);
        }
      })
      res.redirect("/")
    }else{
      res.render("list", {listTitle: "Today", newListItems: fetchedItems});
    }
      
    

  })

});

if(!isData){
  
}

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Task({
    name: itemName
  })

  if(listName==="Today"){
    item.save();
    res.redirect("/")
  } else{
    List.findOne({name: listName}, function(err, foundList){
      if(err){
        console.log(err);
      }else{
        foundList.items.push(item)
        foundList.save()
        res.redirect("/"+listName)
      }
    })
  }




});

app.post("/delete", function(req,res){
  const checkedItemID = req.body.checkbox;
  const listName = req.body.listName;
  if(listName==="Today"){
    Task.findByIdAndRemove(checkedItemID, function(err){
      if(!err){
        res.redirect("/")

      }
    })
  }else{
    List.findOneAndUpdate({name: listName},{$pull: {items: {_id: checkedItemID}}}, function(err, foundList){
      if(!err){
        res.redirect("/" + listName)
      }
    })
  }
  
})

app.get("/:category", function(req,res){
  const listName = _.capitalize(req.params.category);
  List.findOne({name: listName}, function(err, item){
   if(!err){
    if(!item){
      const list = new List({
        name: listName,
        items: defaultTasks
      })
    
      list.save();
      res.redirect("/" + listName)
    }else{
      console.log("Items", item.items);
      res.render("list", {listTitle: item.name, newListItems: item.items})

    }
   }

    
  })
 
})

app.get("/about", function(req, res){
  res.render("about");
});
let port = process.env.PORT;
if(port==null || port == ""){
  port = 3000
  
}
app.listen(port, function(){
  console.log("App deployed on port ", port);

})


