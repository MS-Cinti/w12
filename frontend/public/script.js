const parseJSON = async (url) => {
    //változóba mentjük a fetchet
    const response = await fetch(url);
    return response.json();
};

//objectumból kibontjuk a kulcsait: ({name, surname})
const userComponent = ({firstName, surname}) => {
    return `
        <div>
            <h1>${firstName}</h1>
            <h2>${surname}</h2>
        </div>
    `
};

function addUserComponent() {
    //ha az egész formban lenne és a gomb is azon belül, akkor lenne egy automatikus submit esemény a gombon, itt most click lesz rajta
    return `
        <div>
            <input type="text" name="firstName" class="firstName" placeholder="First Name">
            <input type="text" name="surname" class="surname" placeholder="Surname">
            <button class="button">Send</button>
        </div>
    `
}

const loadEvent = async () => {
    //így meg tudjuk nézni, hogy hol vagyunk, window.location a webapi része, nem a szerver oldalhoz tartozik
    if (window.location.pathname === '/admin/order-view'){
        console.log('Mi most az admin felületen vagyunk.')
    }else{
        console.log('Mi most a vásárlói felületen vagyunk.')
    }

    const result = await parseJSON('/api/v1/users');
    
    const rootElement = document.getElementById("root");
    rootElement.insertAdjacentHTML(
        "beforeend", 
        result.map(user => userComponent(user)).join("") //a map egy tömböt ad vissza és azt a joinoljuk stringgé 
    );

    rootElement.insertAdjacentHTML("afterend", addUserComponent()); //a fc eredményét akarjuk ezért ki kell tenni a () jeleket

    //buttonra id és click esemény, ennek hatására fetch post request előkészítése a frontend oldalon, a users/new legyen az endpoint 
    const button = document.querySelector(`.button`);
    const firstName = document.querySelector(`.firstName`);
    const surname = document.querySelector(`.surname`);

    button.addEventListener('click', e => {
        //e.preventDefault();  itt ez most nem kell, csak akkor ha a gomb formban van, mert akk postol automatikusan
        //linkeknél kellhet még click események esetén
        const userData = {
            firstName: firstName.value,
            surname: surname.value
        };

        //formDatát pl képfájl feltöltésnél kell használni, appendeléssel, speciális doboz, több kül. jellegű dolgot lehet ezzel postolni
        //express file upload kell a képfeltöltéshez
        
        fetch("users/new", {
            method: "POST",
            headers: { //ha formDataban dolgozunk, akkor ez nem kell, mert form és formData esetében ez automatikus, clicknél kell
                'Content-Type': 'application/json' //Media-typeok (MIME) listájában szerepel ez is
            },
            body: JSON.stringify(userData) //stringként küldjük el a userDatát
        })
        .then(async data => {
            const user = await data.json(); //a datát json-né konvertáljuk
            rootElement.insertAdjacentHTML("beforeend", userComponent(user)); //átadjuk a usert a userComponentnek
        })
    })
};

window.addEventListener('load', loadEvent);