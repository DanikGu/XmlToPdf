import React, { useEffect, useRef, useState } from 'react';
import editCodeSvg from '/public/code-slash-outline.svg';
import branch from "/public/git-branch-outline.svg";
import downloadCodeSvg from '/public/cloud-download-outline.svg';
import MonacoEditor from '@uiw/react-monacoeditor';
import FoTreeView from './FoTreeViewComponent';
import { Button, theme } from 'antd';
import { Utils } from '@/utils';
import { useDispatch, useSelector } from 'react-redux';
import { selectXmlFo, setXmlFo } from '@/reduxConfig/xmlSlice';
import ConvertService from '@/services/ConvertService';
enum CodeEditorState {
    TREE,
    CODE
}
interface XmlCodeEditorProps {
    switchEditorState: () => void;
}
const { useToken } = theme;
const XmlCodeEditor: React.FC<XmlCodeEditorProps> = ({switchEditorState}) => {
    const xml = useSelector(selectXmlFo);
    const [codeEditorState, setCodeEditorState] = useState<CodeEditorState>(CodeEditorState.CODE);
    const [codeEditorXml, setCodeEditorXml] = useState<string>(xml);
    const editorXmlRef = useRef(xml);
    const dispatch = useDispatch();
    useEffect(() => {
        if (editorXmlRef.current != xml) {
            let prettyXml = Utils.prettifyXml(xml);
            setCodeEditorXml(prettyXml);
        }
    }, [xml])

    const setXml = (xml: string) => {
        editorXmlRef.current = xml;
        dispatch(setXmlFo(xml));
    }
    const changeCodeEditorState = () => {
        setCodeEditorState(
            codeEditorState === CodeEditorState.TREE 
            ? CodeEditorState.CODE 
            : CodeEditorState.TREE
        );
        editorXmlRef.current = xml;
    }
    const downloadPdf = async () => {
        let blob = await ConvertService.ConvertToPdf(editorXmlRef.current);
        Utils.DownloadFile(blob, "template.pdf");
    }
    const onEditorTextChange = (value: string, event: any) => {
        setXml(value)
    }
    const onClose = () => {
        switchEditorState();
    }
    const { token } = useToken();
    return (
        <div className='xml-code-editor' style={{ backgroundColor: token.colorPrimaryBg }}>
            <div className='tool-bar' >
                <Button className='tool-bar-button'  onClick = {onClose}><img src = {editCodeSvg}/></Button>
                <Button className='tool-bar-button'  onClick = {changeCodeEditorState}><img src = {branch}/></Button>
                <Button className='tool-bar-button'  onClick = {downloadPdf}><img src = {downloadCodeSvg}/></Button>
            </div>
            {
                codeEditorState === CodeEditorState.CODE &&
                <MonacoEditor height="90%" width="100%" language="xml" 
                    value= {codeEditorXml}
                    onChange={onEditorTextChange}
                    options={{
                    theme: 'vs',
                    minimap: { enabled: false },
                    wordWrap: "on"
                }}/>
            }
            {
                codeEditorState === CodeEditorState.TREE &&
                <FoTreeView 
                    onXmlChange={(data) =>  onEditorTextChange(data, new Event("tree updated"))}
                    xml = { codeEditorXml }
                />
            }
        </div>
    );
}

export default XmlCodeEditor;