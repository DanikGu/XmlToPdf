import React from 'react';
import editCodeSvg from '/public/code-slash-outline.svg';
import branch from "/public/git-branch-outline.svg";
import downloadCodeSvg from '/public/cloud-download-outline.svg';
import MonacoEditor from '@uiw/react-monacoeditor';
import FoTreeView from './FoTreeViewComponent';
import FetchUtils from '../../utils/FetchUtils';

enum CodeEditorState{
    TREE,
    CODE
}
interface XmlCodeEditorProps {
    editorXml: string;
    switchEditorState: () => void;
    setEditorXml: (value: string) => void;
    updatePreview: (value: string) => void;
}
interface XmlCodeEditorState {
    codeEditorState: CodeEditorState;
    editorXml: string;
    xml: string;
}  
class XmlCodeEditor extends React.Component<XmlCodeEditorProps, XmlCodeEditorState> {
    constructor(props: XmlCodeEditorProps) {
        super(props);
        this.state = {
            codeEditorState: CodeEditorState.CODE,
            editorXml: props.editorXml,
            xml: props.editorXml
        };
        this.changeCodeEditorState = this.changeCodeEditorState.bind(this);
        this.downloadPdf = this.downloadPdf.bind(this);
        this.onEditorTextChange = this.onEditorTextChange.bind(this);
        this.onClose = this.onClose.bind(this);
    }
    changeCodeEditorState() {
        this.setState({ 
            codeEditorState: this.state.codeEditorState === CodeEditorState.TREE ? 
                CodeEditorState.CODE : 
                CodeEditorState.TREE,
            editorXml: this.state.xml
        });
    }
    downloadPdf() {
        FetchUtils.makeApiCall("api/Convertor", { xmlData: this.state.editorXml.trim() }, "POST", "BLOB").
        then((blob: any) => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "template.pdf";
            document.body.appendChild(a); 
            a.click();    
            a.remove();
        });
    }
    onEditorTextChange(value: string, event: any) {
        this.setState( { xml: value } );
        this.props.updatePreview(value);
    }
    setEditorText(value: string) {
        this.setState( { xml: value, editorXml: value} );
        this.props.updatePreview(value);
    }
    onClose() {
        this.props.setEditorXml(this.state.xml);
        this.props.switchEditorState();
    }
    render() {
        return (
            <div className='xml-code-editor'>
                <div className='tool-bar'>
                    <button onClick={this.onClose}><img src = {editCodeSvg}/></button>
                    <button onClick={this.changeCodeEditorState}><img src = {branch}/></button>
                    <button onClick={this.downloadPdf}><img src = {downloadCodeSvg}/></button>
                </div>
                {
                    this.state.codeEditorState === CodeEditorState.CODE &&
                    <MonacoEditor height="90%" width="100%" language="xml" 
                        value= {this.state.editorXml}
                        onChange={this.onEditorTextChange}
                        options={{
                        theme: 'vs',
                        minimap: { enabled: false },
                        wordWrap: "on"
                    }}/>
                }
                {
                    this.state.codeEditorState === CodeEditorState.TREE &&
                    <FoTreeView 
                        onXmlChange={(data) =>  this.onEditorTextChange(data, new Event("tree updated"))}
                        xml = { this.state.editorXml }
                    />
                }

            </div>
        );
  }
}

export default XmlCodeEditor;