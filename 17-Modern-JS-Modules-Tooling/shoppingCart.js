// Exporting module
console.log('Exporting module');

// blocking code - this blocks execution of the code in the importing module (and exporting module)
//  until the fetch is done
// console.log('Start fetching users');
// await fetch('https://jsonplaceholder.typicode.com/users');
// console.log('Finish fetching users');

// scoped to current module
const shoppingCost = 10;
export const cart = [];

// if we want to use them in the import, we need to export them using
// one of below 2 methods:

// #1 method - Named Export
export const addToCart = function (product, quantity) {
  cart.push({ product, quantity });
  console.log(`${quantity} ${product} added to the cart`);
};

const totalPrice = 12;
const totalQuantity = 30;

// #2 method - Named Export
export { totalPrice, totalQuantity as tQ };

// Default Export
// export default function (product, quantity) {
//   cart.push({ product, quantity });
//   console.log(`${quantity} ${product} added to the cart`);
// }
