/**
 * Template login field
 * @author patrickkerypei / https://github.com/patrickkerrypei
 */

// Libraries
import React, { Component, PropTypes } from 'react';

export default class LoginField extends Component {

    constructor(props) {
        super(props);
        this.checkEnter = this.checkEnter.bind(this);
    }

    checkEnter(event) {
        if (event.which === 13) {
            this.props.onEnter();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.value !== this.props.value ||
               nextProps.valid !== this.props.valid;
    }

    render() {
        return (
            <div>

                <div className={`input-group ${this.props.valid ? '' : 'has-error'}`}
                     style={this.props.indentStyle || {}}>
                    <span className="input-group-addon">
                        <i className={this.props.iconClass}/>
                    </span>
                    <input autoFocus={this.props.autoFocus}
                           className="form-control"
                           name={this.props.name}
                           onBlur={this.props.value !== '' ? this.props.onBlur : null}
                           onChange={this.props.onInputChange}
                           onKeyUp={this.checkEnter}
                           placeholder={this.props.hint}
                           required="required"
                           type={this.props.textType || "text"}
                           value={this.props.value}/>
                    <br/>
                </div>

                {this.props.valid ? null :
                    <div className="row">
                        <div className="col-sm-12" style={{textAlign: "center"}}>
                            <span style={{color: "red", textAlign: "center"}}>{this.props.invalidMessage}</span>
                        </div>
                    </div>}

                <br/>
            </div>
        );
    }
}

LoginField.propTypes = {
    autoFocus: PropTypes.bool,
    hint: PropTypes.string.isRequired,
    iconClass: PropTypes.string.isRequired,
    indentStyle: PropTypes.object,
    invalidMessage: PropTypes.string,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onEnter: PropTypes.func,
    onInputChange: PropTypes.func.isRequired,
    valid: PropTypes.bool,
    value: PropTypes.string.isRequired
};