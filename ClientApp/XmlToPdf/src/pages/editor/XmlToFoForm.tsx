import React from 'react';

interface XmlToFoFormProps {
    handleSubmit: (xml: File | null, xsl: File | null) => void
}
interface XmlToFoFormState {
    xmlFile: File | null;
    xslFile: File | null;
}
class XmlToFoForm extends React.Component<XmlToFoFormProps, XmlToFoFormState> {
    constructor(props: XmlToFoFormProps) {
      super(props);
      this.state = {
        xmlFile: null,
        xslFile: null,
      };
    }
    render() {
      return (
        <div className='form'>
          <h6 className='form-title'>Apply XSL to XML</h6>
          <div className='form-input-container'>
            <label htmlFor="xmlFile">XML: </label>
            <button
              className='default-button'
              onClick={() => document.getElementById("xmlFile")?.click()}
            >
              {this.state.xmlFile?.name ?? "Select"}
            </button>
            <input
              style={{ display: "none" }}
              type="file"
              className='default-input'
              id="xmlFile"
              name="xmlFile"
              accept=".xml"
              onChange={(e) =>
                this.setState({ xmlFile: e.target.files ? e.target.files[0] : null })
              }
            />
          </div>
          <div className='form-input-container'>
            <label htmlFor="xslFile">XSL: </label>
            <button
              className='default-button'
              onClick={() => document.getElementById("xslFile")?.click()}
            >
              {this.state.xslFile?.name ?? "Select"}
            </button>
            <input
              style={{ display: "none" }}
              type="file"
              id="xslFile"
              name="xslFile"
              accept=".xsl,.xslt"
              onChange={(e) =>
                this.setState({ xslFile: e.target.files ? e.target.files[0] : null })
              }
            />
          </div>
          <button className='transform default-button' onClick={() => this.props.handleSubmit(this.state.xmlFile, this.state.xslFile)}>
            Transform
          </button>
        </div>
      );
    }
  }
  export default XmlToFoForm;