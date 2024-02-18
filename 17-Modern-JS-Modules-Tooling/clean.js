const budget = [
  { value: 250, description: 'Sold old TV 📺', user: 'jonas' },
  { value: -45, description: 'Groceries 🥑', user: 'jonas' },
  { value: 3500, description: 'Monthly salary 👩‍💻', user: 'jonas' },
  { value: 300, description: 'Freelancing 👩‍💻', user: 'jonas' },
  { value: -1100, description: 'New iPhone 📱', user: 'jonas' },
  { value: -20, description: 'Candy 🍭', user: 'matilda' },
  { value: -125, description: 'Toys 🚂', user: 'matilda' },
  { value: -1800, description: 'New Laptop 💻', user: 'jonas' },
];

const limits = {
  jonas: 1500,
  matilda: 100,
};

var addExpense = function (value, description, user) {
  if (!user) {
    console.warn(
      `User wasn't correcly specified. Please provide a non-empty string.`
    );
    return;
  }
  user = user.toLowerCase();

  let lim = limits[user] ? limits[user] : 0;
  if (value > lim) {
    console.warn("Limit exceeded! Can't add this item to the budget.");
    return;
  }

  budget.push({ value: -value, description: description, user: user });
};

addExpense(10, 'Pizza 🍕');
addExpense(100, 'Going to movies 🍿', 'Matilda');
addExpense(200, 'Stuff', 'Jay');

console.log(budget);

const check = function () {
  budget.forEach(b => {
    if (!b.user) limits[b.user] = 0;
    if (b.value < -limits[b.user]) {
      b.flag = 'limit';
    }
  });
};

// const check = function () {
//   for (var el of budget) {
//     var lim;
//     if (limits[el.user]) {
//       lim = limits[el.user];
//     } else {
//       lim = 0;
//     }

//     if (el.value < -lim) {
//       el.flag = 'limit';
//     }
//   }
// };
check();
console.log(budget);

const bigExpenses = function (limit) {
  const emojis = budget
    .filter(b => {
      return b.value <= -limit;
    })
    .map(b => b.description.slice(-2));

  console.log(emojis.join(' / '));
};

bigExpenses(1000);
