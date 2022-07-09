// Joi for input validation
const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json()); // parsing json

const users = [
    {id: 1, name: 'User 1'},
    {id: 2, name: 'User 2'},
    {id: 3, name: 'User 3'},
]

app.get('/', (req, res) => {
    res.send('Hello world!!');
});
app.get('/api', (req, res) => {
    res.send([1, 2, 3]);
});
app.get('/user/:id', (req, res) => {
    let user = users.find(c => c.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('User with given id is not found');
    res.send(user.id + '   '+user.name);
});
app.get('/posts/:year/:month', (req, res) => {
    //res.send(req.params + ' year '+req.params.year + 'month '+req.params.month);
    res.send(req.query);//query params ?sortBy=name
});

// da testare con postman
app.post('/user', (res, req) => {
    const {error} = validateUser(req.body);//result.error
    if (error) return res.status(400).send(error.details[0].message);
    const user = {
        id: users.length + 1,
        name: req.body.name // parsing json body
    };
    users.push(user);
    res.send(user);
});

// if selected user exists, update it
app.put('/user/:id', (req, res) => {
    let user = users.find(c => c.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('User with given id is not found');

    const {error} = validateUser(req.body);//result.error
    if (error) return res.status(400).send(error.details[0].message);

    user.name = req.body.name;
    res.send(user);
});

app.delete('/user/:id', (res, req) => {
    let user = users.find(c => c.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('User with given id is not found');

    const index = users.indexOf(user);
    users.splice(index, 1);

    res.send(users);
});

function validateUser(user) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(req.body, schema);

}

//app.get();
//app.post();
//app.put();
//app.delete();
const port = process.env.PORT || 3000; // env OS vars -> win: set PORT=5000; export PORT=5000
app.listen(port, () => console.log("Listening on port "+ port));