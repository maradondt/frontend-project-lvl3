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
  debug: true,
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
  // .get(`https://api.allorigins.win/get?url=${url}`)
  .get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${url}`)
  .then((responce) => responce.data)
  .catch((err) => {
    state.networkErrors = err;
    throw err;
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
        // upState.form.processState = 'failed';
        upState.form.errors = [...upState.form.errors, 'networkUpdateIssue'];
        throw new Error(err);
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
        state.rssLinks = [...state.rssLinks, state.form.value];
        state.form.state = 'valid';
        state.form.errors = [];
        getRSS(state.form.value)
          .then((data) => {
            const feedData = parserRSS(data.contents);
            const newFeed = createFeed(feedData.feed, state.form.value);
            const newPosts = createPosts(feedData.posts, newFeed.id);
            state.feeds = [...state.feeds, newFeed];
            updatePosts(state, newPosts);
            state.form.state = 'loaded';
            if (state.feeds.length < 2) {
              autoupdate(state);
            }
            input.value = '';
            state.form.state = '';
          }).catch((err) => {
            state.form.errors = [err.message];
            // throw err;
          });
      })
      .catch((err) => {
        state.form.state = 'invalid';
        state.form.errors = [err.message];
        // throw err;
      });
  };

  input.addEventListener('keyup', ({ target }) => {
    state.form.value = target.value;
  });

  form.addEventListener('submit', submitHandler);
  initModal();
}
