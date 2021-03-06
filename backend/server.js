//cd backend -> npm init -y -> npm install express

const express = require('express');
const fs = require ('fs'); 
const path = require('path');

const port = 9000;
const app = express(); //ez mindig ide fentre kell

app.use(express.json()); //ezt mindig a const app alá kell írni!, a megfelelő esetekben json-ná alakítja a req.body-ját és hozzácsatolja a req-hez, a benne található kulcsérték párok, amiket elküld a frontend, elérhetővé válnak számunkra

//frontendFolder változóba mentve az elérése a frontendnek
const fFolder = `${__dirname}/../frontend`;


//next: ha itt végzett akkor hajtson e végre műveletet vagy sem, átpasszolja a következő gethez
app.get('/', (req, res, next) => { 
    //console.log('Request received.');
    //res.send('Thank you for your request! This is our response.')
    
    //ezzel bármilyen létező filet kiszolgálhatunk, ezzel az index.html-el minden filet ki tudunk szolgálni
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
})

app.get('/admin/order-view', (req, res, next) => { 
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
//ha belépek a backendbe és onnan indítom el a szervert, akkor onnantól nézi a relatív eléréseket
//dirname egy globális változó, ez mutat a backend mappára
const userFile = path.join(`${__dirname}/../frontend/users.json`);

app.get('/api/v1/users', (req, res, next) => {
    console.log('Request received for users endpoint.');
    /*
    const users = [
        {
            firstName: 'John',
            surname: "Doe",
            status: 'active',
        },
        {
            firstName: 'Cinti',
            surname: "Murai-Szabadi",
            status: 'passive',
        }
    ]
    res.send(JSON.stringify(users)) //a users változót stringként visszaküldjük a frontendnek
    */
   //a fenti users objectet belementettük egy users.json fileba és most elérhetővé tesszük a frontendnek
    res.sendFile(path.join(`${__dirname}/../frontend/users.json`)); 
})

app.get('/api/v1/users-query', (req, res, next) => { //sok azonosítást tudunk ezzel csinálni, kérdőjeles verzió, webes standard 
    //pl http://127.0.0.1:9000/api/v1/users-query?apiKey=apple, mit szolgáljunk ki ezen a címen?!
    console.dir(req.query) //clg.dir kulcsértékpároknál
    console.log(req.query.apiKey)
    if (req.query.apiKey === 'apple'){
        res.sendFile(path.join(`${__dirname}/../frontend/users.json`));  
    }else{
        res.send('Unauthorized request.')
    }
})

//key értéke apple lett, mert böngészőben a :key helyére apple-t írtunk, terminálban megkapjuk az apple-t
/*app.get('/api/v1/users-params/:key', (req, res, next) => {
    console.dir(req.params) //clg.dir kulcsértékpároknál
    console.log(req.params.key)
    if(req.params.key === 'apple'){
        res.send('Almát írtál be.')
    }else{
        res.send('Nem almát írtál be.')
    }
})
*/
/*
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
*/

//active és passive paramsra átalakítva egy get requestbe:
app.get('/api/v1/users-params/:key', (req, res, next) => { //express képes erre, hogy változóként kezelje az url : utáni részét
    //pl http://127.0.0.1:9000/api/v1/users-params/active
    console.dir(req.params) //clg.dir kulcsértékpároknál
    console.log(req.params.key)
    fs.readFile(userFile, (error, data) => {  //userFile változó elérési útvonal és callback fc kell a readFilenak 
        const users = JSON.parse(data) //innen elérhető mindegyik if számára a users változó
        if(req.params.key === 'active'){
            const activeUsers = users.filter(user => user.status === "active");
            res.send(activeUsers)
        }else if(req.params.key === 'passive'){
            const passiveUsers = users.filter(user => user.status === "passive")
            res.send(passiveUsers)
        }else{
            res.send("Error happened.")
        }
    })
})

//adat hozzáadása json filehoz:
app.post("/users/new", (req, res) => { //request = kérés, response = válasz
    //1.arg: json file elérés, 2.arg: callback fc: mit kapunk vissza a beolvasáskor, és hiba esetén mi legyen
    fs.readFile(`${fFolder}/users.json`, (error, data) => { 
        //beolvassuk a readFilelal a users.json-t, az error kiírja a hibát, a data visszaadja az adatot a fileban 
        if(error){
            console.log(error);
            res.send("Error reading users file.")
        }else{
            //felprocesszáljuk jsonba a datát a parse-al, stringként kapjuk az adatokat, ezeket js objektummá kell parsolni
            const users = JSON.parse(data) 
            console.log(req.body);
            users.push(req.body); //a usert pusholom bele a users változóba, itt updatelem

            //újra stringgé kell alakítanunk az adatot, hogy a file-ba bele tudjuk írni
            //1.arg: elérés, 2.arg: mit írjunk bele, 3.arg: callback fc, amiben az errort akarjuk újra 
            fs.writeFile(`${fFolder}/users.json`, JSON.stringify(users), error => { 
                if(error){
                    console.log(error);
                    res.send("Error writing users file.")
                }
            })
            res.send(req.body); //writefile-on kívülre kell ez! ha nincs hiba, akkor visszaküldjük a req.body-t
        }
    })
})

//minden request beérkezett ide a terminálba

//listen elé kell ezt tenni, hogy ne akadjon össze
app.use('/pub', express.static(`${fFolder}/../frontend/public`));

//fent csináltunk egy port változót
app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`)
})

