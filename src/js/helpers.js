// import { async } from 'regenerator-runtime';
import 'regenerator-runtime/runtime.js';
import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long ! Timeout after${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const AJAXdelete = async function (url) {
  try {
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    throw err;
  }
};

// async function imageValidation(url, uploadData) {
//   try {
//     console.log(uploadData);
//     console.log(uploadData.image_url);
//     const res = await fetch(uploadData.image_url, { method: 'HEAD' });
//     console.log(res);
//     const data = await res.blob();
//     console.log(data);
//     const isImage = data.type.startsWith('image/');
//     console.log(isImage);

//     const uploadRecipe = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: isImage
//         ? JSON.stringify(uploadData)
//         : JSON.stringify({
//             ...uploadData,
//             image_url: 'https://img.lovepik.com/element/40021/7866.png_300.png',
//           }),
//     });
//     return uploadRecipe;
//   } catch (err) {
//     return fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         ...uploadData,
//         image_url: 'https://img.lovepik.com/element/40021/7866.png_300.png',
//       }),
//     });
//   }
// }
/*
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};

*/
