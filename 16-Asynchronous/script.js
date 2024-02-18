'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
// API url change: https://countries-api-836d.onrender.com/countries/
const countriesUrl = 'https://restcountries.com/v3.1/';
const renderCountry = function (data, className = '') {
  const html = `
    <article class="country ${className}">
      <img class="country__img" src="${data.flags.svg}" />
      <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          Math.round((+data.population / 1000000) * 10) / 10
        ).toFixed(1)}M people</p>
        <p class="country__row"><span>🗣️</span>${Object.values(
          data.languages
        ).join(', ')}</p>
        <p class="country__row"><span>💰</span>${Object.keys(
          data.currencies
        ).join(', ')}</p>
      </div>
    </article>
    `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
};
const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

///////////////////////////////////////
// Old school way of AJAX (the only way in ES5 JS)
// const getCountryData = function (country) {
//   const countryClean = country.trim().toLowerCase();
//   const request = new XMLHttpRequest();
//   request.open('GET', `${countriesUrl}name/${countryClean}`, true);
//   request.send();
//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     console.log(data);
//     renderCountry(data, 'country');
//   });
// };
const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    return response.json();
  });
};
// Using fetch API (modern way) - returns a promise
const getCountryData = function (
  country,
  className = 'country',
  name = true,
  useNeigh = false
) {
  const countryClean = country.trim().toLowerCase();
  let reqUrl = name
    ? `${countriesUrl}name/${countryClean}`
    : `${countriesUrl}alpha/${countryClean}`;

  getJSON(reqUrl, 'Country not found')
    .then(d => {
      const [data] = d;
      renderCountry(data, className);

      const neighbours = data.borders;
      // if (!neighbours) return; // this would not stop the promise chain
      if (!neighbours) throw new Error('No neighbour found'); // will travel down the chain

      return getJSON(
        `${countriesUrl}alpha/${neighbours[0]}`,
        'Neighbor not found'
      );
    })
    // .then(data => data.json())
    .then(data => {
      [data] = data;
      renderCountry(data, 'neighbour', false, false);
    })
    .catch(err => {
      console.error(err);
      renderError(err);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1; // we display the rendered countries
    });
};

// The order of the display is not the same as the order of the request
// btn.addEventListener('click', function (e) {
//   e.target.style.opacity = 0;
//   getCountryData('slovakia', 'country', true, true);
// });

// getCountryData(undefined);

// getCountryData('usa');
// getCountryData('germany');
// getCountryData('slovakia');

///////////////////////////////////////
// Callback hell - Nested AJAX calls (callback inside callback)
//  - Not a problem with AJAX, but with callbacks
//  - Hard to read and maintain
//  - Hard to debug
//  - Not flexible
//  - Not reusable
//  - Lack of error handling
//  - Not ideal for async tasks that depend on each other in a certain order

// - WE TRY TO DISPLAY DATA IN THE SAME ORDER AS THE REQUESTS
// BAD ---> Lots of nesting
// const getCountryAndNeigbour = function (country) {
//   const countryClean = country.trim().toLowerCase();
//   const request = new XMLHttpRequest();
//   request.open('GET', `${countriesUrl}/${countryClean}`, true);
//   request.send();
//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     console.log(data);

//     // Render country 1
//     renderCountry(data, 'country');

//     // Get neighbour country (2)
//     const neighbours = data.borders;
//     console.log(neighbours);
//     if (!neighbours) return;

//     // AJAX call country 2, 3, ....
//     neighbours.forEach(neighbour => {
//       // using code instead of name
//       const request2 = new XMLHttpRequest();
//       request2.open('GET', `${countriesUrl}alpha/${neighbour}`, true);
//       request2.send();
//       request2.addEventListener('load', function () {
//         const data2 = JSON.parse(this.responseText)[0];
//         console.log(data2);

//         renderCountry(data2, 'neighbour');
//       });
//     });
//     // const request2 = new XMLHttpRequest();
//     // // using code instead of name
//     // request2.open('GET', `${countriesUrl}alpha/${neighbour}`, true);
//     // request2.send();
//     // request2.addEventListener('load', function () {
//     //   const data2 = JSON.parse(this.responseText)[0];
//     //   console.log(data2);

//     //   renderCountry(data2, 'neighbour');
//     // });
//   });
// };

// getCountryAndNeigbour('spain');

// setTimeout(() => {
//   console.log('1 second passed');
//   setTimeout(() => {
//     console.log('2 second passed');
//     setTimeout(() => {
//       console.log('3 second passed');
//       setTimeout(() => {
//         console.log('4 second passed');
//       }, 1000);
//     }, 1000);
//   }, 1000);
// });

///////////////////////////////////////
// #1 Coding Challenge

// In this challenge you will build a function
// 'whereAmI' which renders a country ONLY based on GPS coordinates.
// For that, you will use a second API to geocode coordinates.
// So in this challenge, you’ll use an API on your own for the first time 😁

// Your tasks:
// PART 1
// 1. Create a function 'whereAmI' which takes as inputs a latitude value ('lat')
// and a longitude value ('lng') (these are GPS coordinates, examples are
// in the test
// cases).
// 2. Do “reverse geocoding” of the provided coordinates. Reverse geocoding means
// to convert coordinates to a meaningful location, like a city and country name.
// Use this API to do reverse geocoding
// 3. console.log a string like this: “You are in Berlin, Germany”
// 4. Chain a .catch method to the end of the promise chain and log errors to the
// console
// 5. This API allows you to make only 3 requests per second. If you reload fast, you
// will get this error with code 403. This is an error with the request.
//
// PART 2
// 6. Now it's time to use the received data to render a country. So take the relevant
// attribute from the geocoding API result, and plug it into the countries API that
// we have been using.
// 7. Render the country and catch any errors, just like we have done in the last
// lecture (you can even copy this code, no need to type the same code)
//
// Test data:
// § Coordinates 1: 52.508, 13.381 (Latitude, Longitude)
// § Coordinates 2: 19.037, 72.873
// § Coordinates 3: -33.933, 18.474

// GOOD LUCK 😀

const whereAmI = function (lat, lng) {
  let geoPromise;
  if (!lat || !lng) {
    geoPromise = getPosition().then(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      console.log(lat, lng);

      return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    });
  } else {
    geoPromise = fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
  }

  geoPromise
    .then(response => {
      console.log(response);
      if (!response.ok) {
        throw new Error(
          'Error occurred when trying to reverse geo-code your location.'
        );
      }

      return response.json();
    })
    .then(data => {
      const city = data.city;
      const country = data.country;

      console.log(`You're in ${city}, ${country}`);

      getCountryData(country, 'country', true, true);
    })
    .catch(err => console.log(err))
    .finally(() => {
      countriesContainer.style.opacity = 1; // we display the rendered countries
    });
};

// whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
// whereAmI(-33.933, 18.474);
// whereAmI(0, 0);

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // - This ⬇️ is also legit
    // navigator.geolocation.getCurrentPosition(
    //   pos => resolve(pos),
    //   err => reject(err)
    // );
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

// btn.addEventListener('click', function (e) {
//   e.target.style.opacity = 0;
//   // this is a callback based API
//   // we can Promisify it in the getPosition function
//   // navigator.geolocation.getCurrentPosition(
//   //   pos => {
//   //     const lat = pos.coords.latitude;
//   //     const lon = pos.coords.longitude;

//   //     whereAmI(lat, lon);
//   //   },
//   //   err => {
//   //     console.log(err);
//   //   }
//   // );

//   whereAmI();
//   // getPosition()
//   //   .then(pos => {
//   //     const lat = pos.coords.latitude;
//   //     const lon = pos.coords.longitude;

//   //     whereAmI(lat, lon);
//   //   })
//   //   .catch(err => {
//   //     console.log(err);
//   //   });
// });

// whereAmI(19.037, 72.873);

const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

// wait(2)
//   .then(() => {
//     console.log('I waited for 2 seconds');
//     return wait(1);
//   })
//   .then(() => console.log('I waited for 1 second'));

// setTimeout(() => {
//   console.log('1 second passed');
//   setTimeout(() => {
//     console.log('2 second passed');
//     setTimeout(() => {
//       console.log('3 second passed');
//       setTimeout(() => {
//         console.log('4 second passed');
//       }, 1000);
//     }, 1000);
//   }, 1000);
// }, 1000);

///////////////////////////////////////
// #2 Coding Challenge

// Build the image loading functionality that I just
// showed you on the screen.

// Tasks are not super-descriptive this time, so that you can figure out some stuff on your own.

// PART 1
// 1. Create a function 'createImage' which receives imgPath as an input. This function returns a promise which creates a new image (use document.
// createElement('img')) and sets the .src attribute to the provided image path. When the image is done
// loading, append it to the DOM element with the 'images' class, and resolve the promise. The fulfilled
// value should be the image element itself. In case there is an error loading the image (listen for the
//'error' event), reject the promise.

// If this part is too tricky for you, just watch the first part of the solution.

// PART 2
// 2. Consume the promise using .then and also add an error handler;
// 3. After the image has loaded, pause execution for 2 seconds using the 'wait' function we created earlier;
// 4. After the 2 seconds have passed, hide the current image (set display to 'none');
// 5. Pause execution for 2 seconds again;
// 6. After the 2 seconds have passed, show the image (set display to 'block');
// 7. After the image has loaded, pause execution for 2 seconds using the 'wait' function we created earlier;
// 8. After the 2 seconds have passed, hide the current image.

// TEST DATA: Images in the img folder. Test the error handler by passing a wrong image path.
// Set the network speed to 'Fast 3G' in the dev tools Network tab, otherwise images load too fast.

// GOOD LUCK 😀

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    var img = document.createElement('img');
    img.src = imgPath;
    img.classList.add('images');

    img.addEventListener('load', e => {
      document.querySelector('.images').appendChild(img);
      resolve(img);
    });

    img.addEventListener('error', e => {
      reject(new Error('Image not found.'));
    });
  });
  // var img = document.createElement('img');
  // img.src = imgPath;
  // img.classList.add('images');

  // img.addEventListener('load', e => {
  //   document.querySelector('.images').appendChild(img);
  // });

  // document.appendChild(img);
};

// let image;
// createImage(
//   // 'https://github.com/jonasschmedtmann/complete-javascript-course/blob/8201b01f2fcd274fb276c1c8e11e55847c6d451e/16-Asynchronous/starter/img/img-1.jpg?raw=true'
//   'img/img-1.jpg'
// )
//   .then(img => {
//     console.log('Loading the image.');
//     image = img;
//     return wait(2);
//   })
//   .then(() => {
//     console.log('Hiding the image after 2 seconds.');
//     image.style.display = 'none';

//     return wait(2);
//   })
//   .then(() => {
//     console.log("Setting the display to 'block' for the image");
//     image.style.display = 'block';

//     return wait(2);
//   })
//   .then(() => {
//     console.log('Hiding the image again after another 2 seconds');
//     image.style.display = 'none';
//   })
//   .catch(err => console.error(err));

///////////////////////////////////////
// Async/Await

const whereAmI2 = async function (lat, lng) {
  let response;
  let pos;
  let data;
  let latitude = lat;
  let longitude = lng;
  try {
    if (!latitude || !longitude) {
      pos = await getPosition();
      latitude = pos.coords.latitude;
      longitude = pos.coords.longitude;
      console.log(latitude, longitude);
    }

    response = await fetch(
      `https://geocode.xyz/${latitude},${longitude}?geoit=json`
    );
    if (!response.ok) {
      throw new Error(
        'Error occurred when trying to reverse geo-code your location.'
      );
    }
    data = await response.json();
    // console.log(data);
  } catch (err) {
    console.error(err);
    renderCountry('India', 'country');

    // to fix that the return value of the function will
    // always be a fulfilled promise, we need throw the error so it can propagate
    // later in the "funcRes" variable
  }

  // console.log(latitude, longitude);
  // console.log(data);

  const city = data.city;
  const country = data.country;

  console.log(`You're in ${city}, ${country}`);

  getCountryData(country, 'country', true, true);
  countriesContainer.style.opacity = 1;

  return 'Finished'; // this is the fulfilled value of the promise
};

// call for country with no neighbour
// whereAmI2(52.508, 13.381);

console.log('1: Will get location');

// even with error, this function will be resolved
//  whereAmI2(19.037, 72.873)
//   .then(res => console.log(res))
//   .catch(err => console.error(err));
// console.log(funcRes);

// this is the same as the above ⬆️
// (async function () {
//   try {
//     const res = await whereAmI2(19.037, 72.873);
//     console.log(res);
//   } catch (err) {
//     console.error(err);
//   }
// })();

// btn.addEventListener('click', function (e) {
//   e.target.style.opacity = 0;
//   whereAmI2();
// });

///////////////////////////////////////
// run the promises in parallel

// thiw will make the requests run in the specified order
// but it doesn't make sense for the second request to start
// only after the 1st has finished - that is what is happening here
// const get3Countries = async function (c1, c2, c3) {
//   try {
//     const [data1] = await getJSON(`https://restcountries.com/v3.1/name/${c1}`);
//     const [data2] = await getJSON(`https://restcountries.com/v3.1/name/${c2}`);
//     const [data3] = await getJSON(`https://restcountries.com/v3.1/name/${c3}`);

//     console.log([...data1.capital, ...data2.capital, ...data3.capital]);
//   } catch (err) {
//     console.error(err);
//   }
// };

// Promise.all([]) will make the requests run in parallel
const get3Countries = async function (c1, c2, c3) {
  try {
    const [...data] = await Promise.all([
      getJSON(`https://restcountries.com/v3.1/name/${c1}`),
      getJSON(`https://restcountries.com/v3.1/name/${c2}`),
      getJSON(`https://restcountries.com/v3.1/name/${c3}`),
    ]);

    console.log(data.map(d => d[0].capital[0]));
  } catch (err) {
    console.error(err);
  }
};

// get3Countries('portugal', 'canada', 'tanzania');

///////////////////////////////////////
// Other Promise Combinators: race, allSettled and any

// Promise.race
// (async function () {
//   const res = await Promise.race([
//     getJSON(`https://restcountries.com/v3.1/name/italy`),
//     getJSON(`https://restcountries.com/v3.1/name/egypt`),
//     getJSON(`https://restcountries.com/v3.1/name/mexico`),
//   ]);

//   console.log(res[0]);
// })();

// we could also use a timeout to make the request fail
// const timeout = function (sec) {
//   return new Promise(function (_, reject) {
//     setTimeout(function () {
//       reject(new Error('Request took too long!'));
//     }, sec * 1000);
//   });
// };

// Promise.race([
//   getJSON(`https://restcountries.com/v3.1/name/tanzania`),
//   timeout(0.1),
// ])
//   .then(res => console.log(res[0]))
//   .catch(err => console.error(err));

// // Promise.allSettled (ES2020)
// Promise.allSettled([
//   Promise.resolve('Success'),
//   Promise.reject('ERROR'),
//   Promise.resolve('Another success'),
// ]).then(res => console.log(res));

// // Promise.any (ES2021)
// Promise.any([
//   Promise.resolve('Success'),
//   Promise.reject('ERROR'),
//   Promise.resolve('Another success'),
// ]).then(res => console.log(res));

///////////////////////////////////////
// #3 Coding Challenge

/* 
PART 1
Write an async function 'loadNPause' that recreates 
Coding Challenge #2, this time using async/await 
(only the part where the promise is consumed). 
Compare the two versions, think about the big differences, 
and see which one you like more.
Don't forget to test the error handler, 
and to set the network speed to 'Fast 3G' in the dev tools Network tab. 

PART 2
1. Create an async function 'loadAll' that receives an array of image paths 
'imgArr';
2. Use .map to loop over the array,
to load all the images with the 'createImage' function (call the resulting array 'imgs')
3. Check out the 'imgs' array in the console! Is it like you expected?
4. Use a promise combinator function to actually get
the images from the array 😉
5. Add the 'paralell' class to all the images (it has some CSS styles).

TEST DATA: ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']. 
To test, turn off the 'loadNPause' function.

GOOD LUCK 😀
*/

const imgArr = ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg'];

// Part 1
const loadNPause = async function (imgArr) {
  try {
    let img = await createImage(imgArr[0]);
    console.log('Loading the image');

    console.log('Waiting 2 seconds');
    await wait(2);

    console.log("Setting display to 'none'");
    img.style.display = 'none';

    console.log('Waiting 2 seconds');
    await wait(2);

    img = await createImage(imgArr[1]);

    console.log("Setting the display to 'block' for the image");
    img.style.display = 'block';

    console.log('Waiting 2 seconds');
    await wait(2);

    console.log('Hiding the image again');
    img.style.display = 'none';

    return img;
  } catch (err) {
    console.error(err);
  }
};
// console.log(loadNPause(imgArr));

// my own version so that all of the pictures are only displayed
// when fully loaded
const createImage2 = function (imgPath, injectDOM = true) {
  return new Promise(function (resolve, reject) {
    var img = document.createElement('img');
    img.src = imgPath;
    img.classList.add('images');

    img.addEventListener('load', e => {
      if (injectDOM) document.querySelector('.images').appendChild(img);
      resolve(img);
    });

    img.addEventListener('error', e => {
      reject(new Error('Image not found.'));
    });
  });
};

// Part 2
const loadAll = async function (imgArr, displaySeparately = false) {
  // Note: We could also do this. It would be useful if we planned to
  //  to do something with the resolved value
  // const imgPromises = imgArr.map(async img => await createImage(img));

  // we create the Promises - they create the images
  const imgPromises = imgArr.map(img => createImage2(img, displaySeparately));
  console.log(imgPromises);

  // await wait(5);
  // we load the images
  let images = await Promise.all(imgPromises);
  images = images.map(img => {
    if (!displaySeparately) document.querySelector('.images').appendChild(img);
    img.classList.add('parallel');
    return img;
  });

  console.log(images);
};

// loadAll(imgArr, true);
loadAll(imgArr, false);

// const imgs = imgArr.map(imgPath => createImage(imgPath));
// console.log(imgs);

// console.log(createImage('img/img-1.jpg'));
// var img = document.createElement('img');
// img.src = imgPath;
// img.classList.add('images');

// img.addEventListener('load', e => {
//   document.querySelector('.images').appendChild(img);
// });

// document.appendChild(img);

// let image;
// createImage(
//   // 'https://github.com/jonasschmedtmann/complete-javascript-course/blob/8201b01f2fcd274fb276c1c8e11e55847c6d451e/16-Asynchronous/starter/img/img-1.jpg?raw=true'
//   'img/img-1.jpg'
// )
//   .then(img => {
//     console.log('Loading the image.');
//     image = img;
//     return wait(2);
//   })
//   .then(() => {
//     console.log('Hiding the image after 2 seconds.');
//     image.style.display = 'none';

//     return wait(2);
//   })
//   .then(() => {
//     console.log("Setting the display to 'block' for the image");
//     image.style.display = 'block';

//     return wait(2);
//   })
//   .then(() => {
//     console.log('Hiding the image again after another 2 seconds');
//     image.style.display = 'none';
//   })
//   .catch(err => console.error(err));
