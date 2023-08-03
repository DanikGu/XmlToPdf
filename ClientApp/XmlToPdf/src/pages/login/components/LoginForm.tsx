import React, { useEffect, useState } from 'react';
import LoginPageFormsProps from '../interfaces/LoginPageFormsProps'
import TextInputWithValidation from '@/shared/TextInputWithValidation';
import { LoginService } from '@/services'
import { Button } from 'antd';
import { useToken } from '@/utils';
import styles from  "../styles/LoginFrom.module.css"
type FieldWithValidation = {
  value: string,
  isValid: boolean
}
interface UserCreds {
  userName: string, 
  password: string
}
const LoginForm = (props: LoginPageFormsProps) => {
  const defaultFieldValue = {
    value: '',
    isValid: false
  } as FieldWithValidation;
  const [isValid, setIsFormValid] = useState<boolean>(false);
  const [userName, setUserName] = useState<FieldWithValidation>(defaultFieldValue);
  const [password, setPassword] = useState<FieldWithValidation>(defaultFieldValue);

  const login = async () => {
    let token = await LoginService.GetAuthToken(userName.value, password.value);
    if (token) {
      props.setToken(token);
    }
  }
  useEffect(() => {
    let isValid = userName.isValid && password.isValid;
    setIsFormValid(isValid);
  }, [userName.value, password.value]);
  return (
    <div className = {styles['login-form-box']}>
      <div className = {styles["login-form-box-header"]}>Welcome back!</div>
      <div className = {styles["form"]}>
      <div className = {styles["input-conatiner"]}>
          <label>Email:</label>
          <TextInputWithValidation
              validationPattern={/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/}
              errorMessage="*Must be valid email"
              valueSetter={(value, isValid) => setUserName({ value, isValid } )}
          />
      </div>
      <div className = {styles["input-conatiner"]}>
          <label>Password:</label>
          <TextInputWithValidation
            validationPattern={/^[a-zA-Z0-9]+$/}
            errorMessage="*Password must only contain letters and numbers."
            inputType='password'
            valueSetter={(value, isValid) => setPassword({ value, isValid })}
          />
      </div>
      <div className = {styles['buttonContainer']}>
          <Button
            type='primary' 
            disabled = {!isValid}  
            onClick = {login}> Login </Button>
          <Button onClick={props.switchPageState}>Create account</Button>
      </div>
      </div>
    </div>
  );
}

export default LoginForm;
