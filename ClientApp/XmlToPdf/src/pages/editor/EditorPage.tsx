import React, { RefObject } from 'react';
import TopRightToolBar from "./TopRightToolBar";
import helloWorldXml from './constants/helloFoObjectTemplate';
import XmlCodeEditor from './XmlCodeEditor';
import Preview from './Preview';
import './styles/EditorPage.css';
import SideBarMenu from './SideBarMenu';

interface EditPageProps {}
interface EditorPageState {
    isCodeEditorOpened: boolean;
    editorXml: string;
}
class EditorPage extends React.Component<EditPageProps, EditorPageState> {
    constructor(props: EditPageProps) {
        super(props);
        this.state = {
            isCodeEditorOpened: false,
            editorXml: helloWorldXml
        };
        this.switchEditorState = this.switchEditorState.bind(this);
        this.setXmlFoToEditor = this.setXmlFoToEditor.bind(this);
        this.previewRef = React.createRef();
        this.codeEditorRef = React.createRef();
    }
    private previewRef: React.RefObject<Preview>;
    private codeEditorRef: React.RefObject<XmlCodeEditor>;
    switchEditorState() {
        this.setState({
            isCodeEditorOpened: !this.state.isCodeEditorOpened
        });
    }
    updatePreview(xml: any) {
        if (!xml) {
            xml = this.state.editorXml;
        }
        this.setState({editorXml: xml})
        this.previewRef.current?.updatePreview(xml);
    }
    zoom(value: number) {
        this.previewRef.current?.zoom(value);
    }
    setXmlFoToEditor(xml: string) {
        this.codeEditorRef.current?.setEditorText(xml);
        this.updatePreview(xml);
    }
    render() {
        return (
            <div className='editorPage'>
                {
                    !this.state.isCodeEditorOpened &&
                    <TopRightToolBar
                        zoom = {this.zoom.bind(this)}
                        switchEditorState = {this.switchEditorState}
                    />
                }
                <SideBarMenu
                    setXmlFoToEditor = {this.setXmlFoToEditor}
                    getFoXml={() => this.state.editorXml}
                />
                <Preview
                    ref = {this.previewRef}
                    previewScale = { 1 }
                    editorXml = {this.state.editorXml}
                />
                {
                    this.state.isCodeEditorOpened &&
                    <XmlCodeEditor
                        ref = {this.codeEditorRef}
                        editorXml = {this.state.editorXml}
                        switchEditorState = {this.switchEditorState}
                        updatePreview = {this.updatePreview.bind(this)}
                        setEditorXml = {(value: string) => this.setState({editorXml: value})}
                    />
                }
            </div>
        )
    }
}
export default EditorPage;