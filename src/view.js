import './scss/index.scss';
import i18next from 'i18next';
import onChange from 'on-change';
import _ from 'lodash';
import { Modal } from 'bootstrap';

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

const showModal = (title, link, description) => {
  const modal = document.querySelector('#modal');
  const modalTitle = modal.querySelector('.modal-title');
  const btn = modal.querySelector('[role="button"]');
  const body = modal.querySelector('.modal-body');
  modalTitle.textContent = title;
  btn.href = link;
  body.textContent = description;
  // eslint-disable-next-line no-unused-vars
  const modalEl = new Modal(modal);
};

const renderItems = (feeds) => feeds
  .map(({ title, link, description }) => {
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const a = document.createElement('a');
    const button = document.createElement('button');
    button.addEventListener('click', () => showModal(title, link, description));
    button.textContent = 'Preview';
    button.classList.add('btn', 'btn-primary');
    button.dataset.target = '#modal';
    button.dataset.toggle = 'modal';
    li.classList.add('list-group-item', 'd-flex', 'align-items-center');
    a.classList.add('link');
    a.href = link;
    a.textContent = title;
    a.target = '_blank';
    h3.append(a);
    li.append(h3);
    li.append(button);
    return li;
  });

const renderErrors = (e) => {
  const feedback = document.querySelector('.feedback');
  if (!e.message) {
    feedback.textContent = '';
    feedback.classList.remove('text-danger');
  } else {
    feedback.textContent = i18next.t(`errors.${e.message}`);
    feedback.classList.add('text-danger');
  }
};

const render = ({ feeds }) => {
  const content = document.querySelector('#content');
  content.innerHTML = '';
  const feedsNodes = renderFeeds(feeds);
  const itemsNodes = _.flatMap(feeds.map(({ items }) => renderItems(items)));
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
