export class Card {
  constructor(
    dataCat,
    selectorTemplate,
    handleCatTitle,
    handleCatImage,
    handleLike
  ) {
    this._data = dataCat;
    this._selectorTemplate = selectorTemplate;
    this._handleCatTitle = handleCatTitle;
    this._handleCatImage = handleCatImage;
    this._handleLike = handleLike;
  }

  _getTemplate() {
    return document
      .querySelector(this._selectorTemplate)
      .content.querySelector('.card');
  }

  _updateLike() {
    if (this._data.favourite) {
      this.cardLike.classList.add('card__like_active');
    } else {
      this.cardLike.classList.remove('card__like_active');
    }
  }

  _setLike = () => {
    this._data.favourite = !this._data.favourite;
    this.updateView();
    this._handleLike(this._data, this);
  };

  getElement() {
    this.element = this._getTemplate().cloneNode(true);
    this.cardTitle = this.element.querySelector('.card__name');
    this.cardImage = this.element.querySelector('.card__image');
    this.cardLike = this.element.querySelector('.card__like');

    this.updateView();
    this.setEventListener();

    return this.element;
  }

  getData() {
    return this._data;
  }

  getId() {
    return this._data.id;
  }

  setData(newData) {
    this._data = newData;
  }

  updateView() {
    this.cardTitle.textContent = this._data.name;
    this.cardImage.src = this._data.img_link;
    this._updateLike();
  }

  deleteView() {
    this.element.remove();
    this.element = null;
  }

  setEventListener() {
    this.cardTitle.addEventListener('click', () => this._handleCatTitle(this));
    this.cardImage.addEventListener('click', () =>
      this._handleCatImage(this._data)
    );
    this.cardLike.addEventListener('click', () => this._setLike());
  }
}
