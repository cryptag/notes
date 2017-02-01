const cryptagdPrefix = 'http://localhost:7878/trusted';


const requestPost = function(urlSuffix, data, backendName){
  let req = new Request(cryptagdPrefix + urlSuffix);
  return fetch(req, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Backend': backendName || ''
    },
    body: JSON.stringify(data)
  })
  .then((response) => handleResponse(response))
}

const requestPut = function(urlSuffix, data, backendName){
  let req = new Request(cryptagdPrefix + urlSuffix);
  return fetch(req, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Backend': backendName || ''
    },
    body: JSON.stringify(data)
  })
  .then((response) => handleResponse(response))
}

const requestGet = function(urlSuffix, backendName){
  let req = new Request(cryptagdPrefix + urlSuffix);
  return fetch(req, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Backend': backendName || ''
    }
  })
  .then((response) => handleResponse(response))
}

let handleResponse = function(response) {
  if (!response.ok) {
    return response;
  }
  return response.json()
}

export const reqPost = requestPost;
export const reqPut = requestPut;
export const reqGet = requestGet;
