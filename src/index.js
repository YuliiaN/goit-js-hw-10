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
const itemsList = [];

refs.inputRef.addEventListener(
  'input',
  debounce(onInputChanges, DEBOUNCE_DELAY)
);

function onInputChanges(event) {
  const value = event.target.value.trim();
  if (!value) {
    clearDiv();
    clearUl();
  } else {
    fetchCountries(value)
      .then(countries => {
        if (countries.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (countries.length > 2 && countries.length < 10) {
          for (const country of countries) {
            itemsList.push(country);
          }
          clearDiv();
          renderCountriesList(itemsList);
        } else {
          renderCountryCard(countries[0]);
        }
      })
      .catch(debounce(errorAlert, DEBOUNCE_DELAY));
  }
}

function renderCountriesList(arr) {
  const markup = arr
    .map(
      ({ name, flags }) => `
    <li class="country-list__item">
      <img src="${flags.svg}" alt="${name.common} Flag" class="flag" />
      <h2 class="country-list__title">${name.common}</h2>
    </li>`
    )
    .join('');

  refs.ulRef.insertAdjacentHTML('beforeend', markup);
}

function renderCountryCard({ name, flags, capital, population, languages }) {
  const langs = Object.values(languages).join(', ');

  const markup = `<div class="country-name">
  <img src="${flags.svg}" alt="${name.common} Flag" class="flag" />
  <h2 class="country-title">${name.common}</h2>
</div>
<ul class="country-data-list">
  <li class="country-data-item"><span class="span">Capital:</span> ${capital}</li>
  <li class="country-data-item"><span class="span">Population:</span> ${population}</li>
  <li class="country-data-item"><span class="span">Languages:</span> ${langs}</li>
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

function errorAlert() {
  Notify.failure('Oops, there is no country with that name');
}
