import { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { Essay, } from "~/config/enmu"
import { DBEventTarget } from '@renderer/util/dbStorage';


const AddTypeModal = ({ visible, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    const handleSubmit = () => {
        form.validateFields()
            .then(values => {
                window.db.add(Essay.typeKey, values)
                    .then(() => {
                        message.success('add successfully!')
                        onCreate(values);
                        form.resetFields();
                    })
                    .catch((error: DBEventTarget) => {
                        message.error(error.target.error.message)
                    });
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };


    return (
        <Modal
            title="添加类型"
            open={visible}
            onOk={handleSubmit}
            onCancel={onCancel}
        >
            <Form form={form} layout="vertical" name="add_type_form">
                {/* <Form.Item
                    label="ID"
                    name="id"
                    rules={[{ required: true, message: '请输入 ID' }]}
                >
                    <Input />
                </Form.Item> */}
                  <Form.Item
                    label="图标"
                    name="icon"
                    rules={[{ required: true, message: '请输入图标地址' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="类型"
                    name="type"
                    rules={[{ required: true, message: '请输入类型' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddTypeModal;
