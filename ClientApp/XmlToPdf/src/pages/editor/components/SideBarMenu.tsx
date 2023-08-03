import '../styles/sidebar.css';
import { List, Spin, theme } from 'antd';
import { FileService } from '@/services';
import { useDispatch } from 'react-redux';
import { setXmlFo } from '@/reduxConfig/xmlSlice';
import { useState } from 'react';
interface FileItem {
  uniqueFileName: string;
  fileName:string;
  createdOn: Date; 
}
interface SideBarMenuProps {
  activeFileId: string
  setActiveFileId: (value: string) => void,
  files: FileItem[]
}
const { useToken } = theme;
const SideBarMenu = ({ activeFileId, setActiveFileId, files } : SideBarMenuProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  
  const handleFileItemClick = async (fileId: string) => {
    setLoading(true);
    var data = await FileService.GetFile(fileId);
    dispatch(setXmlFo(data.fileContent));    
    setActiveFileId(fileId);
    setLoading(false);
  };
  const { token } = useToken();
  return (
    <div className='sidebar' style={{ backgroundColor: token.colorPrimaryBgHover }}>
        <div className='saved-files-container'>
        <Spin spinning={loading}>
          <List
            size="small"
            header = { <h5 style={{margin: 5}}> Files: </h5> }
            footer=""
            bordered
            dataSource={files}
            renderItem = {
              (file: FileItem) => 
              <List.Item 
                style={{ backgroundColor: file.uniqueFileName === activeFileId ? token.colorBgTextHover : token.colorPrimaryBgHover }}
                onClick={() => handleFileItemClick(file.uniqueFileName)}>{file.fileName}</List.Item>
            }
            pagination={{ position: "bottom", align: "center", size: 'small', pageSize: 10 }}
          />
        </Spin>
        </div>
    </div>
  );
};

export default SideBarMenu;