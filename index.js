import express from "express"; 
import mongoose from "mongoose";

const app=express()

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));

main().then((res)=>{console.log("hello")}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://udaykiran:mEsTaw6c7kcWhEs5@cluster0.jwjamgm.mongodb.net/toDoListDB')
}

const itemSchema=new mongoose.Schema({
    item:String
})

const listSchema=new mongoose.Schema({
    name: String,
    items:[itemSchema]
})

const Item=mongoose.model("Item",itemSchema)
const List=mongoose.model("List",listSchema)

const item1=new Item({item:"welcome to Your ToDoList !"})
const item2=new Item({item:"click new to add new task !"})
const item3=new Item({item:"<-- click here to delete the task !"})

const defaultItems=[item1,item2,item3]

app.get("/",(req,res)=>{
        Item.find().then((resu)=>{
        if(resu.length===0)
        {
            Item.insertMany(defaultItems).then((res)=>{console.log(res)})
            res.redirect("/")
        }
        else
        res.render("index.ejs",{array:resu,listName:"Today"})
    })
})

app.get("/:customListname",(req,res)=>{
       const customListname=req.params.customListname
       List.findOne({name:customListname}).then((resu)=>{
            if(!resu)
            {
                new List({name:customListname,items:defaultItems}).save().then((res)=>{});
                res.redirect("/"+customListname)
            }
            else
            {
                if(resu.items.length===0)
                {
                    defaultItems.forEach(element => {
                        resu.items.push(element)
                    });
                    resu.save().then((res)=>{})
                    res.redirect("/"+resu.name)
                }
                res.render("index.ejs",{array:resu.items,listName:resu.name})
            }
       })
})

app.post("/submit",(req,res)=>{
    const item=new Item({item:req.body["Item"]})
    const list=req.body.new
    if(list==="Today")
    {
        item.save().then((res)=>{})
        res.redirect("/")
    }
    else{
        List.findOne({name:list}).then((resu)=>{
            resu.items.push(item)
            resu.save().then((res)=>{})
            res.redirect("/"+list)
        })
    }  
})

app.post("/delete",(req,res)=>{
    const id=req.body.checkbox
    const list=req.body.Hidden
    if(list==="Today"){
        Item.findByIdAndRemove(id).then((resu)=>{
            res.redirect("/")
        })
    }
    else{
        List.findOneAndUpdate({name:list},{$pull:{items:{_id:id}}}).then((resu)=>{
            res.redirect("/"+list)
        })
    }
})

app.listen(3000,()=>{
    console.log("server running on 3000")
})
