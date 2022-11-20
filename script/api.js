const CONFIG_API = {
  url: 'https://sb-cats.herokuapp.com/api/2/kamazyao',
  headers: {
    'Content-type': 'application/json',
  },
};

class Api {
  constructor(config) {
    this._url = config.url;
    this._headers = config.headers;
  }

  _onResponce(res) {
    return res.ok
      ? res.json()
      : Promise.reject({ ...res, message: 'Ошибка сервера' });
  }

  getAllCats() {
    return fetch(`${this._url}/show`, { method: 'GET' }).then(this._onResponce);
  }

  addNewCat(data) {
    return fetch(`${this._url}/add`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: this._headers,
    }).then(this._onResponce);
  }
}

const api = new Api(CONFIG_API);
