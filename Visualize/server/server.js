const express = require('express')
const mysql = require('mysql')

require('dotenv').config()

const app = express()
const port = 3000

const db = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        port: process.env.PORT
})

db.connect((err)=>{ err ? console.log("Erreur de connection", err) : console.log("Connection réussie") })

app.use((_, res, next)=>{
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

app.get('/api/data', (_, res)=>{
    const query = 'SELECT * from visualize'
    db.query(query, (err, results)=>{
        if (err)
            throw err
        res.json(results)
    })
})

app.listen(port, ()=>{ console.log(`Serveur en cours d'exécution sur le port ${port}`) })