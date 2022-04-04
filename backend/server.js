//cd backend -> npm init -y -> npm install express

const express = require('express');
const fs = require ('fs');
const path = require('path');

const port = 9000;
const app = express();

//next: ha itt végzett akkor hajtson e végre műveletet vagy sem, átpasszolja a következőhöz
app.get('/', (req, res, next) => { 
    //console.log('Request received.');
    //res.send('Thank you for your request! This is our response.')
    
    //ezzel bármilyen létező filet kiszolgálhatunk, ezzel az index.html-el minden filet ki tudunk szolgálni
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
})

//példa gyakorlásnak: itt a someFile.json-t szolgáljuk ki a kismacska endpointon
app.get('/kismacska', (req, res, next) => { 
    res.sendFile(path.join(`${__dirname}/../frontend/someFile.json`));
})

app.get('/something', (req, res, next) => {
    console.log('Request received on something endpoint.');
    res.send('Thank you for your request! This is our response for something endpoint.')
})

//változóba mentjük az elérhetőséget
const userFile = path.join(`${__dirname}/../frontend/users.json`);

app.get('/api/v1/users', (req, res, next) => {
    console.log('Request received for users endpoint.');
    /*
    const users = [
        {
            name: 'John',
            surname: "Doe",
            status: 'active',
        },
        {
            name: 'Cinti',
            surname: "Murai-Szabadi",
            status: 'passive',
        }
    ]
    res.send(JSON.stringify(users)) //a users változót stringként visszaküldjük a frontendnek
    */
   //a fenti users objectet belementettük egy users.json fileba és most elérhetővé tesszük a frontendnek
    res.sendFile(path.join(`${__dirname}/../frontend/users.json`)); 
})

app.get('/api/v1/users/active', (req, res, next) => {
    //fs.readFile-nál error és data van mindig
    fs.readFile('../frontend/users.json', (error, data) => {
        if(error) {
            res.send("Error happened.")
        }else{
            const users = JSON.parse(data)
            //const activeUsers = users.filter(user => user.status === "active");
            //res.send(activeUsers);
            res.send(users.filter(user => user.status === "active"));
        }
    })
})

app.get('/api/v1/users/passive', (req, res, next) => {
    fs.readFile('../frontend/users.json', (error, data) => {
        if(error) {
            res.send("Error happened.")
        }else{
            const users = JSON.parse(data)
            //const passiveUsers = users.filter(user => user.status === "passive");
            //res.send(passiveUsers);
            res.send(users.filter(user => user.status === "passive"));
            //egyesével megyünk végig a usereken a filterben, ezért egyesszámban írjuk a filteren belül)
        }
    })
})

//minden request beérkezett ide a terminálba

//listen elé kell ezt tenni, hogy ne akadjon össze
app.use('/pub', express.static(`${__dirname}/../frontend/public`));

app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`)
})

