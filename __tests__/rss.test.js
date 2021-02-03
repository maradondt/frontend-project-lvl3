import fs from 'fs';
import path from 'path';
import result from '../__fixtures__/rss/rssoutput.js';
import parserRSS from '../src/parserRSS.js';

const getFixturePath = (filename) => path.join('__fixtures__', 'rss', filename);

let rssXml;

beforeAll(() => {
  const pathTorrs = getFixturePath('rssinput.xml');
  rssXml = fs.readFileSync(pathTorrs);
});
test('RSS parser test', () => {
  expect(parserRSS(rssXml)).toMatchObject(result);
});
