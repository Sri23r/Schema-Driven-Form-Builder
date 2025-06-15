const express = require('express')
const mysql = require('mysql2')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
const PORT = 3000

const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "123456",
    database : "json"
});

db.connect((err) => {
    if(err){
        console.error("Error connecting to mysql : ",err);
        return;
    }else{
        console.log("Connected to mysql");
    }
});

app.get('/', (req, res) => {
    res.send("Server is working");
})

app.get('/Datalist', (req, res) => {
    db.query('select * from DataList', (err, results) => {
        if(err){
            console.error('Error fetching data', err);
            res.status(500).send('database error');
            return;
        }
        console.log("Data fetched : ", results)
        res.json(results);
    });
});

app.post('/',(req, res)=>{
    res.send("server is again working...");
})

app.post('/json_schema', (req, res) => {
    const formData = req.body;
    const jsonString = JSON.stringify(formData);

    const sql = `INSERT INTO json_schema (Form_Data) VALUES (?)`;

    db.query(sql, [jsonString] , (err, result) =>{
        if(err){
            console.log("Error inserting into the json_schema", err);
            return res.status(500).send("Error saving Form data as JSON");
        }else{
            console.log("Form data Saved", result.insertId);
            res.send("Form data saved as JSON successfully")
        }
    });
});

app.listen(PORT,() => {
    console.log(`Server running at http://localhost:${PORT}`);
})