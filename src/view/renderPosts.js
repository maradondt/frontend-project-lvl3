import createPostsList from './createPostsList';

const renderPosts = (posts) => {
  const postsContainer = document.querySelector('#posts');
  postsContainer.innerHTML = '';
  postsContainer.insertAdjacentHTML('beforeend', createPostsList(posts));
};

export default renderPosts;
