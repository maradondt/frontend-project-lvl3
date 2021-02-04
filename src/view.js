import './scss/index.scss';
import onChange from 'on-change';
import _ from 'lodash';

const state = {
  rssLinks: [],
  form: {
    state: 'valid',
    value: '',
    errors: {},
  },
  feeds: [],
  networkErrors: [],
};

const renderFeeds = (feeds) => feeds.map(({ title, description }) => {
  const h1 = document.createElement('h1');
  const p = document.createElement('p');
  const row = document.createElement('div');
  const col = document.createElement('div');
  h1.classList.add('h1');
  h1.textContent = title;
  p.classList.add('p-2');
  p.textContent = description;
  col.classList.add('col');
  row.classList.add('row');
  row.append(col);
  col.append(h1, p);
  return row;
});

const renderItems = (feeds) => feeds
  .map(({ title, description }) => {
    const h1 = document.createElement('h1');
    const p = document.createElement('p');
    const row = document.createElement('div');
    const col = document.createElement('div');
    h1.classList.add('h1');
    h1.textContent = title;
    p.classList.add('p-2');
    p.textContent = description;
    col.classList.add('col');
    row.classList.add('row');
    row.append(col);
    col.append(h1, p);
    return row;
  });

const renderErrors = (e) => {
  const feedback = document.querySelector('.feedback');
  if (!e.message) {
    feedback.textContent = '';
    feedback.classList.remove('text-danger');
  }
  feedback.textContent = e.message;
  feedback.classList.add('text-danger');
};

const render = ({ feeds }) => {
  const content = document.querySelector('#content');
  content.innerHTML = '';
  const feedsNodes = renderFeeds(feeds);
  const itemsNodes = _.flatMap(feeds.map(({ items }) => renderItems(items)));
  console.log(...itemsNodes);
  content.append(...feedsNodes);
  content.append(...itemsNodes);
};

const watchedState = onChange(state, (path, value) => {
  const input = document.querySelector('input[name="url"]');
  switch (path) {
    case ('form.state'):
      if (value === 'invalid') {
        input.classList.add('is-invalid');
        break;
      }
      input.classList.remove('is-invalid');
      console.log('remove class');
      break;
    case ('feeds'):
      render(watchedState);
      break;
    case ('form.errors'):
      renderErrors(state.form.errors);
      break;
    default:
      break;
  }
});

export default watchedState;
