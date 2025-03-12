import { useEffect, useState, ReactNode } from "react";
import { MdEditor, MdPreview } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { Modal, Button, Form, Input, Select, Row, Col, message } from 'antd';
import { useForm } from "antd/es/form/Form";
import { Essay } from "~/config/enmu"
import AddTypeModal from "./addType";

import { type RootState, } from "@renderer/store";
import { useSelector } from "react-redux";
import { initialTypes } from "@renderer/store/note"
import { useDispatch } from 'react-redux';
import type { AppDispatch, } from '@renderer/store';
import { useNotesHooks } from "@renderer/hooks/useNotes";
import { downloadTextFile } from "@renderer/util/file";
interface EssayItem {
    id: string
    content: string
    title: string
    type: string
}



function Charts() {
    const [data, setData] = useState({
        text: localStorage.getItem('txt') ?? '',
        theme: 'dark'
    });
    const [form] = useForm()
    const notes = useNotesHooks();

    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);

    const udpKey = (value: string) => {
        setData({ ...data, text: value })
        localStorage.setItem('txt', value);
    }




    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const handleCancel = () => hideModal();

    const initTypes = () => {
        setVisible2(false);
        notes.init();
    }


    const onConfirm = () => {
        const eassy = {
            ...form.getFieldsValue(),
            id: crypto.randomUUID(),
            content: data.text,
            create_time: Date.now(),
            update_time: null,
        }

        if (!eassy.type || !eassy.title) {
            alert('not full~')
            return;
        }
        window.db.add(Essay.contentKey, eassy).then(() => {
            localStorage.removeItem('txt');
            message.success('Add article successfully!')
        }).catch(e => {
            console.log(e)
        });
    }

    const onConfirm2 = () => setVisible2(true)

    const exportTypes = () => {
        console.log(notes.types);
        // new 
        downloadTextFile('type.conf', JSON.stringify(notes.types))
    }

    return (
        <div className="charts">
            <Row gutter={16}>
                <Col> <Button type="dashed" onClick={showModal}>edit</Button>  </Col>
                <Col> <Button type="primary" onClick={onConfirm}>add</Button></Col>
                <Col> <Button type="default" onClick={onConfirm2}>add</Button></Col>
                <Col> <Button type="default" onClick={exportTypes}>export</Button></Col>
            </Row>
            <MdEditor value={data.text} onChange={udpKey} theme={
                window?.matchMedia('(prefers-color-scheme: dark)')?.matches ? "dark" : "light"
            } style={{ height: "calc(100vh - 180px)" }} />
            <Modal
                title="Edit Type"
                open={visible}
                onOk={onConfirm}
                onCancel={handleCancel}
                centered
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" onClick={hideModal}>
                        确定
                    </Button>,
                ]}
            >
                <Form form={form} className="w-[360px]" name="normal_login" size="large" initialValues={{ title: "", type: "" }}>
                    <Form.Item className="item" name="title" label="title">
                        <Input allowClear size="middle" />
                    </Form.Item>
                    <Form.Item className="item" name="type" label="type">
                        <Select options={
                            notes.types.map(t => {
                                return { value: t.id?.toString(), label: <span>{t.type}</span> }
                            })

                        } size="middle" allowClear showSearch />
                    </Form.Item>
                </Form>
            </Modal>
            <AddTypeModal
                visible={visible2}
                onCreate={initTypes}
                onCancel={() => setVisible2(false)}
            />
        </div >
    )
}

export default Charts;
