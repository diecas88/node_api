const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050;

const app = express();

app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    bodyParser.json();
    // Pass to next layer of middleware
    next();

});

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

/* inicio de rutas para la creacion de usuarios */
// obtain users for admin
app.get('/users', (req, res) => {

    const sql = "select * from users";

    conn.query(sql, (error, result) => {
        if (error) throw error;

        if (result.length > 0) {
            res.json(result);
        } else {
            res.send([]);
        }
    })

});

//create users for admin
app.post('/add', bodyParser.json(), (req, res) => {

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
    console.log(userObject);

    conn.query(sql, userObject, error => {
        if (error) throw error;
        res.send({ rta: "was created!" });
    })
});

//read info from users (detail)
app.get('/user/:id', (req, res) => {
    const { id } = req.params;
    const sql = `select * from users where id_user=${id}`;

    conn.query(sql, (error, result) => {
        if (error) throw error;

        if (result.length > 0) {
            res.json(result);
        } else {
            res.json({ rta: 'no found!' });
        }
    })
});

// update info for users
app.put('/update/:id', bodyParser.json(), (req, res) => {

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
        res.send({ rta: "was updated!" });
    })

});

// delete info users, user complete
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;

    const sql = `delete from users where id_user = ${id}`;

    conn.query(sql, error => {
        if (error) throw error;
        res.send({ rta: "was deleted!" });
    })


});


/* this is the begining of methods for creating task, user 75 by default */

// get or obtain all task
app.get('/tasks', (req, res) => {

    const sql = "select * from task";

    conn.query(sql, (error, result) => {
        if (error) throw error;

        if (result.length > 0) {
            res.json(result);
        } else {
            res.send([]);
        }
    })

});

//create a task user 75 by default
app.post('/tasks', bodyParser.json(), (req, res) => {

    const sql = 'insert into task set ?';

    const userObject = {
        id_user: req.body.id_user,
        name_task: req.body.name_task,
        description_task: req.body.description_task,
    }
    console.log(userObject);

    conn.query(sql, userObject, function(error, results) {
        if (error) throw error;
        res.send({ id_task: results.insertId });
    })
});

//read tasks from user (detail)
app.get('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const sql = `select * from task where id_task=${id}`;

    conn.query(sql, (error, result) => {
        if (error) throw error;

        if (result.length > 0) {
            res.json(result);
        } else {
            res.json({ rta: 'no found!' });
        }
    })
});

// update task from users 
app.put('/tasks/:id', bodyParser.json(), (req, res) => {

    const { id } = req.params;
    const {
        id_task,
        name_task,
        description_task
    } = req.body;

    const sql = `update task set name_task = '${name_task}',
        description_task='${description_task}'
        where id_task=${id_task}`;

    conn.query(sql, error => {
        if (error) throw error;
        res.send({ rta: "was updated!" });
    })

});

// delete all task info 
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;

    const sql = `delete from task where id_task = ${id}`;

    conn.query(sql, error => {
        if (error) throw error;
        res.send({ rta: "was deleted!" });
    })


});




// here check connection
conn.connect(error => {
    if (error) throw error;
    console.log('mysql has connection');
})

app.listen(PORT, () => console.log(`server running on port ${PORT}`));