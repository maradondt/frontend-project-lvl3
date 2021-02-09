import _ from 'lodash';
import { Modal } from 'bootstrap';
import axios from 'axios';
import i18next from 'i18next';
import watch from './view/view.js';
import parserRSS from './parserRSS.js';
import validateUrl from './validateUrl.js';
import en from './locales/en.js';

const createPosts = (posts, feedId) => posts
  // eslint-disable-next-line object-curly-newline
  .map(({ title, description, link, date }) => ({
    title,
    description,
    link,
    id: _.uniqueId(),
    feedId,
    date,
  }));

const handleErrors = (err, state) => {
  const watchedState = state;
  watchedState.form.errors = [...watchedState.form.errors, err];
  if (err.message === 'Network Error' || err.message === 'invalid-rss') {
    watchedState.form.processState = 'failed';
  } else {
    watchedState.form.valid = false;
  }
};
const getProxyUrl = (url) => `https://hexlet-allorigins.herokuapp.com/get?url=${url}&disableCache=true`;

const getRSS = (url) => axios
  .get(getProxyUrl(url))
  .then((responce) => responce.data)
  .catch(() => {
    throw new Error('Network Error');
  });

const createFeed = ({ title, description }, url) => ({
  title,
  description,
  id: _.uniqueId(),
  url,
});

const updatePosts = (state, posts) => {
  const watchedState = state;
  watchedState.posts = [...posts, ...watchedState.posts];
  watchedState.lastUpdatedAt = Date.now();
};

const autoupdate = (state) => {
  const watchedState = state;
  const delayInSeconds = 5;
  watchedState.updated = true;
  watchedState.feeds.forEach((feed) => {
    getRSS(feed.url)
      .then((data) => parserRSS(data.contents))
      .then(({ posts }) => createPosts(posts, feed.id))
      .then((posts) => posts.filter((post) => Date.parse(post.date) > watchedState.lastUpdatedAt))
      .then((newPosts) => {
        if (newPosts.length > 0) {
          updatePosts(watchedState, newPosts);
          watchedState.updated = false;
        }
      })
      .catch(() => {
        const err = new Error('Update Error');
        watchedState.form.errors = [...watchedState.form.errors, err];
      });
  });
  setTimeout(autoupdate, delayInSeconds * 1000, watchedState);
};

const loadRss = (state, elements) => {
  const watchedState = state;
  const { input } = elements;
  getRSS(watchedState.form.value)
    .then((data) => parserRSS(data.contents))
    .then((feedData) => {
      const newFeed = createFeed(feedData.feed, watchedState.form.value);
      const newPosts = createPosts(feedData.posts, newFeed.id);
      watchedState.feeds = [...watchedState.feeds, newFeed];
      updatePosts(watchedState, newPosts);
      watchedState.rssLinks = [...watchedState.rssLinks, watchedState.form.value];
      if (watchedState.feeds.length < 2) {
        autoupdate(watchedState);
      }
      watchedState.form.processState = 'finished';
      input.value = '';
      watchedState.form.valid = 'true';
    })
    .catch((err) => {
      handleErrors(err, watchedState);
    });
};

export default function init() {
  i18next.init({
    lng: 'en',
    resources: {
      en,
    },
  });
  const elements = {
    postsContainer: document.querySelector('#posts'),
    feedsContainer: document.querySelector('#feeds'),
    modal: document.querySelector('#modal'),
    feedback: document.querySelector('.feedback'),
    input: document.querySelector('[name="url"]'),
    submit: document.querySelector('[type="submit"]'),
    form: document.querySelector('form.rss-form'),
  };
  // eslint-disable-next-line object-curly-newline
  const { input, form, postsContainer, modal } = elements;
  // eslint-disable-next-line no-unused-vars
  const modalEl = new Modal(modal);
  const state = {
    rssLinks: [],
    form: {
      valid: true,
      value: '',
      errors: [],
      processState: 'filling',
    },
    feeds: [],
    posts: [],
    uiState: {
      readedPosts: [],
      showedPostIndex: '',
    },
    lastUpdatedAt: 0,
  };
  const watchedState = watch(state, elements);
  input.addEventListener('keyup', ({ target }) => {
    watchedState.form.processState = 'filling';
    watchedState.form.value = target.value;
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const currentUrl = formData.get('url');
    console.log(` url = ${currentUrl}`);
    try {
      validateUrl(watchedState).validateSync({
        url: currentUrl,
      });
      watchedState.form.valid = true;
      watchedState.form.errors = [];
      watchedState.form.processState = 'sending';
      loadRss(watchedState, elements);
    } catch (err) {
      handleErrors(err, watchedState);
    }
  });

  postsContainer.addEventListener('click', ({ target }) => {
    if (target.dataset.target === '#modal') {
      const { uiState, posts } = watchedState;
      const id = target.dataset.preview;
      const showedPostIndex = posts.findIndex((post) => id === post.id);
      uiState.showedPostIndex = showedPostIndex;
      uiState.readedPosts = [...uiState.readedPosts, id];
    }
  });
}
