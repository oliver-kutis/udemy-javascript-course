'use strict';

/////////////////////////////////////////
// Constructor Functions and the new Operator
const Person = function (firstName, birthYear) {
  // Instance properties
  this.firstName = firstName;
  this.birthYear = birthYear;

  // Never do this
  // this.calcAge = function () {
  //   console.log(2037 - this.birthYear);
  // };
};

// instances of Person
const jonas = new Person('Jonas', 1991);
const oliver = new Person('Oliver', 1999);
const oliverStr = 'oliver';

console.log(jonas, oliver); // Person {firstName: "Jonas", birthYear: 1991} Person {firstName: "Oliver", birthYear: 1999}
console.log(oliver instanceof Person); // true
console.log(oliverStr instanceof Person); // false

/////////////////////////////////////////
// Prototypes
console.log(Person.prototype); // {constructor: ƒ}

Person.prototype.calcAge = function () {
  console.log(2037 - this.birthYear);
};

jonas.calcAge(); // 46
oliver.calcAge(); // 38

// Prototypal inheritance
console.log(jonas.__proto__);
console.log(jonas.__proto__ === Person.prototype); // true
console.log(Person.prototype.isPrototypeOf(jonas)); // true
console.log(Person.prototype.isPrototypeOf(Person)); // false

Person.prototype.species = 'Homo Sapiens';
console.log(jonas.hasOwnProperty('species')); // false
console.log(jonas.hasOwnProperty('firstName')); // true

// const h1 = document.querySelector('h1');
// console.dir(h1);

/////////////////////////////////////////
// Coding Challenge #1

// 1. Use constructor func. to implement a Car
const Car = function (make, speed) {
  this.make = make;
  this.speed = speed;
};
// 2. 'accelerate' method
Car.prototype.accelerate = function () {
  this.speed += 10;
  console.log(`${this.make} is going ${this.speed} km/h`);

  // return this.speed;
};
// 3. Implement a 'brake' method
Car.prototype.brake = function () {
  this.speed -= 5;
  console.log(`${this.make} is going ${this.speed} km/h`);

  // return this.speed;
};

// 4. Create 2 car objects and experiment
const bmw = new Car('BMW', 120);
const mercedes = new Car('Mercedes', 95);

bmw.accelerate();
bmw.accelerate();
bmw.accelerate();
bmw.brake();
mercedes.brake();
mercedes.brake();
mercedes.accelerate();

/////////////////////////////////////////
// ES6 Classes

// class expression
// const PersonCl = class {};

// class declaration
class PersonCl {
  constructor(fullName, birthYear) {
    this.fullName = fullName;
    this.birthYear = birthYear;
  }

  // Instance methods
  // Methods will be added to .prototype property
  calcAge() {
    console.log(2037 - this.birthYear);
  }

  greet() {
    console.log(`Hey ${this.fullName}`);
  }

  /////////////////////////////////////////
  //// Setters and Getters
  get age() {
    return 2037 - this.birthYear;
  }

  // Set a property that already exists
  set fullName(name) {
    console.log(name);
    // can't use the same name as the setter or constructor function
    if (name.includes(' ')) this._fullName = name;
    else alert(`${name} is not a full name`);
  }

  get fullName() {
    return this._fullName;
  }

  // Static method
  static hey() {
    console.log('Hey there');
    console.log(this);
  }
}

const jessica = new PersonCl('Jessica Davis', 1996);
console.log(jessica); // PersonCl {fullName: "Jessica Davis", birthYear: 1996}

const walter = new PersonCl('Walter White', 1965);
console.log(walter); // PersonCl {fullName: "Walter White", birthYear: 1965}

jessica.calcAge(); // 41
walter.calcAge(); // 72

console.log(jessica.age); // 41
console.log(jessica.age); // 41

console.log(jessica.__proto__ === PersonCl.prototype); // true

/////////////////////////////////////////
// Static method
PersonCl.hey(); // Hey there
try {
  jessica.hey();
} catch (err) {
  console.error(err); // TypeError: jessica.hey is not a function
}

/////////////////////////////////////////
// Object.create() method
// const PersonProto = {
//   calcAge() {
//     console.log(2037 - this.birthYear);
//   },

//   // similar to constructor function (but has nothing to do with it)
//   init(firstName, birthYear) {
//     this.firstName = firstName;
//     this.birthYear = birthYear;
//   },
// };

// const steven = Object.create(PersonProto);
// console.log(steven); // {}
// steven.name = 'Steven';
// steven.birthYear = 2002;
// steven.calcAge(); // 35

// console.log(steven.__proto__ === PersonProto); // true

// const sarah = Object.create(PersonProto);
// sarah.init('Sarah', 1979);
// console.log(sarah); // {firstName: "Sarah", birthYear: 1979}

/////////////////////////////////////////
// Coding Challenge #2

// 1. Re-create challenge #1, but this time using an ES6 class
class CarCl {
  constructor(make, speed) {
    this.make = make;
    this.speed = speed;
  }

  accelerate() {
    this.speed += 10;
    console.log(`${this.make} is going ${this.speed} km/h`);
  }
  brake() {
    this.speed -= 5;
    console.log(`${this.make} is going ${this.speed} km/h`);
  }

  get speedUS() {
    return this.speed / 1.6;
  }
  set speedUS(speed) {
    this.speed = speed * 1.6;
  }
}
// 2. Add a getter called 'speedUS' which returns the current speed in mi/h (divide by 1.6)
// 3. Add a setter called 'speedUS' which sets the current speed in mi/h (but converts it to km/h before storing the value, by multiplying the input by 1.6)
// 4. Create a new car and experiment with the accelerate and brake methods, and with the getter and setter.

const ford = new CarCl('Ford', 120);
console.log(ford.speedUS); // NaN
ford.accelerate();
ford.accelerate();
ford.brake();
ford.speedUS = 50;
ford.brake();
console.log(ford); // CarCl {make: "Ford", speed: 25}

/////////////////////////////////////////
// ... we already build the PersonCl class
// Inheritance Between "Classes": Constructor Functions
const Student = function (firstName, birthYear, course) {
  // this.firstName = firstName;
  // this.birthYear = birthYear;
  Person.call(this, firstName, birthYear); // basically a constructor function of the Parent class PersonCl.call(this, ...
  this.course = course;
};
// Student.prototype = Person.prototype; // this would also work, but it would also change the prototype of the Person class (
Student.prototype = Object.create(Person.prototype); // this is the better way to do it (it doesn't change the prototype of the Person class)
Student.prototype.introduce = function () {
  console.log(`My name is ${this.firstName} and I study ${this.course}`);
};

const mike = new Student('Mike', 2020, 'Computer Science');
mike.introduce(); // My name is Mike and I study Computer Science
mike.calcAge(); // 17
console.log(mike); // Student {firstName: "Mike", birthYear: 2020, course: "Computer Science"}
console.log(mike.__proto__); // Person {constructor: ƒ, introduce: ƒ}
console.log(mike.__proto__.__proto__); // {calcAge: ƒ, greet: ƒ, constructor: ƒ}

console.log(mike instanceof Student); // true
console.log(mike instanceof Person); // true
console.log(mike instanceof Object); // true

/////////////////////////////////////////
// Coding Challenge #3

/*
1. Use a constructor function to implement an 
  Electric Car (called EV) as a CHILD "class" of Car. 
  Besides a make and current speed, 
  the EV also has the current battery charge in % ('charge' property) 
2. Implement a 'chargeBattery' method which takes an
  argument 'chargeTo' and sets the battery charge to 'chargeTo'
3. Implement an 'accelerate' method that will increase the car's speed
  by 20, and decrease the charge by 1%. Then log a message like this:
  'Tesla going at 140 km/h, with a charge of 22%'
4. Create an electric car object and experiment with calling
  'accelerate', 'brake' and 'chargeBattery' (charge to 90%).
  Notice what happens when you 'accelerate'! 
  Hint: Review the definiton of polymorphism 😉

DATA CAR 1: 'Tesla' going at 120 km/h, with a charge of 23%
*/
const EV = function (make, speed, charge) {
  Car.call(this, make, speed);
  this.charge = charge;
};
EV.prototype = Object.create(Car.prototype);
EV.prototype.constructor = EV;

EV.prototype.chargeBattery = function (chargeTo) {
  this.charge = chargeTo;
};
// This overwrites the method in the Car class (it appears first in the prototype chain)
EV.prototype.accelerate = function () {
  this.speed += 20;
  this.charge -= 1;
  console.log(`Tesla going at ${this.speed} km/h charged to ${this.charge}%.`);
};

const tesla = new EV('Tesla', 120, 23);
console.log(tesla); // EV {make: "Tesla", speed: 120, charge: 23}
tesla.accelerate(); // Tesla going at 140 km/h with charged to 22%.
tesla.chargeBattery(90);
tesla.accelerate(); // Tesla going at 160 km/h with charged to 21%.
tesla.brake(); // Tesla going at 155 km/h with charged to 20%.

// Inheritance Between "Classes": ES6 Classes
// student class is a child class of PersonCl
class StudentCl extends PersonCl {
  constructor(fullName, birthYear, course) {
    // Always needs to happen first!
    super(fullName, birthYear); // basically a constructor function of the Parent class PersonCl.call(this, ...)
    this.course = course;
  }

  introduce() {
    console.log(`My name is ${this.fullName} and I study ${this.course}`);
  }

  // Overwriting a method (it appears first in the prototype chain)
  calcAge() {
    console.log(
      `I'm ${
        2037 - this.birthYear
      } years old, but as a student I feel more like ${
        2037 - this.birthYear + 10
      }`
    );
  }
}

const martha = new StudentCl('Martha Jones', 2012, 'Computer Science');
console.log(martha);
martha.introduce(); // My name is Martha Jones and I study Computer Science
martha.calcAge(); // 25

/////////////////////////////////////////
// Inheritance Between "Classes": Object.create()
// ... PersonProto is the parent class (already defined above, we'll define it again here)
const PersonProto = {
  calcAge() {
    console.log(2037 - this.birthYear);
  },

  // similar to constructor function (but has nothing to do with it)
  init(firstName, birthYear) {
    this.firstName = firstName;
    this.birthYear = birthYear;
  },
};
const StudentProto = Object.create(PersonProto);
StudentProto.init = function (firstName, birthYear, course) {
  PersonProto.init.call(this, firstName, birthYear);
  this.course = course;
};
StudentProto.introduce = function () {
  console.log(`My name is ${this.firstName} and I study ${this.course}`);
};

const jay = Object.create(StudentProto);
jay.init('Jay', 2010, 'Computer Science');
jay.introduce(); // My name is Jay and I study Computer Science
jay.calcAge(); // 27

console.log(jay);

/////////////////////////////////////////
// Another Class Example
/*
class Account {
  constructor(owner, currency, pin) {
    this.owner = owner;
    this.currency = currency;
    this.pin = pin;
    this.movements = [];
    this.locale = navigator.language;

    console.log(`Thanks for opening an account, ${owner}`);
  }

  // Public interface of our objects
  deposit(val) {
    this.movements.push(val);
  }
  withdraw(val) {
    this.deposit(-val);
  }
approveLoan(val) {
    return true;
  }
  requestLoan(val) {
    if (this.approveLoan(val)) {
      this.deposit(val);
      console.log(`Loan approved`);
    }
  }
}

const acc1 = new Account('Jonas', 'EUR', 1111);
console.log(acc1); // Account {owner: "Jonas", currency: "EUR", pin: 1111, movements: Array(0), locale: "en-US"}

// Not recommended: Better method is to use methods for this
//  however, it can still be done manually
// acc1.movements.push(250);
// acc1.movements.push(-140);

// Rather
acc1.deposit(250);
acc1.withdraw(140);
acc1.requestLoan(1000);
acc1.approveLoan(1000); // only requestLoan can approve a loan (we should not be able to do this)

// we can for example access the pin - not good
console.log(acc1.pin); // 1111

console.log(acc1);
*/

/////////////////////////////////////////
// Encapsulation: Protected Properties and Methods !!!!!!!!!!!!! NOT IMPLEMENTED YET !!!!!!!!!!!!!
/*
  // 1. Public fields
  // 2. Private fields
  // 3. Public methods
  // 4. Private methods

class Account {
  // 1. Public fields (instances)
  locale = navigator.language;

  // 2. Private fields (instances)
  _movements = [];
  #pin;

  constructor(owner, currency, pin) {
    this.owner = owner;
    this.currency = currency;
    this.#pin = pin;
    // Protected property (not truly private)
    // this.movements = [];
    this.locale = navigator.language;

    console.log(`Thanks for opening an account, ${owner}`);
  }

  // 3. Public methods
  getMovements() {
    return this._movements;
  }
  deposit(val) {
    this._movements.push(val);
  }
  withdraw(val) {
    this.deposit(-val);
  }
  // approveLoan(val) {
  //   return true;
  // }
  requestLoan(val) {
    if (this.#approveLoan(val)) {
      this.deposit(val);
      console.log(`Loan approved`);
    }
  }

  // 4. Private methods
  #approveLoan(val) {
    return true;
  }
}

const acc1 = new Account('Jonas', 'EUR', 1111);
*/

/////////////////////////////////////////
// Chaining Methods (not really related to OOP, but it's good to know)
// we can chain methods if we return this in the methods
class Account {
  constructor(owner, currency, pin) {
    this.owner = owner;
    this.currency = currency;
    this._pin = pin;
    // Protected property (not truly private)
    this._movements = [];
    this.locale = navigator.language;

    console.log(`Thanks for opening an account, ${owner}`);
  }

  // 3. Public methods
  getMovements() {
    return this._movements;
  }
  deposit(val) {
    this._movements.push(val);
    // return this; // this allows us to chain methods
    return this; // this allows us to chain methods
  }
  withdraw(val) {
    this.deposit(-val);
    return this; // this allows us to chain methods
  }
  approveLoan(val) {
    return true;
  }
  requestLoan(val) {
    if (this.approveLoan(val)) {
      this.deposit(val);
      console.log(`Loan approved`);
      return this; // this allows us to chain methods
    }
  }
}

const acc1 = new Account('Jonas', 'EUR', 1111);
acc1.deposit(300).deposit(500).withdraw(35).requestLoan(25000).withdraw(4000);
console.log(acc1.getMovements());

/////////////////////////////////////////
// Coding Challenge #4
/*
1. Re-create challenge #3, but this time using ES6 classes:
  create an 'EVCl' child class of the 'CarCl' class
2. Make the 'charge' property private
3. Implement the ability to chain the 'accelerate' and 'chargeBattery'
  methods of this class, and also update the 'brake' method in the 'CarCl'
  class. Then experiment with chaining!
  
DATA CAR 1: 'Rivian' going at 120 km/h, with a charge of 23%
*/
// 1.
class EvCl extends CarCl {
  constructor(make, speed, charge) {
    super(make, speed);
    this._charge = charge;
  }
  accelerate() {
    this.speed += 20;
    this._charge -= 1;
    console.log(
      `${this.make} going at ${this.speed} km/h charged to ${this._charge}%.`
    );
    return this;
  }
  chargeBattery(chargeTo) {
    this._charge = chargeTo;
    console.log(`${this.make} charged to ${this._charge}%.`);
    return this;
  }
  brake() {
    this.speed -= 10;
    console.log(
      `${this.make} going at ${this.speed} km/h charged to ${this._charge}%.`
    );
    return this;
  }
}

const rivian = new EvCl('Rivian', 120, 23);

console.log(rivian); // EvCl {make: "Rivian", speed: 120, _charge: 23}
rivian.accelerate(); // Rivian going at 140 km/h with charged to 22%.
rivian.chargeBattery(90).accelerate().brake();

console.log(rivian.speedUS); // 93.75
console.log(rivian.speed); // 150
