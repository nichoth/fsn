// const [pwdOk, validation] = pwIsOk(pendingPwds)

const specialChars = '!@#$%^&*()_-+={[}]|:;"\'<,>.'
const upperTester = new RegExp("(?=.*[A-Z])")
const lowerTester = new RegExp("(?=.*[a-z])")
const digit = new RegExp("(?=.*[0-9])")

export function passwordIsOk (pendingPwds) {
    const { password, passwordVerify } = pendingPwds

    // could use regex here, but how?
    const hasSpecial = Array.prototype.some.call(password, letter => {
        return specialChars.includes(letter)
    })

    const validations = {
        length: (password.length >= 6),
        upper: upperTester.test(password),
        lower: lowerTester.test(password),
        digit: digit.test(password),
        eq: (password === passwordVerify),
        special: (hasSpecial)
    }

    // return [isValid, { isValid-by-key }]
    return [
        Object.keys(validations).reduce((isValid, k) => {
            return isValid && validations[k]
        }, true),

        validations
    ]
}

// must have the same keys as `validations` object returned above
passwordIsOk.requirements = {
    length: ['minimum length of 6 characters'],
    upper: ['at least 1 uppercase character'],
    lower: ['at least 1 lowercase character'],
    digit: ['at least 1 number'],
    eq: ['verification is equal'],
    special: ['has at least 1 special character — ']
}
