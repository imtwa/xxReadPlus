import * as cheerio from 'cheerio';

const html = `
  <ul>
    <li class="item">Item 1</li>
    <li class="item">Item 2</li>
    <li class="item">Item 3</li>
  </ul>
`;

export const parser = (html: string) => {
    const $ = cheerio.load('<h2 class="title">Hello world</h2>');
    return '11';
};
