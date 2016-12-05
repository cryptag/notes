import { reqPost } from '../api';
import { encodeObjForPost } from '../../utils/tags';


export function listPages(backendName){
  let plaintags = ['type:md'];
  return reqPost('/rows/list', {"plaintags": plaintags}, backendName);
}

export function getPages(backendName, tags){
  tags = tags || [];

  let plaintags = ['type:md'];
  plaintags = plaintags.concat(tags)
  return reqPost('/rows/get', {"plaintags": plaintags}, backendName);
}

export function createEmptyPage(backendName, parentRow, title){
  let row = {
    unencrypted: null,
    plaintags: ['title:'+title, 'type:wikipage', 'app:cryptagnotes',
                'parentrow:'+parentRow]
  }
  return reqPost('/rows', row, backendName);
}

export function createPage(title, contents, backendName){
  let row = pageToPost(title, contents);
  return reqPost('/rows', row, backendName);
}

function pageToPost(title, contents){
  return {
    unencrypted: contents,
    plaintags: ['type:text', 'type:md', 'app:cryptagnotes', 'title:'+title]
  }
}

// Create, Update

export function updatePage(pageKey, title, contents, backendName){
  let row = pageToPost(title, contents);
  row.plaintags.push('parentrow:'+pageKey);
  return reqPost('/rows', row, backendName);
}
