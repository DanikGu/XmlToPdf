import React, { useState, useRef, useCallback, useEffect  } from 'react';
import ZoomToolBar from "./components/ZoomToolBar";
import helloWorldXml from './constants/helloFoObjectTemplate';
import XmlCodeEditor from './components/XmlCodeEditor';
import Preview from './components/Preview';
import './styles/EditorPage.css';
import SideBarMenu from './components/SideBarMenu';
import TopMenu from './components/TopMenu';
import { FileService } from '@/services';
import { Spin } from 'antd';
interface FileItem {
    uniqueFileName: string;
    fileName:string;
    createdOn: Date; 
}
interface EditPageProps {}
const EditorPage: React.FC<EditPageProps> = () => {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [isCodeEditorOpened, setIsCodeEditorOpened] = useState<boolean>(false);
    const [workingFileId, setWorkingFileId] = useState<string>("");
    const [activeFileId, setActiveFileId] = useState('');
    const previewZoom = useRef(1);
    const previewRef = useRef(null);
    const loadFilesList = useCallback(async () => {
        let data = await FileService.GetFile();  
        setFiles(data);
      }, []);
    useEffect(() => {
        loadFilesList();
    }, [loadFilesList]);
    
    const switchEditorState = () => {
        setIsCodeEditorOpened(prevState => !prevState);
    };
    const zoom = (value: number) => {
        previewZoom.current += value; 
        (previewRef.current as any)?.updatePreviewScale(previewZoom.current);
    };
    return (
        <div className='editorPage'>
            { !isCodeEditorOpened && <ZoomToolBar setZoom={zoom} />}
            <SideBarMenu files={files} activeFileId={activeFileId} setActiveFileId={setActiveFileId}/>
            <div className='preview-container'>
                <TopMenu openCodeEditor={switchEditorState} files={files} loadFilesList={loadFilesList} activeFileId={activeFileId} ></TopMenu>
                <Preview ref={previewRef} previewScale = { previewZoom }/>
            </div>
            { isCodeEditorOpened && <XmlCodeEditor switchEditorState = {switchEditorState} /> }
        </div>
    );
}

export default EditorPage;