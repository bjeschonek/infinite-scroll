//API Variables
const accessKey = config.API_KEY;
const photoCount = 4;
const apiUrl = `https://api.unsplash.com/photos/random?client_id=${accessKey}&count=${photoCount}`;

//DOM Elements
const loader = document.getElementById('loader');
const imageContainer = document.getElementById('image-container');

//Other Variables
let imageArray = [];
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;

//Checking images loaded

function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
    }
}

//Request Photos

async function getPhotosFromAPI() {
    try {
        const requestPhotos = await fetch(apiUrl);
        imageArray = await requestPhotos.json();
        displayPhotos();
    } catch (error) {
        console.log(error);
        setTimeout(getPhotosFromAPI, 10000);
    }
}

//Display Photos

function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

function displayPhotos() {
    imagesLoaded = 0;
    totalImages = imageArray.length;
    imageArray.forEach((image) =>  {
        const newLinkElement = document.createElement('a');
        setAttributes(newLinkElement, {
            href: image.links.html,
            target: '_blank'
        });
        const newImageElement = document.createElement('img');
        setAttributes(newImageElement, {
            src: image.urls.regular,
            alt: image.alt_description,
            title: image.alt_description
        });
        newImageElement.addEventListener('load', imageLoaded);
        newLinkElement.appendChild(newImageElement);
        imageContainer.appendChild(newImageElement);
    });
}

//Display additional photos based on scroll

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getPhotosFromAPI();
    }
})

//On Load
getPhotosFromAPI();