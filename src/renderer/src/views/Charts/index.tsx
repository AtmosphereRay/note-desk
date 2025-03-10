import { useEffect, useState, ReactNode } from "react";
import { MdEditor, MdPreview } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { Modal, Button, Form, Input, Select, Row, Col } from 'antd';
import { useForm } from "antd/es/form/Form";
import { Eassy } from "~/config/enmu"
import AddTypeModal from "./addType";

interface EassyItem {
    id: string
    content: string
    title: string
    type: string
}

type EassyTypes = { id: string, type: string }[]

function Charts() {
    const [data, setData] = useState({
        text: localStorage.getItem('txt') ?? '',
        theme: 'dark'
    });
    const [form] = useForm()

    const [types, udpTypes] = useState([] as EassyTypes);


    const udpKey = (value: string) => {
        setData({ ...data, text: value })
        localStorage.setItem('txt', value);
    }

    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);


    const showModal = () => {
        setVisible(true);
    };

    const hideModal = () => {
        setVisible(false);
    };


    const handleCancel = () => hideModal();

    const initTypes = () => {
        setVisible2(false);
        window.db.pageQuery(Eassy.typeKey)
            .then((res: EassyTypes) => {
                console.log(res, 'all version!')
                udpTypes([...res])
            })
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
        window.db.add(Eassy.contentKey, eassy).then(() => {
            localStorage.removeItem('txt');
        }).catch(e => {
            console.log(e)
        });
        console.log(eassy)

    }

    const onConfirm2 = () => setVisible2(true)

    useEffect(() => {
        initTypes();
    }, []);

    return (
        <div className="charts">
            <Row gutter={16}>
                <Col> <Button type="dashed" onClick={showModal}>edit</Button>  </Col>
                <Col> <Button type="primary" onClick={onConfirm}>add</Button></Col>
                <Col> <Button type="primary" onClick={onConfirm2}>add</Button></Col>

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
                <Form form={form} className="w-[360px]" name="normal_login" size="large" initialValues={{ title: "tutorial chapter1 ", type: "react" }}>
                    <Form.Item className="item" name="title" label="title">
                        <Input allowClear size="middle" />
                    </Form.Item>
                    <Form.Item className="item" name="type" label="type">
                        <Select options={
                            types.map(t => {
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
