import { tagByPrefix, tagByPrefixStripped, sortRowByCreatedDescending } from './tags';

export function formatPages(rawPages){
  let pages = rawPages.map(row => {
    return {
      key: tagByPrefix(row.plaintags, 'id:'),
      title: tagByPrefixStripped(row.plaintags, 'title:', 'filename:'),
      contents: row.unencrypted,
      tags: row.plaintags
    }
  });
  return pages.sort(sortRowByCreatedDescending);
}
