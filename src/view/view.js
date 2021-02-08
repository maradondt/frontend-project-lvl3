import onChange from 'on-change';
// import i18next from 'i18next';
import markReadedPost from './markReadedPost';
import renderErrors from './renderErrors';
import renderFeeds from './renderFeeds';
import renderPosts from './renderPosts';
import showModal from './showModal';
import processStateHandler from './processStateHandler';

const watch = (state) => onChange(state, (path, value) => {
  const input = document.querySelector('input[name="url"]');
  switch (path) {
    case ('form.valid'):
      if (!value) {
        input.classList.add('is-invalid');
        break;
      }
      input.classList.remove('is-invalid');
      break;
    case ('form.processState'):
      processStateHandler(value);
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
    case ('uiState.showedPost'):
      showModal(value);
      break;
    default:
      break;
  }
});

export default watch;
