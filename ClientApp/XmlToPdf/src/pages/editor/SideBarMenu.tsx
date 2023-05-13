import React from 'react';
import './styles/sidebar.css'
import XmlToFoForm from './XmlToFoForm';
import saveUrl from '/public/save.svg';
import saveAsUrl from '/public/save-sharp.svg';
import deleteUrl from '/public/trash-outline.svg';
import downloadPdf from '/public/cloud-download-outline.svg';
import FetchUtils from '../../utils/FetchUtils';
import PopupUtils from '../../shared/PopupUtils';
import Popup from '../../shared/Popup';
interface FileItem {
  uniqueFileName: string;
  fileName:string;
  createdOn: Date; 
}
interface SideBarProps {
  setXmlFoToEditor: (result: string) => void;
  getFoXml: () => string;
}
interface SideBarState {
    files: FileItem[];
    isSaveAsPopupVisible: boolean;
    activeFileId: string
}

class SideBarMenu extends React.Component<SideBarProps, SideBarState> {
    constructor(props: SideBarProps) {
        super(props);

        this.state = {
            files: [],
            isSaveAsPopupVisible: false,
            activeFileId: ''
        };
        this.loadFilesList = this.loadFilesList.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileItemClick = this.handleFileItemClick.bind(this);
    }
    componentDidMount() {
      this.loadFilesList();
    }
    loadFilesList() {
      FetchUtils.makeApiCall("api/file", {} ,"GET").
        then((data: any) => {
            this.setState( { files: (data as FileItem[]) } );
      });
      
    }
    async handleSubmit(xmlFile: File | null, xslFile: File | null) {

        if (!xmlFile || !xslFile) {
            PopupUtils.alert('Please select both XML and XSL files.');
            return;
        }
        this.setState({ activeFileId: "" })
        try {
            const xml = await xmlFile.text();
            const xsl = await xslFile.text();
            const xmlDoc = new DOMParser().parseFromString(xml, 'application/xml');
            const xslDoc = new DOMParser().parseFromString(xsl, 'application/xml');

            const processor = new XSLTProcessor();
            processor.importStylesheet(xslDoc);

            const resultDoc = processor.transformToDocument(xmlDoc);
            const resultText = new XMLSerializer().serializeToString(resultDoc);

            this.props.setXmlFoToEditor(resultText);
        } catch (error: any) {
            PopupUtils.alert(`Error processing the files: ${error.message}`);
        }
    }

    async handleFileItemClick(fileId: string) {
      FetchUtils.makeApiCall(`api/file/${fileId}`, {} ,"GET").
        then((data: any) => {
          this.props.setXmlFoToEditor(data.fileContent);    
      });
      this.setState({activeFileId: fileId})
    }
    saveAs() {
      const callBack = (data: any) => {
        FetchUtils.makeApiCall("api/file", {
          fileName: data.FileName,
          xmlData: this.props.getFoXml()
        }, "POST", "BASIC").then((data) => {
          this.loadFilesList();
        });
      }
      this.openFormFileName(callBack);
    }
    openFormFileName(callback: (data: any) => void) {
      const popup = new Popup( "Input new file name", 'Dialog', 'dialog',
        [ { text: 'OK', callback: (data) => callback(data), submit: true },
          { text: 'Cancle', callback: () => 0 }],
        [ { inputLabel: "File Name", inputType: "text", dataLabel: "FileName" } ]
      );
      popup.show();
    }
    save() {
      const fileId = this.state.activeFileId;
      if (!fileId) {
        this.saveAs.bind(this)();
        return;
      }
      const file = this.state.files.find(x => x.uniqueFileName == fileId);
      if (!file) {
        return;
      }
      FetchUtils.makeApiCall("api/file/" + this.state.activeFileId, {
        fileName: file?.fileName,
        xmlData: this.props.getFoXml()
      }, "PUT", "BASIC").then((data) => {
        this.loadFilesList();
      });
    }
    delete() {
      const fileId = this.state.activeFileId;
      if (!fileId) {
        PopupUtils.alert("Need to choose file to delete");
        return;
      }
      const file = this.state.files.find(x => x.uniqueFileName == fileId);
      if (!file) {
        return;
      }
      FetchUtils.makeApiCall("api/file/" + this.state.activeFileId, {}, "DELETE", "BASIC").
      then((data) => {
        this.loadFilesList();
      });
    }
    download() {
      FetchUtils.makeApiCall("api/Convertor", { xmlData: this.props.getFoXml().trim() }, "POST", "BLOB").
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
    render() {
        const { files } = this.state;
        return (
            <div className='sidebar'>
                <div className='saved-files-container'>
                  <div className='file-list'>
                    <h4>Your saved files</h4>
                    <div className='list'>
                          { files &&
                            files.map((file) => (
                              <li 
                                className={file.uniqueFileName === this.state.activeFileId ? "active":""} 
                                key={file.uniqueFileName} 
                                onClick={() => this.handleFileItemClick(file.uniqueFileName)}>
                                  {file.fileName}
                              </li>
                            ))
                          }
                    </div>
                  </div>
                  <div className='file-list-tool-bar'>
                    <button className='default-button' title='Save' onClick={this.save.bind(this)} >
                      <img src={saveUrl}></img>
                    </button>
                    <button className='default-button' title='Save as' onClick={this.saveAs.bind(this)} >
                      <img src={saveAsUrl}></img>
                    </button>
                    <button className='default-button' title='Delete'  onClick={this.delete.bind(this)} >
                      <img src={deleteUrl}></img>
                    </button>
                    <button className='default-button' title='Download'onClick={this.download.bind(this)} >
                      <img src={downloadPdf}></img>
                    </button>
                  </div>
                </div>
                <div>
                  <XmlToFoForm handleSubmit={this.handleSubmit}></XmlToFoForm>
                </div>
            </div>
        );
    }
}

export default SideBarMenu;