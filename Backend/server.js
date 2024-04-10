// const express = require('express');
// const mysql = require('mysql')
// const cors = require('cors')

// const app = express()
// app.use(cors())

// const db = mysql.createConnection({
//     host: "localhost",
//     user: 'root',
//     password: '',
//     database: 'tic_tac_toe'
// })

// app.get('/', (re,res) => {
//     return res.json("form backend test");
// })

// app.get('/game_wins', (req, res)=> {
//     const sql = "SELECT * FROM game_wins";
//     db.query(sql,(err, data)=>{
//         if(err) return res.json(err);
//         return res.json(data);
//     })
// })

// app.listen(3010, () => {
//     console.log("Server is running on port");
// })

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // För att tolka JSON-förfrågningar

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'tic_tac_toe'
});

app.get('/', (re,res) => {
    return res.json("form backend test");
})

app.get('/game_wins', (req, res)=> {
    const sql = "SELECT * FROM game_wins";
    db.query(sql,(err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.post('/saveGameResult', (req, res) => {
    const { winner } = req.body; // Läs in vinnaren från förfråganens kropp
    const timestamp = new Date(); // Skapa en tidsstämpel för aktuell lokal tid
    const sql = "INSERT INTO game_wins (winner, timestamp) VALUES (?, ?)";
    db.query(sql, [winner, timestamp], (err, result) => {
        if (err) {
            console.error('Error saving game result:', err);
            res.status(500).json({ message: 'Error saving game result' });
        } else {
            console.log('Game result saved successfully');
            res.status(200).json({ message: 'Game result saved successfully' });
        }
    });
});

app.listen(3010, () => {
    console.log("Server is running on port 3010");
});
