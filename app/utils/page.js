import { tagByPrefix, tagByPrefixStripped, sortRowByCreatedDescending } from './tags';

const utf8 = require('utf8');
const atob = require('atob');


export function formatPages(rawPages){
  let pages = rawPages.map(row => formatPage(row));
  return pages.sort(sortRowByCreatedDescending);
}

export function formatPage(row){
  return {
      key: tagByPrefix(row.plaintags, 'id:'),
      title: tagByPrefixStripped(row.plaintags, 'title:', 'filename:'),
      contents: utf8.decode(atob(row.unencrypted || '')),
      tags: row.plaintags
    }
}
