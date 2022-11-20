import { api } from './api.js';
import { Card } from './card.js';
import { TIME_LSTORAGE } from './constants.js';
import { Popup } from './popup.js';
import { serializeForm, setDataRefresh } from './utilits.js';

const cardsContainer = document.querySelector('.cards');
const btnOpenPopupForm = document.querySelector('#add');
const btnOpenPopupLogin = document.querySelector('#login');
const formCatAdd = document.querySelector('#popup-form-cat');
const formLogin = document.querySelector('#popup-form-login');
const popupAddCat = new Popup('popup-add-cats');
popupAddCat.setEventListener();
const popupLogin = new Popup('popup-login');
popupLogin.setEventListener();

function createCat(data) {
  const cardInstance = new Card(data, '#card-template');
  const newCardElement = cardInstance.getElement();
  cardsContainer.append(newCardElement);
}

function handleFormAddCat(e) {
  e.preventDefault();
  const elementsFormCat = [...formCatAdd.elements];
  const dataFromForm = serializeForm(elementsFormCat);

  api.addNewCat(dataFromForm).then(() => {
    createCat(dataFromForm);
    updateLocalStorage(data, { type: 'ADD_CAT' });
    popupAddCat.close();
  });
}

function handleFormLogin(e) {
  e.preventDefault();
  const elementsFormCat = [...formLogin.elements];
  const dataFromForm = serializeForm(elementsFormCat);
  Cookies.set('email', `email=${dataFromForm.email}`);
  btnOpenPopupForm.classList.remove('visually-hidden');
  popupLogin.close();
}

function checkLocalStorage() {
  const localData = JSON.parse(localStorage.getItem('cats'));
  const getTimeExpires = localStorage.getItem('catsRefresh');

  if (localData && localData.length && new Date() < new Date(getTimeExpires)) {
    localData.forEach(function (catData) {
      createCat(catData);
    });
  } else {
    api.getAllCats().then(({ data }) => {
      data.forEach(function (catData) {
        createCat(catData);
      });

      updateLocalStorage(data, { type: 'ALL_CATS' });
    });
  }
}

function updateLocalStorage(data, action) {
  const oldStorage = JSON.parse(localStorage.getItem('cats'));

  switch (action.type) {
    case 'ADD_CAT':
      oldStorage.push(data);
      localStorage.setItem('cats', JSON.stringify(oldStorage));
      return;
    case 'ALL_CATS':
      localStorage.setItem('cats', JSON.stringify(data));
      setDataRefresh('catsRefresh', TIME_LSTORAGE);
      return;
    case 'DELETE_CAT':
      const newStorage = oldStorage.filter((cat) => cat.id !== data.id);
      localStorage.setItem('cats', JSON.stringify(data));
      return;
    default:
      break;
  }
}

btnOpenPopupLogin.addEventListener('click', () => popupLogin.open());
btnOpenPopupForm.addEventListener('click', () => popupAddCat.open());
formCatAdd.addEventListener('submit', handleFormAddCat);
formLogin.addEventListener('submit', handleFormLogin);

const isLogin = Cookies.get('email');

if (!isLogin) {
  popupLogin.open();
  btnOpenPopupForm.classList.add('visually-hidden');
} else {
  btnOpenPopupForm.classList.remove('visually-hidden');
}

checkLocalStorage();
