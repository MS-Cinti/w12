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
    return `
        <div>
            <input type="text" name="firstName" class="firstName" placeholder="First Name">
            <input type="text" name="surname" class="surname" placeholder="Surname">
            <button class="button">Send</button>
        </div>
    `
}

const loadEvent = async () => {
    //így meg tudjuk nézni, hogy hol vagyunk, window.location a web része
    if (window.location.pathname === '/admin/order-view'){
        console.log('Mi most az admin felületen vagyunk.')
    }else{
        console.log('Mi most a vásárlói felületen vagyunk.')
    }

    const result = await parseJSON('/api/v1/users');
    const rootElement = document.getElementById("root");
    rootElement.insertAdjacentHTML(
        "beforeend", 
        result.map(user => userComponent(user)).join("")
    );

    rootElement.insertAdjacentHTML("afterend", addUserComponent());

    //buttonra id és click esemény, ennek hatására fetch post request előkészítése a frontend oldalon, a users/new legyen az endpoint 
    const button = document.querySelector(`.button`);
    const firstName = document.querySelector(`.firstName`);
    const surname = document.querySelector(`.surname`);

    button.addEventListener('click', e => {
        const userData = {
            firstName: firstName.value,
            surname: surname.value
        };
        
        fetch("users/new", {
            method: "POST",
            headers: { //ha nem formDataban dolgozunk, akkor ez nem kell
                'Content-Type': 'application/json' //Media-typeok (MIME) listájában szerepel ez is
            },
            body: JSON.stringify(userData)
        })
        .then(async data => {
            //ha itt ezt kikommentezzük, akkor nem ír errort a böngésző console oldalon
            const user = await data.json();
            rootElement.insertAdjacentHTML("beforeend", userComponent(user));
        })
    })
};

window.addEventListener('load', loadEvent);