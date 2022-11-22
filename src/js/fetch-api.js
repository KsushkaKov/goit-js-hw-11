'use strict';

import axios from 'axios';

export class PixabayApi {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '31491040-c2125b003247a5f99763e28c8';

  constructor() {
    this.page = null;
    this.searchQuery = null;
  }

  fetchPhotos() {
    const searchParams = {
      params: {
        q: this.searchQuery,
        image_type: 'photo',
        safesearch: true,
        page: this.page,
        per_page: '40',
        orientation: 'horizontal',
        key: this.#API_KEY,
      },
    };
    this.page += 1;
    return axios.get(`${this.#BASE_URL}`, searchParams);
  }
}
