import { reqGet, reqPost } from '../api';


export function getBackends(){
  return reqGet('/backends');
}

export function createBackend(bkConfig){
  return reqPost('/init', bkConfig);
}
