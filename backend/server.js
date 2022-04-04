//cd backend -> npm init -y -> npm install express

const express = require('express');
const fs = require ('fs');
const path = require('path');

const port = 9000;
const app = express();
//next: ha itt végzett akkor hajtson e végre műveletet vagy sem
app.get('/', (req, res, next) => { 
    console.log('Request received.');
    res.send('Thank you for your request! This is our response.')
})

app.get('/something', (req, res, next) => {
    console.log('Request received on something endpoint.');
    res.send('Thank you for your request! This is our response for something endpoint.')
})

app.get('/api/v1/users', (req, res, next) => {
    console.log('Request received for users endpoint.');
    const users = [
        {
            name: 'John',
            surname: "Doe"
        }
    ]
    res.send(JSON.stringify(users)) //a users változót stringként visszaküldjük a frontendnek
})

//minden request beérkezett ide a terminálba

app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`)
})

