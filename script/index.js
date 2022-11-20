const cardsContainer = document.querySelector('.cards');
const btnOpenPopupForm = document.querySelector('#add');
const btnOpenPopupLogin = document.querySelector('#login');
const formCatAdd = document.querySelector('#popup-form-cat');
const formLogin = document.querySelector('#popup-form-login');
const popupAddCat = new Popup('popup-add-cats');
popupAddCat.setEventListener();
const popupLogin = new Popup('popup-login');
popupLogin.setEventListener();

function serializeForm(elements) {
  const formData = {};

  elements.forEach((input) => {
    if (input.type === 'submit') return;

    if (input.type !== 'checkbox') {
      formData[input.name] = input.value;
    }

    if (input.type === 'checkbox') {
      formData[input.name] = input.checked;
    }
  });

  return formData;
}

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

function setDataRefresh(minutes) {
  const setTime = new Date(new Date().getTime() + minutes * 60000);
  localStorage.setItem('catsRefresh', setTime);
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

      localStorage.setItem('cats', JSON.stringify(data));
      setDataRefresh(1);
    });
  }
}

checkLocalStorage();

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
