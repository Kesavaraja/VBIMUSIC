import axios from 'axios';

export const HTTP_URL = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com/"
});


