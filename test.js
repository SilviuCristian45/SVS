const emailValidator = require('deep-email-validator');

async function isEmailValid(email) {
    return emailValidator.validate(email)
}

async function test() {
    let p = await isEmailValid('silviudinca413@gmail.com');
    console.log(p.valid);
}

test();