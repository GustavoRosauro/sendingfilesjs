const mysql = require('mysql');
const express = require('express');
var fs = require('fs');
var app = express();
const bodyparser = require('body-parser');
var upload = require('express-fileupload');
const path = require('path');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host:'den1.mysql5.gear.host',
    user:'documentos',
    password:'C@LeS1ta',
    database:'documentos'
})
app.listen( process.env.PORT||8080, ()=>console.log('Porta 8080'))
mysqlConnection.connect((err)=>{
    if(!err){
        console.log('Conexão bem Sucedida')
    }else{
        console.log('Não foi possivel se conectar')
    }
})

app.get('/',(req,res)=>{
    res.writeHead(200,{'content-type':'text/html'})
    fs.readFile('./arquivos.html',null,(err,data)=>{
        if(err){
            console.log(err)
        }else{
            res.write(data);
        }
        res.end();
    })
});
app.use(upload());

app.get('/',(req,res)=>{
    res.sendFile(__dirname+"arquivos.html");
})

app.post("/",(req,res)=>{
    if(req.files){
        var file = req.files.filename,
        filename = file.name + Date.now();
        file.mv("./upload/"+filename,(err)=>{
            if(err){
                console.log(err);
            }else{
                mysqlConnection.query("INSERT INTO DOCUMENTOS (NOME) VALUES ('"+filename+"')");
            }
            res.end();
        })
    }
});
app.get("/file",(req,res)=>{
    mysqlConnection.query("SELECT * FROM DOCUMENTOS ",(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err);
        }
    })
});
app.get('/selecionar/:id',(req,res)=>{
    mysqlConnection.query('SELECT * FROM DOCUMENTOS WHERE ID = ?',[req.params.id],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err);
        }
    })
});
app.get('/dowload/:nome',(req,res)=>{
    var file = req.params.nome;
    var filelocation = path.join('./upload',file);
    console.log(filelocation);
    res.download(filelocation,file);
})