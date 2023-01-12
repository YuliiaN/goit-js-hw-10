import './css/styles.css';
import fetchCountries from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;
const refs = {
  inputRef: document.querySelector('#search-box'),
  ulRef: document.querySelector('.country-list'),
  divRef: document.querySelector('.country-info'),
};

refs.inputRef.addEventListener(
  'input',
  debounce(onInputChanges, DEBOUNCE_DELAY)
);

function onInputChanges(event) {
  const value = event.target.value;
  if (!value) {
    clearDiv();
    clearUl();
    return;
  } else {
    fetchCountries(value.trim())
      .then(countries => {
        if (countries.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (countries.length > 2 && countries.length < 10) {
          for (const country of countries) {
            clearDiv();
            renderCountriesList(country);
          }
        } else {
          renderCountryCard(countries[0]);
        }
      })
      .catch(console.log);
  }
}

function renderCountriesList(country) {
  const name = country.name.common;
  const flag = country.flags.svg;
  const markup = `
    <li class="country-list__item">
        <img src="${flag}" alt="${name} Flag" class="flag" />
        <h2 class="country-list__title">${name}</h2>
    </li>`;

  refs.ulRef.insertAdjacentHTML('beforeend', markup);
}

function renderCountryCard(country) {
  const name = country.name.common;
  const flag = country.flags.svg;
  const capital = country.capital[0];
  const population = country.population;
  const languages = Object.values(country.languages).join(', ');

  const markup = `<div class="country-name">
  <img src="${flag}" alt="${name} Flag" class="flag" />
  <h2 class="country-title">${name}</h2>
</div>
<ul class="country-data-list">
  <li class="country-data-item"><span class="span">Capital:</span> ${capital}</li>
  <li class="country-data-item"><span class="span">Population:</span> ${population}</li>
  <li class="country-data-item"><span class="span">Languages:</span> ${languages}</li>
</ul>
`;

  clearUl();
  refs.divRef.innerHTML = markup;
}

function clearDiv() {
  refs.divRef.innerHTML = '';
}

function clearUl() {
  refs.ulRef.innerHTML = '';
}
