import _ from 'lodash';

const parseItems = (xmlDoc) => Array.from(xmlDoc.querySelectorAll('item'))
  .reduce((acc, item) => {
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    const id = _.uniqueId();
    return [
      ...acc,
      {
        title,
        description,
        link,
        id,
      },
    ];
  }, []);

export default function parserRSS(string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(string, 'application/xml');
  const title = doc.querySelector('title').textContent;
  const description = doc.querySelector('description').textContent;
  const items = parseItems(doc);
  return { title, description, items };
}
