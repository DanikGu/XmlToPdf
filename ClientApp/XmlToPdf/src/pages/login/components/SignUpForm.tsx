import React, { useEffect, useState } from 'react';
import TextInputWithValidation from '@/shared/TextInputWithValidation';
import LoginPageFormsProps from '../interfaces/LoginPageFormsProps';
import LoginService from '@/services/LoginService';
import useToken from '@/utils/useToken';
import styles from  "../styles/LoginFrom.module.css"
import { Button } from 'antd';
type FieldWithValidation = {
  value: string,
  isValid: boolean
}
const SignUpForm = (props: LoginPageFormsProps) => {
    const defaultFieldValue = {
      value: '',
      isValid: false
    } as FieldWithValidation;
    const [userName, setUserName] = useState<FieldWithValidation>(defaultFieldValue);
    const [password, setPassword] = useState<FieldWithValidation>(defaultFieldValue);
    const [confirmPassword, setConfirmPassword] = useState<FieldWithValidation>(defaultFieldValue);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    

    const checkConfirmPassword = (value: string): string | null => {
        if (value != password.value) {
            return "Passwords should be the same"
        }
        return null;
    }
    useEffect(() => {
      let isValid = userName.isValid && password.isValid && confirmPassword.isValid;
      setIsFormValid(isValid);
    }, [userName.value, password.value, confirmPassword.value]);
    const signUp = async () => {
        if (!isFormValid || !confirmPassword) {
            return;
        }
        const token = await LoginService.CreateUserAndGetAuthToken(userName.value, password.value);
        if (token) {
          props.setToken(token);
        }
    }

    return (
        <div className = {styles['login-form-box']}>
            <div className = {styles["login-form-box-header"]}>Create account</div>
            <div className = {styles["form"]}>
                <div className = {styles["input-conatiner"]}>
                    <label>Email:</label>
                    <TextInputWithValidation
                        validationPattern={/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/}
                        errorMessage="*Must be valid email"
                        valueSetter={(value, isValid) => setUserName({value: value, isValid: isValid})}
                    />
                </div>
                <div className = {styles["input-conatiner"]}>
                    <label>Password:</label>
                    <TextInputWithValidation
                        validationPattern={/^[a-zA-Z0-9]{6,}$/}
                        errorMessage="*Password must only contain letters and numbers."
                        inputType='password'
                        valueSetter={(value, isValid) => setPassword({value: value, isValid: isValid})}
                    />
                </div>
                <div className = {styles["input-conatiner"]}>
                    <label>Confirm Password:</label>
                    <TextInputWithValidation
                        validationFunction={checkConfirmPassword}
                        inputType='password'
                        valueSetter={(value, isValid) => setConfirmPassword({value: value, isValid: isValid})}
                    />
                </div>
                <div className = {styles['buttonContainer']}>
                    <Button disabled = {!isFormValid} type='primary' onClick= {signUp} >Create account</Button>
                    <Button onClick = {props.switchPageState} >Log in</Button>
                </div>
            </div>
        </div>
    );
}

export default SignUpForm;