import { tagByPrefix, tagByPrefixStripped, sortRowByCreatedDescending } from './tags';

const utf8 = require('utf8');
const atob = require('atob');


export function formatPages(rawPages){
  let pages = rawPages.map(row => formatPage(row));
  return pages.sort(sortRowByCreatedDescending);
}

export function formatPage(row){
  let title = tagByPrefixStripped(row.plaintags, 'title:', 'filename:');
  let titleCleaned = title.replace(/\.md$/, '');
  return {
      key: tagByPrefix(row.plaintags, 'id:'),
      title: titleCleaned,
      contents: utf8.decode(atob(row.unencrypted || '')),
      tags: row.plaintags
    }
}
