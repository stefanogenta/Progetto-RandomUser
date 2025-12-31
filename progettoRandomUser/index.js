"use strict"
let utentiStart = 10;
let nazioni = ["DE", "ES", "FI", "GB", "FR", "NO", "BR", "DK"];
let genere = "";
let nazioniSelezionate = [];
let currentIndex = 0;
let currentPage = 0;
let people = [];
let gridMode = false;

// DOM references (ensure elements exist before using them)
const scelta = document.getElementById('scelta');
const divUtente = document.getElementById('divUtente');

// add some structural classes to separate sections visually
if (scelta) scelta.classList.add('scelta-panel', 'p-3', 'rounded', 'mb-3');
if (divUtente) divUtente.classList.add('users-panel');

generaInput();
generaUsers();

function generaInput() {
    // search box
    let searchWrapper = document.createElement('div');
    searchWrapper.className = "mb-4";
    scelta.appendChild(searchWrapper);
    let searchInput = document.createElement('input');
    searchInput.type = "text";
    searchInput.className = "form-control";
    searchInput.placeholder = "Cerca per nome...";
    searchInput.addEventListener('input', function () {

    });

    //slider e n utenti
    let p = document.createElement("p");
    p.className = "scelta-title mb-2";
    p.textContent = "Inserisci il numero di user da generare: "
    scelta.appendChild(p);
    let value = document.createElement("span");
    value.textContent = "10";
    value.className = "ms-2 fw-bold";
    p.appendChild(value);

    let slide = document.createElement("input")
    slide.addEventListener("change", function () {
        generaUsers();
    });
    slide.type = "range"
    slide.className = "form-range slider";
    slide.min = 1;
    slide.max = 100;
    slide.value = 10;

    slide.addEventListener("input", function () {
        utentiStart = this.value;
        value.textContent = utentiStart;
    })
    scelta.appendChild(slide);

    // input uomo donna 
    let optWrapper = document.createElement("div");
    optWrapper.className = "d-flex align-items-center gap-3 controls-wrapper mt-4";
    scelta.appendChild(optWrapper);


    //uomo
    let lblM = document.createElement("label");
    lblM.className = "custom-radio me-2";
    optWrapper.appendChild(lblM);
    let radioM = document.createElement("input");
    radioM.type = "radio";
    radioM.name = "genere";
    radioM.value = "male";
    radioM.checked = true;
    radioM.addEventListener('change', function () { generaUsers(); });
    lblM.appendChild(radioM);
    let spanM = document.createElement("span");
    spanM.className = "radio-label fs-4";
    spanM.textContent = "♂️";
    lblM.appendChild(spanM);

    //donna
    let lblF = document.createElement("label");
    lblF.className = "custom-radio me-2";
    optWrapper.appendChild(lblF);
    let radioF = document.createElement("input");
    radioF.type = "radio";
    radioF.name = "genere";
    radioF.value = "female";
    radioF.addEventListener('change', function () { generaUsers(); });
    lblF.appendChild(radioF);
    let spanF = document.createElement("span");
    spanF.className = "radio-label fs-4";
    spanF.textContent = "♀️";
    lblF.appendChild(spanF);


    //genera bandiere
    let divNazioniScelta = document.createElement("div");
    divNazioniScelta.className = "d-flex flex-wrap gap-3 mt-3 countries-wrapper mt-5";
    scelta.appendChild(divNazioniScelta);
    for (let i = 0; i < nazioni.length; i++) {
        let lbl = document.createElement("label");
        lbl.className = "lblCountry text-center";
        divNazioniScelta.appendChild(lbl);
        let chk = document.createElement("input");
        chk.type = "checkbox";
        chk.value = nazioni[i];
        chk.className = "country-input";
        lbl.appendChild(chk);

        // toggle visual selected class when checkbox changes
        chk.addEventListener('change', function () {
            if (this.checked) this.parentElement.classList.add('selected');
            else this.parentElement.classList.remove('selected');
            generaUsers();
        });

        let img = document.createElement("img");
        img.src = `./img/${nazioni[i]}.png`;
        img.style.width = "80px";
        img.className = "mt-1 ms-2 flag-img";
        lbl.appendChild(img);
    }


    // bottone per griglia
    let btnGriglia = document.createElement("button");
    btnGriglia.className = "btn btnGriglia mt-4 fw-bold ms-2 btn-secondary";
    btnGriglia.type = 'button';
    btnGriglia.textContent = "Griglia: OFF";
    btnGriglia.addEventListener("click", function () {
        gridMode = !gridMode; // toggle griglia
        currentPage = 0;
        btnGriglia.textContent = gridMode ? 'Griglia: ON' : 'Griglia: OFF';
        btnGriglia.classList.toggle('active', gridMode);
        if (gridMode) {
            displayGriglia();
        }
        else {
            displayUserSingolo();
        }
    })
    scelta.appendChild(btnGriglia);
}

function displayGriglia() {
    let griglia = document.createElement('div');
    griglia.classList.add('griglia', 'ms-4', 'ms-sm-2');

    let start = currentPage * 6;
    for (let i = start; i < start + 6 && i < people.length; i++) {
        let person = people[i];
        let cella = document.createElement('div');
        cella.classList.add('cella', 'p-2');


        let img = document.createElement('img');
        img.src = person.picture.thumbnail;
        img.style.width = '80px';
        img.style.height = '80px';
        img.style.borderRadius = '50%';
        cella.appendChild(img);

        let nome = document.createElement('h5');
        nome.textContent = `${person.name.title} ${person.name.first} ${person.name.last}`;
        cella.appendChild(nome);

        let backCard = document.createElement('div');
        backCard.classList.add('cella-back');
        cella.appendChild(backCard);

        let eta = document.createElement('p');
        eta.textContent = "Età: " + (person.registered && person.registered.age ? person.registered.age : '') + " anni";
        backCard.appendChild(eta);

        let email = document.createElement('p');
        email.textContent = "Email: " + (person.email || '');
        backCard.appendChild(email);

        let naz = document.createElement('p');
        naz.textContent = "Nazionalità: " + (person.location && person.location.country ? person.location.country : (person.nat || ''));
        backCard.appendChild(naz);

        griglia.appendChild(cella);
    }

    // arrow per navigare tra le pagine di griglia
    let btnWrapper = document.createElement('div');
    btnWrapper.className = 'w-100 d-flex justify-content-center mt-3 gap-2';

    let btnPrev = document.createElement('button');
    btnPrev.className = 'btn btn-secondary';
    btnPrev.disabled = (currentPage <= 0);
    btnPrev.addEventListener('click', function () {
        if (currentPage > 0) { currentPage--; displayGriglia(); }
    });
    let imgPrev = document.createElement('img');
    imgPrev.src = './img/icons/prev.png';
    imgPrev.style.width = '25px';
    btnPrev.appendChild(imgPrev);
    btnWrapper.appendChild(btnPrev);

    let btnNext = document.createElement('button');
    btnNext.className = 'btn btn-secondary';
    btnNext.disabled = ((currentPage + 1) * 6 >= people.length);
    btnNext.addEventListener('click', function () {
        if ((currentPage + 1) * 6 < people.length) { currentPage++; displayGriglia(); }
    });
    let imgNext = document.createElement('img');
    imgNext.src = './img/icons/next.png';
    imgNext.style.width = '25px';
    btnNext.appendChild(imgNext);
    btnWrapper.appendChild(btnNext);

    // swap with fade
    $(divUtente).stop(true, true).fadeOut(160, function () {
        divUtente.innerHTML = '';
        divUtente.appendChild(griglia);
        divUtente.appendChild(btnWrapper);
        $(divUtente).fadeIn(260);
    });
}
function generaUsers() {
    divUtente.innerHTML = "";
    divUtente.classList.add("d-flex", "flex-wrap", "gap-2");

    nazioniSelezionate = [];

    let radio = scelta.querySelector('input[type="radio"]:checked');
    if (!radio) {
        genere = "";
    }
    else {
        genere = radio.value;
    }
    let chkSelezionati = scelta.querySelectorAll('input[type="checkbox"]:checked');
    for (let chk of chkSelezionati) {
        nazioniSelezionate.push(chk.value);
    }

    currentIndex = 0;
    let promise = ajax.sendRequest("GET", `/api?results=${utentiStart}&gender=${genere}&nat=${nazioniSelezionate.join(",")}`)
    promise.catch(ajax.errore)
    promise.then(function (httpResponse) {
        people = httpResponse.data.results;
        if (gridMode) displayGriglia();
        else displayUserSingolo();
    })

}



function displayUserSingolo() {
    let person = people[currentIndex];


    let card = document.createElement("div");
    card.className = "user-card card p-4 rounded d-flex flex-column align-items-center";

    let img = document.createElement("img");
    img.src = person.picture.large || person.picture.medium || person.picture.thumbnail;
    img.className = "mb-3 user-image";
    card.appendChild(img);

    let name = document.createElement("h5");
    name.textContent = `${person.name.title} ${person.name.first} ${person.name.last}`;
    name.className = "user-name mb-2 text-center fw-bold";
    card.appendChild(name);

    let email = document.createElement("p");
    email.textContent = person.email;
    email.className = "user-email mb-1 text-center";
    card.appendChild(email);

    let country = document.createElement("p");
    country.textContent = person.location && person.location.country ? person.location.country : (person.nat || "");
    country.className = "user-country mb-0 text-center";
    card.appendChild(country);

    // arrows per navigare
    let btnWrapper = document.createElement("div");
    btnWrapper.className = "w-100 d-flex justify-content-center mt-3 gap-2";

    // prev
    let btnPrev = document.createElement("button");
    btnPrev.addEventListener("click", Prev);
    btnPrev.className = "btn btn-secondary";
    btnPrev.disabled = (currentIndex <= 0);
    btnWrapper.appendChild(btnPrev);
    img = document.createElement("img");
    img.src = "./img/icons/prev.png";
    img.style.width = "25px";
    btnPrev.appendChild(img);

    // next
    let btnNext = document.createElement("button");
    btnNext.addEventListener("click", Next);
    btnNext.className = "btn btn-secondary";
    btnNext.disabled = (currentIndex >= people.length - 1);
    btnWrapper.appendChild(btnNext);
    img = document.createElement("img");
    img.src = "./img/icons/next.png";
    img.style.width = "25px";
    btnNext.appendChild(img);

    card.appendChild(btnWrapper);

    // animazioni fade
    $(divUtente).stop(true, true).fadeOut(160, function () {
        divUtente.innerHTML = "";
        divUtente.appendChild(card);
        $(divUtente).fadeIn(260);
    });
}

function Next() {
    if (!people || currentIndex >= people.length - 1) return;
    currentIndex++;
    displayUserSingolo();
}

function Prev() {
    if (!people || currentIndex <= 0) return;
    currentIndex--;
    displayUserSingolo();
}

