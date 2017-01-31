import { reqPost } from '../api';

export function getInvitesByURL(url){
  let invite = {url: url};
  return reqPost('/invites/get/url', invite);
}
