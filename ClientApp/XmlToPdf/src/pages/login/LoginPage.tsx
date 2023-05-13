import React from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import "./styles/LoginPage.css"

interface LoginPageProps {
  setToken: (userToken: { token: string; expiration: Date; }) => void
}
interface LoginPageState {
  isLogin: boolean
}
class LoginPage extends React.Component<LoginPageProps, LoginPageState> {
  switchPageState() {
    this.setState({
      isLogin: !this.state.isLogin
    });
  }
  constructor(props: LoginPageProps) {
    super(props);
    this.state = {
      isLogin : true
    }
    this.switchPageState = this.switchPageState.bind(this);
  }


  render() {
    const { isLogin } = this.state;
    return (
      
      <div>
        <div className='login-page' 
          style={{ display: isLogin ? "flex" : "none" }}
        >
          <LoginForm 
            switchPageState={this.switchPageState}
            setToken={this.props.setToken}
          ></LoginForm>
        </div>
        <div className='login-page' 
        style={{ display: isLogin ? "none" : "flex" }}
        >
          <SignUpForm  
            switchPageState={this.switchPageState}
            setToken={this.props.setToken}
          ></SignUpForm>
        </div>
      </div>
    );
  }
}

export default LoginPage;