const cardsContainer = document.querySelector('.cards');
const btnOpenPopupForm = document.querySelector('#add');
const formCatAdd = document.querySelector('#popup-form-cat');
const popupAddCat = new Popup('popup-add-cats');
popupAddCat.setEventListener();

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

function handleFormAddCat(e) {
  e.preventDefault();
  const elementsFormCat = [...formCatAdd.elements];
  const dataFromForm = serializeForm(elementsFormCat);
  const cardInstance = new Card(dataFromForm, '#card-template');
  const newCardElement = cardInstance.getElement();
  cardsContainer.append(newCardElement);

  popupAddCat.close();
}

cats.forEach(function (catData) {
  const cardInstance = new Card(catData, '#card-template');
  const newCardElement = cardInstance.getElement();
  cardsContainer.append(newCardElement);
});

btnOpenPopupForm.addEventListener('click', () => popupAddCat.open());
formCatAdd.addEventListener('submit', handleFormAddCat);
