// const StringTemplate = require('string-template');
//
//
// let date = new Date('1492793694.702125');

// console.log(date);

let botId = "U5603NE5B";

let text = "Hi <@U5603NE5B>. I would like to <@U5603NE5B>";

let re = new RegExp("<@" + botId + ">");

let result = text.find(re);

console.log(re);
console.log("\n");
console.log(result);