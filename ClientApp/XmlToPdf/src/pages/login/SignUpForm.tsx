import React from 'react';
import TextInputWithValidation from '../../shared/TextInputWithValidation';
import LoginPageFormsProps from './interfaces/LoginPageFormsProps';
import FetchUtils from '../../utils/FetchUtils';
import PopupUtils from '../../shared/PopupUtils';
interface SignUpFormStateInterface {
  userName: string,
  password: string,
  confirmPassword: string
}
class SignUpForm extends React.Component<LoginPageFormsProps, SignUpFormStateInterface> {
    constructor(props: LoginPageFormsProps) {
      super(props);
      this.state = {
        userName: '',
        password: '',
        confirmPassword: ''
      };
      this.signUp = this.signUp.bind(this);
      this.checkConfirmPassword = this.checkConfirmPassword.bind(this);
    }
    isFormValid: boolean = true;
    checkConfirmPassword(value: string): string | null {
      if (value != this.state.password) {
        return "Passwords should be the same"
      }
      return null;
    }
    signUp() {
      if (!this.isFormValid || !this.state.confirmPassword ) {
        return;
      }
      FetchUtils
        .makeApiCall("api/users", 
          { 
            userName: this.state.userName,
            password: this.state.password
          })
        .then((data: any)=> { 
          this.login(this.state.userName, this.state.password);
        })
        .catch((message) => PopupUtils.alert(message));
    }
    login(name: string, password: string) {
      FetchUtils
        .makeApiCall("api/users/BearerToken", 
          { 
            userName: name,
            password: password
          })
        .then((data: any)=> { 
          this.props.setToken({ 
            token: data?.token, 
            expiration: data?.expiration  
          }) 
        })
        .catch((message) => PopupUtils.alert(message));
    }
    render() {
      return (
        <div className='login-form-box sign-up-form-box'>
          <div className="login-form-box-header">Create password</div>
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
            validationPattern={/^[a-zA-Z0-9]{6,}$/}
            errorMessage="*Password must only contain letters and numbers."
            inputType='password'
            valueSetter={(password) => this.setState({ password: password })}
            setFormValid={(value) => this.isFormValid = value}
          />
          </div>
          <div className='input-conatiner'>
          <label>Confirm Password:</label>
          <TextInputWithValidation
            validationFunction={this.checkConfirmPassword}
            inputType='password'
            valueSetter={(confirmPassword) => this.setState({ confirmPassword: confirmPassword })}
            setFormValid={(value) => this.isFormValid = value}
          />
          </div>
          
          <div className='buttonContainer'>
              <button type='button' className='default-button' onClick={this.signUp}>Ok</button>
              <button type='button' className='default-button' onClick={this.props.switchPageState}>Login</button>
          </div>
          </div>
        </div>
      );
    }
}

export default SignUpForm;