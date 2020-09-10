const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050;

const app = express();

app.use(bodyParser.json());

//mysql
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mytest'
});

// routes
app.get('/', (req, res) => {
    res.send('wellcome here!');
});

// see all
app.get('/users', (req, res) => {

    const sql = "select * from users";

    conn.query(sql, (error, result) => {
        if (error) throw error;

        if (result.length > 0) {
            res.json(result);
        } else {
            res.send("no rows!");
        }
    })

});

//create
app.post('/add', (req, res) => {

    const sql = 'insert into users set ?';

    const userObject = {
        name: req.body.name,
        last_name: req.body.last_name,
        born_date: req.body.born_date,
        address: req.body.address,
        phone: req.body.phone,
        user_role: req.body.user_role,
        gender: req.body.gender
    }

    conn.query(sql, userObject, error => {
        if (error) throw error;
        res.send("was created!");
    })
});

//read
app.get('/user/:id', (req, res) => {
    const { id } = req.params;
    const sql = `select * from users where id_user=${id}`;

    conn.query(sql, (error, result) => {
        if (error) throw error;

        if (result.length > 0) {
            res.json(result);
        } else {
            res.send("no users with internal id!");
        }
    })
});

// update
app.put('/update/:id', (req, res) => {

    const { id } = req.params;
    const {
        name,
        last_name,
        born_date,
        address,
        phone,
        user_role,
        gender
    } = req.body;

    const sql = `update users set name = '${name}',
        last_name = '${last_name}', born_date = ${born_date},
        address = '${address}', phone='${phone}',
        user_role='${user_role}',gender='${gender}' where id_user=${id}`;

    conn.query(sql, error => {
        if (error) throw error;
        res.send("was updated!");
    })

});

// delete
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;

    const sql = `delete from users where id_user = ${id}`;

    conn.query(sql, error => {
        if (error) throw error;
        res.send("was deleted!");
    })


});

// here check connection
conn.connect(error => {
    if (error) throw error;
    console.log('mysql has connection');
})

app.listen(PORT, () => console.log(`server running on port ${PORT}`));