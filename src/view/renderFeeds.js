import createFeeds from './createFeeds';

const renderFeeds = (feeds) => {
  const feedsContainer = document.querySelector('#feeds');
  feedsContainer.innerHTML = '';
  feedsContainer.insertAdjacentHTML('afterbegin', createFeeds(feeds));
};

export default renderFeeds;
