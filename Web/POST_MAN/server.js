const express = require('express');
const app = express();

app.use(express.json());


var book = [
  {
    "id" : "1",
    "name" : "kathir"
  },
  {
    "id" : "2",
    "name" : "mohan"
  },
  {
    "id" : "3",
    "name" : "surya"
  },
  {
    "id" : "4",
    "name" : "irfan"
  }
];

app.get("/user/:id", (req, res)=>{
  let ID = req.params.id;
  for(let i = 0; i < book.length; i++){
    if(book[i].id == ID){
      res.json(book[i]);
      return;
    }
  }
  res.json({"result" : "book id not found"});
});

app.get("/user", (req, res)=>{
  res.json(book);
});

app.post("/user", (req, res)=>{
  book.push(req.body)
  res.json({"result": "added in the array"});
});

app.put("/user/:id", (req, res)=>{
  let ID = req.params.id;
  for(let i = 0; i < book.length; i++){
    if(book[i].id == ID){
      book[i].name = req.body.name;
    } 
  }
  res.json({"result": "updated in the array"});
});

app.delete("/user/:id", (req, res)=>{
  let ID = req.params.id;
  book = book.filter(x => x.id !== ID);
  res.json({"result" : "deleted int the array"});
});

app.listen(5000, ()=>{
  console.log("server is running on port 5000");
});