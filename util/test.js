const StringTemplate = require('string-template');


let text = StringTemplate("Hi {user.name}", {
    "user.name" : "Irsan Jie"
});

console.log(text);