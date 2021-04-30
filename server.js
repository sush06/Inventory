const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const MongoClient=require('mongodb').MongoClient

var db; var s;
MongoClient.connect('mongodb://localhost:27017/Inventory',(err,database)=>{
    if(err) return console.log(err)
    db=database.db('Inventory')
    app.listen(4500,()=>{
        console.log('Listening at port number 4500')
    })
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/',(req,res)=>{
    db.collection('books').find().toArray((err,result)=>{
        if(err) return console.log(err)
        res.render('home.ejs', {data: result})
    })
})

app.get('/create',(req,res)=>{
    
        res.render('additem.ejs')
})

app.get('/updatestock',(req,res)=>{
    res.render('update.ejs')
})

app.get('/deleteitem',(req,res)=>{
    res.render('deleteitem.ejs')
})

app.post('/AddData',(req,res)=>{
    db.collection('books').save(req.body, (err,result)=>{
        if(err) console.log(err)
        res.redirect('/')
    })
})

app.post('/update', (req,res)=>{
    db.collection('books').find().toArray((err,result)=>{
        if(err) return console.log(err)
    console.log(req.body.id)
    for(var i=0;i<result.length;i++){
        if(result[i].book_id==req.body.id){
            s=result[i].stock
            console.log(s)
            break
        }
    }
    db.collection('books').findOneAndUpdate({book_id:req.body.id},{
        $set:{stock:parseInt(s)+parseInt(req.body.stock)}},{sort:{_id:-1}},
        (err,result)=>{
            if(err) return res.send(err)
        console.log(req.body.stock+'stock updated')
        res.redirect('/')
    })
})
})

app.post('/delete',(req,res)=>{
    db.collection('books').findOneAndDelete({book_id:req.body.id},(err,result)=>{
        if(err) return console.log(err);
        res.redirect('/');
    });
});


