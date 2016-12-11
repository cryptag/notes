import { reqGet } from '../api';


export function getBackends(){
  return reqGet('/backends');
}
