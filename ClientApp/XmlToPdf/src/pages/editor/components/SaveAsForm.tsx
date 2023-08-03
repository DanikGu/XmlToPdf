import React, { FC } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import { FormInstance } from 'antd/lib/form';

interface SaveAsFormProps {
  onOk: (value: string) => void;
  visible: boolean;
  handleCancel: () => void;
}

const SaveAsFormModal: FC<SaveAsFormProps> = ({ onOk, visible, handleCancel }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        onOk(values.name);
      })
      .catch(info => {
        console.log('Validation Failed:', info);
      });
  };

  return (
    <Modal
      title="Save File as"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      afterClose={() => form.resetFields()}
    >
      <Form
        form={form}
        name="save_as_form"
        initialValues={{ remember: true }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default SaveAsFormModal;