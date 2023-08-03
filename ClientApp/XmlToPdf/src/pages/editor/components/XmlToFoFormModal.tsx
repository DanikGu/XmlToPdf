import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setXml, setXsl, setXmlFo} from '@/reduxConfig/xmlSlice';
import { Utils } from '@/utils';
import { Button, Form, Modal } from 'antd'
const XmlToFoFormModal = ({isModalOpen, setIsModalOpen, onCancel}: any) => {
    const [xmlFile, setXmlFile] = useState<File | null >(null);
    const [xslFile, setXslFile] = useState<File | null >(null);
    const dispatch = useDispatch();
    const handleSubmit = async () => {
      let xml = await xmlFile?.text();
      let xsl = await xslFile?.text();
      let xmlFo = Utils.applyXslToXml(xml ?? "", xsl ?? "");
      dispatch(setXml(xml));
      dispatch(setXsl(xsl));
      dispatch(setXmlFo(xmlFo));
      setIsModalOpen(false);
      setXmlFile(null);
      setXslFile(null);
    }
    return (
      <Modal footer="" title="Convert XML"  open={isModalOpen} onCancel={onCancel}>
        <Form>
          <Form.Item label="XML:">
            <Button onClick={() => document.getElementById("xmlFile")?.click()}>
              {xmlFile?.name ?? "Select"}
            </Button>
            <input
              style={{ display: "none" }}
              type="file"
              className='default-input'
              id="xmlFile"
              name="xmlFile"
              accept=".xml"
              onChange={(e) =>
                setXmlFile(e.target.files ? e.target.files[0] : null)
              }
            />
          </Form.Item>
          <Form.Item label="XSL:">
            <Button onClick={() => document.getElementById("xslFile")?.click()}>
              {xslFile?.name ?? "Select"}
            </Button>
            <input
              style={{ display: "none" }}
              type="file"
              id="xslFile"
              name="xslFile"
              accept=".xsl,.xslt"
              onChange={(e) =>
                setXslFile(e.target.files ? e.target.files[0] : null)
              }
            />
          </Form.Item>
          <Form.Item>
            <Button  type="dashed" htmlType="submit" onClick={handleSubmit}> Transform </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
}

export default XmlToFoFormModal;