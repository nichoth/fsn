import './button.css'

export default function Button (props) {
    const _props = {...props}
    delete _props.isSpinning

    const cl = (props.class || props.className || '')

    return <span className="form-stuff">
        {props.isSpinning ?
            (<button {..._props} className={cl + ' spinning'}
                disabled={true}
            >
                <span className="btn-content">{props.children}</span>
            </button>) :

            (<button {..._props}>
                <span className="btn-content">{props.children}</span>
            </button>)
        }
    </span>
}
