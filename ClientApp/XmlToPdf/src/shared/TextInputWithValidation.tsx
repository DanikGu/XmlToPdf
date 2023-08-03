import React from 'react';
import Styles from "./styles/TextInputWithValidation.module.less"
import { Input } from 'antd'
import { Space, Typography } from 'antd';
interface TextInputWithValidationProps {
  validationPattern?: RegExp;
  validationFunction?: (value: string) => string | null;
  errorMessage?: string;
  inputType?: string;
  valueSetter?: (value: string, isValid: boolean) => void
}

interface TextInputWithValidationState {
  value: string;
  errorMessage: string | null;
  
}

class TextInputWithValidation extends React.Component<TextInputWithValidationProps, TextInputWithValidationState> {
  constructor(props: TextInputWithValidationProps) {
    super(props);

    this.state = {
      value: '',
      errorMessage: null,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { value } = event.target;
    const { validationPattern, validationFunction } = this.props;

    let errorMessage: string | null = null;

    if (validationPattern && !value.match(validationPattern)) {
      if(!!value) {
        errorMessage = this.props.errorMessage || "Input is invalid";
      }
    } else if (validationFunction) {
      errorMessage = validationFunction(value);
    }
    this.setState({
      value,
      errorMessage,
    });
    this.props.valueSetter?.(value, !errorMessage);
  }

  render() {
    const { inputType } = this.props;
    const { value, errorMessage } = this.state;
    const { Text, Link } = Typography;
    return (
      <div className= { Styles['tbv-input-container'] } >
        <Input status = {errorMessage ? "error" : ""} type = { inputType || "text" } value={value} onChange={this.handleChange} />
        <Text 
          type="danger"
          className= { Styles['tbv-error']} 
          style={{ visibility:  errorMessage ? "visible" : "hidden" }}
        >
          {errorMessage ?? "no erros"}
        </Text>
      </div>
    );
  }
}

export default TextInputWithValidation;