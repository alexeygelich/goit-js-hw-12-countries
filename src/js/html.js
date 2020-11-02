import {error, defaultModules} from '../../node_modules/@pnotify/core'; 
import * as PNotifyDesktop from '../../node_modules/@pnotify/desktop';
import '../../node_modules/@pnotify/core/dist/BrightTheme.css';
import "../../node_modules/@pnotify/core/dist/PNotify.css";
import fetchCountries from './fetchCountries.js';
import debounce from '../../node_modules/lodash.debounce/index.js'

defaultModules.set(PNotifyDesktop, {});
const inputRef = document.querySelector('input');
const resultRef = document.querySelector('.result');
const helpRef = document.querySelector('.help');

let country = '';
const clearRef = document.querySelector('button')
clearRef.disabled = true;

if (localStorage.getItem("name")) { 
    resultRef.innerHTML = `<h2 class='title'>${localStorage.getItem("name")}</h2>
                <div class='about-country'>
                <ul class='about-country-list'>
                <li><b>Capital: </b>${localStorage.getItem("capital")}</li>
                <li><b>Population: </b>${localStorage.getItem("population")}</li>
                <li><b>Languages: </b>
                <ul class='languages-list'>
                </ul>
                </li>
                </ul>
                <img class='country-img' src=${localStorage.getItem("flag")} width='300'>
                </div>`;
    JSON.parse(localStorage.getItem("languages")).forEach(({ name }) => {
        document.querySelector('.languages-list').insertAdjacentHTML('beforeend', `<li>${name}</li>`)
    });
}


const onSelectCountry = data => {
    helpRef.innerHTML = ``;
    clearRef.disabled = true;
    inputRef.value = '';
    let objCountry = data[0];
    const { name, capital, population, languages, flag } = objCountry;
                
    resultRef.innerHTML = `<h2 class='title'>${name}</h2>
                <div class='about-country'>
                <ul class='about-country-list'>
                <li><b>Capital: </b>${capital}</li>
                <li><b>Population: </b>${population}</li>
                <li><b>Languages: </b>
                <ul class='languages-list'>  
                </ul>
                </li>
                </ul>
                <img class='country-img' src=${flag} width='300'>
                </div>`;
    languages.forEach(({ name }) => {
        document.querySelector('.languages-list').insertAdjacentHTML('beforeend', `<li>${name}</li>`)
    });
    localStorage.setItem("name", name);
    localStorage.setItem("capital", capital);
    localStorage.setItem("population", population);
    localStorage.setItem("flag", flag);
    localStorage.setItem("languages", JSON.stringify(languages));
};

const onInput = e => { 
    country = e.target.value;
    if (!e.target.value) { 
        helpRef.innerHTML = '';
        return
    }
    fetchCountries(country)
        .then(data => data.json())
        .then(data => {
            if (data.length > 10) {
                const myNotice = error({
                    title: 'Too many matches found',
                    text: "Please enter a more specific query",
                    modules: new Map([
                        ...defaultModules,
                        [PNotifyDesktop, {
                        // Desktop Module Options
                        }]
                    ])
                    });
                    return
                }
            if (data.length === 1) {
                    onSelectCountry(data);
                }
            else {
                    clearRef.disabled = false;
                    helpRef.innerHTML = `<ul class="country-list"></ul>`;
                    const helpListRef = document.querySelector('.country-list');
                    data.forEach(({ name }) => {
                        helpListRef.insertAdjacentHTML('beforeend', `<li class='country-list-item'>${name}</a></li>`)
                    })
                }
            
        })
        .catch(err => {
            inputRef.value = '';
            const errNotice = error({
                    title: 'Invalid input format',
                    text: "Please try again",
                    modules: new Map([
                        ...defaultModules,
                        [PNotifyDesktop, {
                        }]
                    ])
                    });
        })
}


const helpFn = e => { 
    if (e.target.nodeName === "LI") { 
        country = e.target.textContent;
        fetchCountries(country)
            .then(data => data.json())
            .then(onSelectCountry)
    };
}

const clearFn = function () { 
    resultRef.innerHTML = '';
    helpRef.innerHTML = '';
    inputRef.value = '';
    clearRef.disabled = true;
}

inputRef.addEventListener('input', debounce(onInput, 500));
helpRef.addEventListener('click', helpFn);
clearRef.addEventListener('click', clearFn);