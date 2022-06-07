import { useState } from 'react'
import TextInput from './text-input'
import Button from './button'
import './App.css'
import { passwordIsOk } from './util/validation'
const { requirements } = passwordIsOk

const App = () => {
    const [isResolving, setResolving] = useState(false)
    const [pendingPwds, setPendingPwds] = useState({
        password: '',
        passwordVerify: ''
    })

    function savePassword (ev) {
        ev.preventDefault()
        setResolving(true)

        setTimeout(() => {
            setResolving(false)
        }, 2000)  // 2 seconds
    }

    function handleInput (ev) {
        const { name, value } = ev.target

        const obj = {}
        obj[name] = value
        const pwds = Object.assign({}, pendingPwds, obj)

        setPendingPwds(pwds)
    }

    const [pwdOk, validation] = passwordIsOk(pendingPwds)

    return (
    <div className="the-app">
        <h1>Reset a password</h1>

        <h2>Password requirements</h2>

        <ul className="form-instructions">
            {Object.keys(validation).map(k => {
                const isValid = validation[k]
                return (<li key={k}>
                    {
                    // only show check mark if there is something in input
                    // if input is empty, show initial state
                    }
                    {pendingPwds.password.length ?
                        (isValid ? <span>✅ </span> : <span>🔘 </span>) :
                        <span>🔘</span>
                    }
                    {' ' + requirements[k][0]}

                    {k === 'special' ?
                        (<code key="code">
                            {'!@#$%^&*()_-+={[}]|:;"\'<,>.'}
                        </code>) :
                        requirements[k][1]
                    }

                </li>)
            })}
        </ul>

        <form onSubmit={savePassword}>
            <TextInput type="password" displayName="Password"
                required={true} name="password" minLength={6}
                onChange={handleInput}
                value={pendingPwds.password}
            />

            <TextInput type="password" displayName="Verify password"
                name="passwordVerify"
                onChange={handleInput}
                value={pendingPwds.passwordVerify}
            />

            <Button disabled={!pwdOk} type="submit"
                isSpinning={isResolving}
            >
                Save password
            </Button>
        </form>
    </div>
    )
};

export default App;
