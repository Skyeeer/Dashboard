// const { default: axios } = require("axios");

//Ändra nammn på dashboard titel
const saveTitle = localStorage.getItem('DashTitle');

//standard titel
const editableTitle = document.getElementById('DashTitle');
editableTitle.textContent = saveTitle || 'Your Dashboard';

editableTitle.addEventListener('input', function () {
    const newTitle = editableTitle.textContent;
    localStorage.setItem('DashTitle', newTitle);
});

window.addEventListener('load', function () {
    const savedTitle = localStorage.getItem('DashTitle');
    if (!savedTitle) {
        editableTitle.textContent = 'Your Dashboard';
    }
});

//Datum och tid
function updateDateDisplay() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    document.getElementById('date').textContent = formattedDate;
}

function updateTimeDisplay() {
    this.now = new Date();
    let hours = String(this.now.getHours()).padStart(2, '0');
    let minutes = String(this.now.getMinutes()).padStart(2, '0');

    let formattedTime = `${hours}:${minutes}`;
    document.getElementById('time').innerHTML = formattedTime;
}
updateDateDisplay();
updateTimeDisplay();

setInterval(() => {
    updateDateDisplay();
    updateTimeDisplay();
}, 1000);

//Sparar antecknigar
function saveNotes() {
    let value = document.getElementById("notes").value;
    localStorage.setItem("textareaValue", value);
}
function loadNotes() {
    let value = localStorage.getItem('textareaValue');
    document.getElementById("notes").value = value;
}
document.getElementById("notes").addEventListener('input', saveNotes);
window.addEventListener('load', loadNotes);


//Väder API
//Kollar användarens position
document.addEventListener('DOMContentLoaded', function () {

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    } function showPosition(position) {
        // console.log("lat", position.coords.latitude);
        // console.log("long", position.coords.longitude);

        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        fetchData(lat, long)
    } getLocation(); async function fetchData(lat, long) {
        //****************************************************************************************
        // Väder API            Lägg till din egna nyckel i APIkey
        //****************************************************************************************
        const APIkey = "";
        const endpoint = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${APIkey}&units=metric&lang=se`;
        try {
            const response = await axios.get(endpoint)
            displayWeather(response.data);
            // const city = response.data.name;
            // const temperature = response.data.main.temp;
            // const weatherDescription = response.data.weather[0].description;
            // const windSpeed = response.data.wind.speed;
            // console.log("City:", city);
            // console.log("Temperature:", temperature, "°C");
            // console.log("Weather:", weatherDescription);
            // console.log("Wind Speed:", windSpeed, "m/s");
        }
        catch (error) {
            console.log("Error", error.message)
        }
    }

    function displayWeather(data) {
        const city = data.name;
        const temperature = Math.round(data.main.temp);
        const weatherDescription = data.weather[0].description;
        const windSpeed = data.wind.speed;
        const iconCode = data.weather[0].icon;

        const locationEl = document.getElementById('location');
        const tempEl = document.getElementById('temp');
        const descriptionEl = document.getElementById('description');
        const windEl = document.getElementById('windSpeed');
        const iconEl = document.getElementById('weatherIcon');

        locationEl.textContent = `Område: ${city}`;
        tempEl.textContent = ` ${temperature} °C`;
        descriptionEl.textContent = `Väder: ${weatherDescription.charAt(0).toUpperCase()}${weatherDescription.slice(1)}`;
        windEl.textContent = `Vind ${windSpeed} m/s`;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`
        iconEl.src = iconUrl;
    }
    getLocation();
});


//Random background image
async function changeBackground() {
    try {
        //****************************************************************************************
        // Bakgrund API   Lägg till nyckel i key.  (VARNING: Om du ändrar backgrund för snabbt låser sig nyckeln)
        //****************************************************************************************
        const key = ''
        const response = await axios.get(`https://api.unsplash.com/photos/random/?client_id=${key}`);
        const imageURL = response.data.urls.regular;
        console.log(imageURL);

        localStorage.setItem('lastImageUrl', imageURL);

        document.body.style.backgroundImage = `url(${imageURL})`;
    }
    catch (error) {
        console.error('Error fetching and setting background:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const lastImageUrl = localStorage.getItem('lastImageUrl');

    if (lastImageUrl) {
        document.body.style.backgroundImage = `url(${lastImageUrl})`;
    }


    const backgroundBtn = document.getElementById('backgroundBtn');
    if (backgroundBtn) {
        backgroundBtn.addEventListener('click', changeBackground);
    }
})

document.addEventListener('DOMContentLoaded', function () {
    const createCardBtn = document.getElementById('createCard');
    const dialog = document.getElementById('dialog');
    const addLinkBtn = document.getElementById('addLinkBtn');
    const linkContainer = document.getElementById('linkcontainer');

    loadCards();

    createCardBtn.addEventListener('click', () => {
        dialog.style.display = 'block';
    });

    addLinkBtn.addEventListener('click', () => {
        const linkName = document.getElementById('linkName').value;
        const linkURL = document.getElementById('linkURL').value;

        if (linkName && linkURL) {
            const newCard = document.createElement('li');
            newCard.innerHTML =
                `<div class="linkCard">
                    <img src="WeatherIcon/sun.png" class="linkIcon" id="favicon${linkContainer.childElementCount}">
                    <a class="linkLink" href="${linkURL}" target="_blank">${linkName}</a>
                    <div class="linkremove"><img class="delete" src="delete-button.png"></div>
                </div>
            `;
            //favicon bild
            linkContainer.appendChild(newCard);
            const faviconImg = newCard.querySelector(`#favicon${linkContainer.childElementCount - 1}`);
            setFavicon(linkURL, faviconImg);
            saveCards();
            //tömmer input fält 
            document.getElementById('linkName').value = "";
            document.getElementById('linkURL').value = "";
            dialog.style.display = 'none';
        }
    });


    dialog.addEventListener('click', (event) => {
        const closeBtn = event.target.closest('.close');
        if (closeBtn) {
            document.getElementById('linkName').value = '';
            document.getElementById('linkURL').value = '';
            dialog.style.display = 'none';
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && dialog.style.display !== 'none') {
            document.getElementById('linkName').value = '';
            document.getElementById('linkURL').value = '';
            dialog.style.display = 'none';
        }
    });


    function setFavicon(url, imgElement) {
        const faviconUrl = new URL('/favicon.ico', url).href;

        const img = new Image();
        img.onload = function () {
            imgElement.src = faviconUrl;
        }
        img.src = faviconUrl;
    }

    function saveCards() {
        const cards = linkContainer.innerHTML;
        localStorage.setItem('quickAccessCards', cards);
        attachDeleteButtonListeners();
    }

    function loadCards() {
        const saveCards = localStorage.getItem('quickAccessCards');
        if (saveCards) {
            linkContainer.innerHTML = saveCards;
            attachDeleteButtonListeners();
        }
    }

    function attachDeleteButtonListeners() {
        document.addEventListener('click', function (event) {
            const deleteButton = event.target.closest('.delete');
            if (deleteButton) {
                const parentLi = deleteButton.closest('li');
                if (parentLi) {
                    parentLi.remove();
                    saveCards();
                }
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const dogContainer = document.getElementById('dogContainer');
    let dogUrl;
    const dogDate = new Date().toISOString().split('T')[0];
    const lastDate = localStorage.getItem('dogOfTheDayDate');

    if (lastDate !== dogDate) {
        axios.get('https://dog.ceo/api/breeds/image/random')
            .then(response => {
                dogUrl = response.data.message;
                dogContainer.style.backgroundImage = `url('${dogUrl}')`;

                localStorage.setItem('dogOfTheDayDate', dogDate);
                localStorage.setItem('dogOfTheDayImage', dogUrl);
            })
            .catch(error => console.error('Failed at fetching dogs', error));
    }
    else {
        const LastImage = localStorage.getItem('dogOfTheDayImage');
        if (LastImage) {
            dogUrl = LastImage;
            dogContainer.style.backgroundImage = `url('${dogUrl}')`;
        }
    }
});

