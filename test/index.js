import test from "tape"
import { passwordIsOk } from "../src/util/validation.js"


// length: ['minimum length of 6 characters'],
// upper: ['at least 1 uppercase character'],
// lower: ['at least 1 lowercase character'],
// digit: ['at least 1 number'],
// eq: ['verification is equal'],
// special: ['has at least 1 special character — ']


test('validation with a too short password', t => {
    const pendingPasswords = {
        password: '123ab',
        passwordVerify: '123ab'
    }

    const val = passwordIsOk(pendingPasswords)

    t.equal(val[0], false, 'should be an invalid password')
    t.equal(val[1].length, false, 'should say it is not long enough')

    pendingPasswords.password += 'c'
    t.equal(passwordIsOk(pendingPasswords)[1].length, true,
        'should say a 6 character password is long enough')
    t.end()
})

test('validation without an uppercase letter', t => {
    const pendingPasswords = {
        password: '123abc!',
        passwordVerify: '123abc!'
    }

    const val = passwordIsOk(pendingPasswords)

    t.equal(val[0], false, 'should be invalid without an uppercase letter')
    t.equal(val[1].upper, false, 'should say "upper" is false')

    const validation = Object.assign({}, val[1])
    delete validation.upper
    const isOk = Object.values(validation).every(Boolean)
    t.equal(isOk, true, 'should be valid asside from "upper"')

    t.end()
})

// any other test cases go here

test('validation with a valid password', t => {
    const pendingPasswords = {
        password: '123abcB!',
        passwordVerify: '123abcB!'
    }

    t.equal(passwordIsOk(pendingPasswords)[0], true,
        'should say a valid password is valid')
    t.end()
})
