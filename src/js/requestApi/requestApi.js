const serverUrl = 'http://localhost:5000/';

export const getData = async (url) => {
  const res = await fetch(serverUrl + url);

  const contentType = res.headers.get('content-type');
  if (contentType) {
    return res.json();
  }
  return true;
};

export const postData = async (url, data) => {
  const res = await fetch(serverUrl + url, {
    method: 'POST',
    mode: 'cors',
    body: data,
  });

  return res.json();
};
