import { useEffect, useState, ReactNode } from "react";
import { MdEditor, MdPreview } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { Modal, Button, Form, Input, Select } from 'antd';
import { useForm } from "antd/es/form/Form";

interface EassyItem {
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

    // const [eassyForm, udpEassyForm] = useState({
    //     id: "",
    //     content: data,
    //     type: "css",
    //     title: ""
    // })

    const udpKey = (value: string) => {
        setData({ ...data, text: value })
        localStorage.setItem('txt', value);
    }

    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const hideModal = () => {
        setVisible(false);
    };


    const handleCancel = () => {
        // 处理取消逻辑
        console.log('退出取消');
        hideModal();
    };

    const onConfirm = () => {
        // window.db.add('', {});
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
        window.db.add(eassy.type, eassy).then(() => {
            localStorage.removeItem('txt');
        }).catch(e => {
            console.log(e)
        });
        console.log(eassy)

    }

    useEffect(() => {


    }, []);

    return (
        <div className="charts">
            <p>
                <Button type="dashed" onClick={showModal}>edit</Button>
                <Button type="primary" onClick={onConfirm}>add</Button>
            </p>
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
                        <Select options={[
                            { value: 'react', label: <span>react</span> },
                            { value: 'vue', label: <span>vue</span> },
                            { value: 'angular', label: <span>angular</span> },
                            { value: 'test', label: <span>test</span> },
                        ]} size="middle" allowClear showSearch />
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    )
}

export default Charts;
