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
    throw err;
  });

export default function init() {
  const input = document.querySelector('[name="url"]');
  const form = document.querySelector('form.rss-form');

  const submitHandler = (event) => {
    event.preventDefault();
    validateForm({ url: state.form.value }, state.rssLinks)
      .then(() => {
        state.rssLinks = [...state.rssLinks, input.value];
        state.form.state = 'valid';
        state.form.errors = {};
        getRRS(state.form.value)
          .then((data) => {
            const rssContent = parserRSS(data.contents);
            state.feeds = [...state.feeds, rssContent];
          }).catch((err) => {
            state.form.errors = err;
          });
        input.value = '';
      })
      .catch((err) => {
        state.form.state = 'invalid';
        state.form.errors = err;
      });
  };

  input.addEventListener('keyup', ({ target }) => {
    state.form.value = target.value;
  });

  form.addEventListener('submit', submitHandler);
}
