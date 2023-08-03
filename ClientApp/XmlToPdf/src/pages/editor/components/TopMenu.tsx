import React, {createContext, useState} from 'react';
import { Button, Modal, Spin } from 'antd';
import { CodeOutlined, DeleteOutlined, ExportOutlined, FilePdfOutlined, LoginOutlined, SaveFilled, SaveOutlined } from '@ant-design/icons';
import { PopupUtils, Utils, useToken } from '@/utils';
import { FileService } from '@/services';
import ConvertService from '@/services/ConvertService';
import { useDispatch, useSelector } from 'react-redux';
import { selectXmlFo } from '@/reduxConfig/xmlSlice';
import { Popup } from '@/shared';
import XmlToFoFormModal from './XmlToFoFormModal';
import SaveAsFormModal from './SaveAsForm';
type TopMenuProps = {
    files: FileItem[],
    activeFileId: string
    loadFilesList: () => void,
    openCodeEditor: () => void
}
interface FileItem {
  uniqueFileName: string;
  fileName:string;
  createdOn: Date;

}
const TopMenu = ({files, activeFileId, loadFilesList, openCodeEditor }: TopMenuProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaveAsModalOpen, setIsSaveAsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const xmlFo = useSelector(selectXmlFo)
  const [loading, setLoading] = useState(false);
  const {token, setToken} = useToken();

  const saveAs = async (fileName: string) => {
    await FileService.PostFile(fileName as string, xmlFo);
    loadFilesList();
    setIsSaveAsModalOpen(false);
  };
 
  const save = async () => {
    const fileId = activeFileId;
    if (!fileId) {
      setIsSaveAsModalOpen(true);
      return;
    }
    const file = files.find(x => x.uniqueFileName == fileId);
    if (!file) {
      return;
    }
    await FileService.PutFile(activeFileId, file?.fileName, xmlFo);
    loadFilesList();
  };

  const deleteFile = async () => {

    const fileId = activeFileId;
    if (!fileId) {
      const error = () => {
        Modal.error({
          title: 'Error while delete',
          content: 'Need to choose file before delete',
        });
      };
      error();
      return;
    }
    const file = files.find(x => x.uniqueFileName == fileId);
    if (!file) {
      return;
    }
    await FileService.DeleteFile(activeFileId);
    await loadFilesList();
  };

  const download = async () => {
    setLoading(true);
    let blob = await ConvertService.ConvertToPdf(xmlFo);
    Utils.DownloadFile(blob, "template.pdf")
    setLoading(false);
  };
  const logout = () => {
    window.location.reload();
    setToken({ token: "", expiration: new Date() });
  }
  return (
    <div className='top-menu'>
      <Button type='primary' icon={<SaveOutlined rev={undefined} />} title="Save" onClick={save}>
        Save
      </Button>
      <Button type='primary' icon={<SaveFilled rev={undefined} />} title="Save as" onClick={() => setIsSaveAsModalOpen(true)}>
        Save as
      </Button>
      <Button type='primary' icon={<DeleteOutlined rev={undefined} />} title="Delete" onClick={deleteFile}>
        Delete
      </Button>
      <Button type='primary' icon={<ExportOutlined rev={undefined} />} title="Convert" onClick={() => setIsModalOpen(true)}>
        Convert XML
      </Button>
      <Spin spinning={loading}>
      <Button type='primary' icon={<FilePdfOutlined rev={undefined} />} title="Download" onClick={download}>
        Download PDF
      </Button>
      </Spin>
      <Button type='primary' icon={<CodeOutlined rev={undefined} />} title="Open code editor" onClick={openCodeEditor}>
        Open code editor
      </Button>
      <Button type='primary' style={{marginLeft: "auto"}} icon={<LoginOutlined  rev={undefined} />} title="Log out" onClick={logout}>
        Log out
      </Button>
      <XmlToFoFormModal onCancel={() => setIsModalOpen(false)} setIsModalOpen={() => setIsModalOpen(false)} isModalOpen = {isModalOpen}></XmlToFoFormModal>
      <SaveAsFormModal onOk={saveAs} visible={isSaveAsModalOpen} handleCancel={() => setIsSaveAsModalOpen(false)}></SaveAsFormModal>
    </div>
  );
};

export default TopMenu;