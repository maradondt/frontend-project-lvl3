const createPostsList = (posts) => {
  const listItems = posts.map(({
    title,
    link,
    // description,
    id,
  }) => (`<li class="list-group-item d-flex font-weight-bold align-items-center justify-content-between">
  <a href="${link}" target="_blank" class="font-weight-bold" data-readed="${id}">${title}</a>
  <button data-preview="${id}" role="button" type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal">Preview</button></li>`));
  return `<h2>Posts</h2><ul class="list-group">${listItems.join('')}</ul>`;
};

export default createPostsList;
