import React from 'react';
import TextInputWithValidation from '../../shared/TextInputWithValidation';
import "./styles/LoginFrom.css"
import LoginPageFormsProps from './interfaces/LoginPageFormsProps'
import FetchUtils from '../../utils/FetchUtils';
import PopupUtils from '../../shared/PopupUtils';

interface LoginStateInterface {
  userName: string,
  password: string
}

class LoginForm extends React.Component<LoginPageFormsProps, LoginStateInterface> {
  isFormValid: boolean = true;
  constructor(props: LoginPageFormsProps) {
    super(props);
    this.state = {
      userName: "",
      password: ""
    }
    this.login = this.login.bind(this);
  }
  login() {
    FetchUtils
        .makeApiCall("api/users/BearerToken", 
          { 
            userName: this.state.userName,
            password: this.state.password
          })
        .then((data: any)=> { 
          this.props.setToken({ 
            token: data?.token, 
            expiration: data?.expiration  
          }) 
        })
        .catch((message) => PopupUtils.error(message));
  }
  render() {
    return (
      <div className='form-box-shadow login-form-box'>
        <div className="login-form-box-header">Enter password</div>
        <div className='form'>
        <div className='input-conatiner'>
            <label>Email:</label>
            <TextInputWithValidation
                validationPattern={/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/}
                errorMessage="*Must be valid email"
                valueSetter={(userName) => this.setState({ userName: userName })}
                setFormValid={(value) => this.isFormValid = value}
            />
        </div>
        <div className='input-conatiner'>
            <label>Password:</label>
            <TextInputWithValidation
              validationPattern={/^[a-zA-Z0-9]+$/}
              errorMessage="*Password must only contain letters and numbers."
              inputType='password'
              valueSetter={(password) => this.setState({ password: password })}
              setFormValid={(value) => this.isFormValid = value}
            />
        </div>
        <div className='buttonContainer'>
            <button type='button' className='default-button' onClick={this.login}>Ok</button>
            <button type='button' className='default-button' onClick={this.props.switchPageState}>Sign Up</button>
        </div>
        </div>
      </div>
    );
  }
}

export default LoginForm;