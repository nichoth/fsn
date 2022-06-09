// var React = require('react')
import './Trash.css'

export default function Trash (props) {
    var cl = (props.className || '') + ' trash-btn emoji-btn'

    return (
        <button {...props} className={cl} title={props.title}
            type="button"
        >
            <span role="img" aria-label="delete">🗑️</span>
        </button>
    )
}
