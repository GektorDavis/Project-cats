import { generateRate, printNumerals } from './utilits.js';

export class CatInfo {
  constructor(selectorTemplate, handleEdit, handleLike, handleDelete) {
    this._selectorTemplate = selectorTemplate;
    this._handleEdit = handleEdit;
    this._handleLike = handleLike;
    this._handleDelete = handleDelete;
    this._data = {};
  }

  _updateLike() {
    if (this._data.favourite) {
      this.buttonLiked.classList.add('cat-info__favourite_active');
    } else {
      this.buttonLiked.classList.remove('cat-info__favourite_active');
    }
  }

  setData(catInstance) {
    this._catInstance = catInstance;
    this._data = this._catInstance.getData();
    this.catImage.src = this._data.img_link;
    this.catDesc.textContent = this._data.description;
    this.catName.textContent = this._data.name;
    this.catAge.textContent = this._data.age;
    this.catId.textContent = 'id ' + this._data.id;
    this.catAgeText.textContent = printNumerals(this._data.age, [
      'год',
      'года',
      'лет',
    ]);

    this.catRate.innerHTML = generateRate(this._data.rate);

    this._updateLike();
  }

  _setLike = () => {
    this._data.favourite = !this._data.favourite;
    this._updateLike();
    this._handleLike(this._data, this._catInstance);
  };

  _getTemplate() {
    return document.querySelector(this._selectorTemplate).content.children[0];
  }

  _switchContentEditable = () => {
    this.buttonEdited.classList.toggle('cat-info__edited_hidden');
    this.buttonSaved.classList.toggle('cat-info__saved_hidden');

    this.catDesc.contentEditable = !this.catDesc.isContentEditable;
    this.catName.contentEditable = !this.catName.isContentEditable;
    this.catAge.contentEditable = !this.catAge.isContentEditable;
  };

  _savedDataCats = () => {
    this._switchContentEditable();
    this._data.name = this.catName.textContent;
    this._data.age = Number(this.catAge.textContent);
    this._data.description = this.catDesc.textContent;

    this._handleEdit(this._catInstance, this._data);
  };

  getElement() {
    this.element = this._getTemplate().cloneNode(true);
    this.buttonEdited = this.element.querySelector('.cat-info__edited');
    this.buttonSaved = this.element.querySelector('.cat-info__saved');
    this.buttonLiked = this.element.querySelector('.cat-info__favourite');
    this.buttonDeleted = this.element.querySelector('.cat-info__deleted');

    this.catImage = this.element.querySelector('.cat-info__image');
    this.catId = this.element.querySelector('.cat-info__id');
    this.catName = this.element.querySelector('.cat-info__name');
    this.catRate = this.element.querySelector('.cat-info__rate');
    this.catAge = this.element.querySelector('.cat-info__age-val');
    this.catAgeText = this.element.querySelector('.cat-info__age-text');
    this.catDesc = this.element.querySelector('.cat-info__desc');

    this.setEventListener();

    return this.element;
  }

  setEventListener() {
    this.buttonDeleted.addEventListener('click', () =>
      this._handleDelete(this._catInstance)
    );
    this.buttonEdited.addEventListener('click', this._switchContentEditable);
    this.buttonSaved.addEventListener('click', this._savedDataCats);
    this.buttonLiked.addEventListener('click', this._setLike);
  }
}
