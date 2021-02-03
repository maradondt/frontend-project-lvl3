import './scss/index.scss';
import axios from 'axios';
import state from './view.js';
import parserRSS from './parserRSS.js';
import validateForm from './validateForm.js';

const getRRS = (url) => axios
  .get(`https://api.allorigins.win/get?url=${url}`)
  .then((responce) => responce.data)
  .catch((err) => {
    state.networkErrors = err;
    throw new Error('network connection');
  });

export default function init() {
  const input = document.querySelector('[name="url"]');
  const form = document.querySelector('form.rss-form');
  input.addEventListener('keyup', ({ target }) => {
    state.form.value = target.value;
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    validateForm({ url: state.form.value })
      .then((valid) => {
        if (valid === true) {
          state.form.state = 'valid';
          getRRS(state.form.value).then((data) => {
            state.feeds = [...state.feeds, parserRSS(data.contents)];
          });
          input.value = '';
        } else {
          state.form.state = 'invalid';
        }
      })
      .catch((err) => {
        console.log(err);
        throw new Error(err);
      });
  });
}
