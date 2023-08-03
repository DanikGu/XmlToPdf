import React from 'react';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import styles from "./styles/LoginPage.module.css"

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
      <>
        {
          isLogin ? 
          <div className={styles['login-page']}>
            <LoginForm 
              switchPageState={this.switchPageState}
              setToken={this.props.setToken}
            ></LoginForm>
          </div>
          : 
          <div className={styles['login-page']}>
            <SignUpForm  
              switchPageState={this.switchPageState}
              setToken={this.props.setToken}
            ></SignUpForm>
          </div>
        }
      </>
    );
  }
}

export default LoginPage;