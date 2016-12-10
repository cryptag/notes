const request = require('superagent');
const cryptagdPrefix = require('superagent-prefix')('http://localhost:7878/trusted');

const requestPost = function(urlSuffix, data, backendName){
  return new Promise((resolve, reject) => {
    request
      .post(urlSuffix)
      .use(cryptagdPrefix)
      .send(data)
      .set('X-Backend', backendName || '')
      .end((err, res) => {
        let respErr = '';

        if (err) {
          if (typeof res === 'undefined') {
            respErr = err.toString();
          } else {
            // cryptagd's error format: {"error": "..."}
            respErr = res.body.error;
          }

          reject(respErr);
        }

        resolve(res);
      });
  });
}

const requestGet = function(urlSuffix, backendName){
  return new Promise((resolve, reject) => {
    request
      .get(urlSuffix)
      .use(cryptagdPrefix)
      .set('X-Backend', backendName || '')
      .end((err, res) => {
        let respErr = '';

        if (err) {
          if (typeof res === 'undefined') {
            respErr = err.toString();
          } else {
            // cryptagd's error format: {"error": "..."}
            respErr = res.body.error;
          }

          reject(respErr);
        }

        resolve(res);
      });
  });
}

export const reqPost = requestPost;
export const reqGet = requestGet;
