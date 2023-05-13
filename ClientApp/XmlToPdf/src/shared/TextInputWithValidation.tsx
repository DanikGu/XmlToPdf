import React from 'react';
import "./styles/TextInputWithValidation.css"
interface TextInputWithValidationProps {
  validationPattern?: RegExp;
  validationFunction?: (value: string) => string | null;
  errorMessage?: string;
  inputType?: string;
  valueSetter?: (value: string) => void,
  setFormValid?: (value: boolean) => void
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
    if (errorMessage) {
      this.props.setFormValid?.(false);
    } else {
      this.props.setFormValid?.(true);
    }
    this.setState({
      value,
      errorMessage,
    });
    this.props.valueSetter?.(value);
  }

  render() {
    const { inputType } = this.props;
    const { value, errorMessage } = this.state;

    return (
      <div className='tbv-input-container'>
        <input className="default-input" type={inputType || "text"} value={value} onChange={this.handleChange} />
        <div 
          className='tbv-error' 
          style={{ visibility:  errorMessage ? "visible" : "hidden" }}
        >
          {errorMessage ?? "no erros"}
        </div>
      </div>
    );
  }
}

export default TextInputWithValidation;