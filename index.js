import express from "express"; 

const app=express()

const array1=[]

app.use(express.static("public"))

app.use(express.urlencoded({ extended: true }));
app.get("/",(req,res)=>{
    res.render("index.ejs")
})

// app.get("/work",(req,res)=>{
//     res.render("index1.ejs")
// })

app.post("/submit",(req,res)=>{
    array1.push((req.body["Item"]))
    res.render("index.ejs",{array:array1})
})
app.listen(3000,()=>{
    console.log("server running on 3000")
})
