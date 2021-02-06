const createFeeds = (feeds) => {
  const feedsList = feeds.map(({ title, description }) => `
  <li class="list-group-item">
    <h3>
      ${title}
    </h3>
    <p>${description}</p>
  </li>
</ul>
  `);
  return `<ul class="list-group">${feedsList.join('')}</ul>`;
};

export default createFeeds;
