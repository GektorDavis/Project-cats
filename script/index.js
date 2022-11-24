import { api } from './api.js';
import { Card } from './card.js';
import { TIME_LSTORAGE } from './constants.js';
import { PopupImage } from './popup-image.js';
import { Popup } from './popup.js';
import { serializeForm, setDataRefresh } from './utilits.js';
import { CatInfo } from './cat-info.js';

const cardsContainer = document.querySelector('.cards');
const btnOpenPopupForm = document.querySelector('#add');
const btnOpenPopupLogin = document.querySelector('#login');
const formCatAdd = document.querySelector('#popup-form-cat');
const formLogin = document.querySelector('#popup-form-login');
const popupAddCat = new Popup('popup-add-cats');
popupAddCat.setEventListener();
const popupLogin = new Popup('popup-login');
popupLogin.setEventListener();
const popupCatInfo = new Popup('popup-cat-info');
popupCatInfo.setEventListener();
const popupImage = new PopupImage('popup-image');
popupImage.setEventListener();
const catInfoInstance = new CatInfo(
  '#cat-info-template',
  handleEdit,
  handleLike,
  handleDelete
);
const catInfoElement = catInfoInstance.getElement();

function createCat(data) {
  const cardInstance = new Card(
    data,
    '#card-template',
    handleCatTitle,
    handleCatImage,
    handleLike
  );
  const newCardElement = cardInstance.getElement();
  cardsContainer.append(newCardElement);
}

function handleFormAddCat(e) {
  e.preventDefault();
  const elementsFormCat = [...formCatAdd.elements];
  const dataFromForm = serializeForm(elementsFormCat);

  api.addNewCat(dataFromForm).then(() => {
    createCat(dataFromForm);
    updateLocalStorage(dataFromForm, { type: 'ADD_CAT' });
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
      localStorage.setItem('cats', JSON.stringify(newStorage));
      return;
    case 'EDIT_CAT':
      const editStorage = oldStorage.map((cat) =>
        cat.id === data.id ? data : cat
      );
      localStorage.setItem('cats', JSON.stringify(editStorage));
      return;
    default:
      break;
  }
}

function handleCatTitle(catInstance) {
  catInfoInstance.setData(catInstance);
  popupCatInfo.setContent(catInfoElement);
  popupCatInfo.open();
}

function handleCatImage(dataCard) {
  popupImage.open(dataCard);
}

function handleLike(data, catInstance) {
  const { id, favourite } = data;
  api.updateCatById(id, { favourite }).then(() => {
    if (catInstance) {
      catInstance.setData(data);
      catInstance.updateView();
    }
    updateLocalStorage(data, { type: 'EDIT_CAT' });
  });
}

function handleDelete(catInstance) {
  api.deleteCatById(catInstance.getId()).then(() => {
    catInstance.deleteView();
    updateLocalStorage(catInstance.getData(), { type: 'DELETE_CAT' });
    popupCatInfo.close();
  });
}

function handleEdit(catInstance, data) {
  const { age, description, name, id } = data;

  api.updateCatById(id, { age, description, name }).then(() => {
    catInstance.setData(data);
    catInstance.updateView();
    updateLocalStorage(data, { type: 'EDIT_CAT' });
    popupCatInfo.close();
  });
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
