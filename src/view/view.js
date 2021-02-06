import onChange from 'on-change';
import markReadedPost from './markReadedPost';
import renderErrors from './renderErrors';
import renderFeeds from './renderFeeds';
import renderPosts from './renderPosts';
import showModal from './showModal';

const state = {
  rssLinks: [],
  form: {
    state: 'valid',
    value: '',
    errors: [],
  },
  feeds: [],
  posts: [],
  networkErrors: [],
  uiState: {
    readedPost: [],
    showPostIndex: '',
  },
  lastUpdatedAt: 0,
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
      renderFeeds(value);
      break;
    case ('posts'):
      renderPosts(value);
      break;
    case ('form.errors'):
      renderErrors(value);
      break;
    case ('uiState.readedPosts'):
      markReadedPost(value);
      break;
    case ('uiState.showPostIndex'):
      showModal(watchedState.posts[value]);
      break;
    default:
      break;
  }
});

export default watchedState;
