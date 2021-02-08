import _ from 'lodash';
import axios from 'axios';
import i18next from 'i18next';
// import { Modal } from 'bootstrap';
import state from './view/view.js';
import parserRSS from './parserRSS.js';
import validateForm from './validateForm.js';
import en from './locales/en.js';

i18next.init({
  lng: 'en',
  resources: {
    en,
  },
});

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

const getRSS = (url) => axios
  .get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${url}`)
  .then((responce) => responce.data)
  .catch((err) => {
    state.networkErrors = ['networkUpdateIssue'];
    throw new Error(err);
  });

const initModal = () => {
  const postsContainer = document.querySelector('#posts');
  postsContainer.addEventListener('click', ({ target }) => {
    if (target.dataset.target === '#modal') {
      const id = target.dataset.preview;
      const showedPostIndex = state.posts.findIndex((post) => id === post.id);
      state.uiState.showPostIndex = showedPostIndex;
      state.uiState.readedPosts = [...state.uiState.readedPost, id];
    }
  });
};

const createFeed = ({ title, description }, url) => ({
  title,
  description,
  id: _.uniqueId(),
  url,
});

const updatePosts = (feedState, posts) => {
  const upState = feedState;
  upState.posts = [...posts, ...upState.posts];
  upState.lastUpdatedAt = Date.now();
};

const autoupdate = (feedState) => {
  const upState = feedState;
  const delayInSeconds = 5;
  upState.updated = true;
  upState.feeds.forEach((feed) => {
    getRSS(feed.url)
      .then((data) => parserRSS(data.contents))
      .then(({ posts }) => createPosts(posts, feed.id))
      .then((posts) => posts.filter((post) => Date.parse(post.date) > upState.lastUpdatedAt))
      .then((newPosts) => {
        if (newPosts.length > 0) {
          updatePosts(upState, newPosts);
          upState.updated = false;
        }
      })
      .catch((err) => {
        upState.errors = [err.message];
        console.warn(err);
      });
  });
  setTimeout(autoupdate, delayInSeconds * 1000, upState);
};

export default function init() {
  const input = document.querySelector('[name="url"]');
  const form = document.querySelector('form.rss-form');

  const submitHandler = (event) => {
    event.preventDefault();
    validateForm({ url: state.form.value }, state.rssLinks)
      .then(() => {
        state.form.valid = true;
        state.form.errors = [];
        state.form.processState = 'sending';
        getRSS(state.form.value)
          .then((data) => {
            const feedData = parserRSS(data.contents);
            const newFeed = createFeed(feedData.feed, state.form.value);
            const newPosts = createPosts(feedData.posts, newFeed.id);
            state.feeds = [...state.feeds, newFeed];
            updatePosts(state, newPosts);
            state.form.processState = 'finished';
            state.rssLinks = [...state.rssLinks, state.form.value];
            if (state.feeds.length < 2) {
              autoupdate(state);
            }
            input.value = '';
            state.form.valid = 'true';
          }).catch((err) => {
            state.form.processState = 'failed';
            state.form.errors = [err.message];
            console.warn(err);
            // throw err;
          });
      })
      .catch((err) => {
        state.form.valid = false;
        state.form.errors = [err.message];
        // throw err;
      });
  };

  input.addEventListener('keyup', ({ target }) => {
    state.form.processState = 'filling';
    state.form.value = target.value;
  });

  form.addEventListener('submit', submitHandler);
  initModal();
}
