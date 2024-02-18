// Will make the state persistent to the module changes (no reload again)
if (module.hot) {
  module.hot.accept();
}

// import { addToCart, totalPrice as price, tQ } from './shoppingCart.js';
// addToCart('Magic wand', 20);
// console.log(price, tQ);

// import everything from the module
import * as ShoppingCart from './shoppingCart.js'; // the ShoppingCart is object similar to Class in OOP

// importing when using parcel
// import * as ShoppingCart from shoppingCart; // the ShoppingCart is object similar to Class in OOP
ShoppingCart.addToCart('Bread', 5);
console.log(ShoppingCart.totalPrice);

// import default export
// import add from './shoppingCart.js';
// add('Bread', 5);

// see the that the original "cart" is being updated
// (illustration of the "Live connection" between the original and the imported module)
ShoppingCart.addToCart('Bread', 5);
ShoppingCart.addToCart('Pizza', 5);
ShoppingCart.addToCart('Skap', 5);
console.log(ShoppingCart.cart); // by reloading the page, the cart will be empty again

// Top-level await (ES2022)
// console.log('Start fetching');
// const res = await fetch('https://jsonplaceholder.typicode.com/posts');
// const data = await res.json();
// console.log(data);
// console.log('Something'); // normally this would executed befor the fetch is done, but with await it will wait for the fetch to be done

const getLastPost = async function () {
  console.log('Start fetching');
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await res.json();
  console.log(data);
  console.log('Something');

  return {
    title: data.at(-1).title,
    text: data.at(-1).body,
  };
};

// const lastPost = await getLastPost();
// console.log(lastPost);

// not very clean
// const lastPost2 = getLastPost();
// console.log(lastPost2);

// If one module imports a module with top-level await,
//  the importing module will wait for the imported module to finish execution of the blocking code

///////////////////////////////////////
// Module Pattern
// const ShoppingCart2 = (function () {
//   const cart = [];
//   const shippingCost = 10;
//   const totalPrice = 237;
//   const totalQuantity = 23;

//   const addToCart = function (product, quantity) {
//     cart.push({ product, quantity });
//     console.log(
//       `${quantity} ${product} added to cart (shipping cost is ${shippingCost})`
//     );

//     console.log(cart);
//   };

//   const orderStock = function (product, quantity) {
//     console.log(`${quantity} ${product} ordered from supplier`);
//   };

//   return {
//     addToCart,
//     cart,
//     totalPrice,
//     totalQuantity,
//   };
// })();

// ShoppingCart2.addToCart('apple', 4);
// ShoppingCart2.addToCart('pizza', 2);
// console.log(ShoppingCart2);

//     console.log(cart);
//   };

//   const orderStock = function (product, quantity) {
//     console.log(`${quantity} ${product} ordered from supplier`);
//   };

//////////////////////////////////////
// CommonJS Modules
// Export
// export.addToCart = function (product, quantity) {
//   cart.push({ product, quantity });
//   console.log(
//     `${quantity} ${product} added to cart (shipping cost is ${shippingCost})`
//   );

//   console.log(cart);
// };

// Import
// const { addToCart } = require('./shoppingCart.js');

//////////////////////////////////////
// Using npm modules
// You don't copy "node_modules" to git or somewhere else
// import cloneDeep from './node_modules/lodash-es/cloneDeep.js'; // default import

// if we use parcel, we don't need to specify the path to the node_modules
// Importing module
// import cloneDeep from 'lodash-es';

//////////////////////////////////////
// Polyfilling
import 'core-js/stable';
// import 'core-js/stable/promise'; // does polyfilling only for promises

// Polyfilling async functions
import 'regenerator-runtime/runtime'; // this is the polyfill for async functions
