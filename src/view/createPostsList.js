const createPostsList = (posts) => {
  const listItems = posts.map(({
    title,
    link,
    // description,
    id,
  }) => (`<li class="list-group-item d-flex font-weight-boldalign-items-center">
  <a href="${link}" target="_blank" class="font-weight-bold" data-readed="${id}">${title}</a>
  <button data-preview="${id}" type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal">Preview</button></li>`));
  return `<ul class="list-group">${listItems.join('')}</ul>`;
};

export default createPostsList;
