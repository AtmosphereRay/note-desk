import { useEffect, useState, ReactNode } from "react";
import { MdEditor, MdPreview } from 'md-editor-rt';
import { useParams } from 'react-router-dom';
import 'md-editor-rt/lib/style.css';
import { Modal, Button, Form, Input, Select, Row, Col, message } from 'antd';
import { useForm } from "antd/es/form/Form";
import { Demo, Essay, HttpCode } from "~/config/enmu"
import AddTypeModal from "./addType";
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
    const [typeID, setTypeID] = useState(null);

    const udpKey = (value: string) => {
        setData({ ...data, text: value })
        localStorage.setItem('txt', value);
    }

    const showModal = () => {
        form.setFieldValue('id', '')
        setVisible(true);
    }
    const showModal2 = () => {
        form.setFieldValue('id', '')
        setVisible(true);
    }
    const hideModal = () => {
        setVisible(false);
        typeID && console.log(typeID, 'is exist!')

    }
    const handleCancel = () => hideModal();




    const initTypes = (values) => {
        setVisible2(false);
        values.id = notes.types.length + 1;
        // console.log(values, '添加的内容是', notes.types.length)
        window.App.pubEvent(Demo.MongoEvent, {
            e: "add",
            data: {
                name: Essay.typeKey,
                data: values
            }
        })
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
            alert('articel not full~')
            return;
        }
        if (typeID) {

        } else {

            window.db.add(Essay.contentKey, eassy).then(() => {
                localStorage.removeItem('txt');
                message.success('Add article successfully!')
            }).catch(e => {
                console.log(e)
            });
            window.App.pubEvent(Demo.MongoEvent, {
                e: 'add',
                data: {
                    name: Essay.contentKey,
                    data: eassy
                }
            })
        }

    }

    const onConfirm2 = () => setVisible2(true)

    const exportTypes = () => {
        console.log(notes.types);
        downloadTextFile('type.conf', JSON.stringify(notes.types))
    }

    const pullRemote = () => {
        window.App.pubEvent(Demo.MongoEvent, { e: Essay.pullTypeReq })
    }

    const pushRemoteArticle = () => {
        window.db.pageQuery(Essay.contentKey)
            .then(res => {
                console.log(res);
                Array.isArray(res) && res.forEach(item => {
                    window.App.pubEvent(Demo.MongoEvent, {
                        e: 'add', data: {
                            name: Essay.contentKey,
                            data: item
                        }
                    })
                })
            }).catch(e => {
                console.log(e);
            })
    }

    const pullArticle = () => {
        window.App.pubEvent(Demo.MongoEvent, { e: Essay.pullArticleReq })
    }

    const udpTypeConfig = () => {

    }

    useEffect(() => {
        const hashURl = window.location.hash.substring(1)
        const hashParams = new URLSearchParams(hashURl.slice(hashURl.indexOf('?'))); // 去掉 '#'

        if (hashParams.has('id')) {
            form.setFieldValue('type', hashParams.get('id'))
            form.setFieldValue('icon', hashParams.get('icon'))
            setTypeID({
                id: hashParams.get('id'),
                icon: hashParams.get('icon')
            })
            // setTypeID(hashParams.get('id'))
            console.log('edit page', form, 'hHhH', Object.fromEntries(hashParams), 'exist hahaha ');
        } else {
            setTypeID('');
        }

        if (!sessionStorage.getItem('t')) {
            window.App.addEventListener(Essay.pullTypeRes, (msg) => {
                const response = JSON.parse(msg)
                console.log('test msg for event', response)
                if (response.code === HttpCode.Success) {
                    Array.isArray(response.data) && Promise.all(response.data.map(async item => {
                        let exist = await window.db.get(Essay.typeKey, item.id)
                        return !!exist ? window.db.update(Essay.typeKey, item.id, item) : window.db.add(Essay.typeKey, item);
                    })).then(res => {
                        notes.init();
                        console.log(res,)
                        message.success('pull finished!');
                    }).catch(e => {
                        console.log('pull failed reason:', e.message || e)
                        message.error(`pull failed reason:${e?.target?.error || e}`);
                    })

                } else {
                    console.warn('同步失败', response.desc);
                }
            })
            sessionStorage.setItem('t', 't')
        }


        return () => {

        }
    }, [location.hash])

    return (
        <div className="charts">
            <Row gutter={16}>
                <Col> <Button type="default" onClick={showModal}>添加文章</Button>  </Col>
                <Col> <Button type="dashed" onClick={exportTypes}>导出配置</Button></Col>
                <Col> <Button type="primary" onClick={onConfirm}>保存</Button></Col>
                <Col> <Button type="default" onClick={pullArticle}>同步文章</Button></Col>
                <Col> <Button type="dashed" onClick={pushRemoteArticle}>推送文章</Button></Col>
                <Col> <Button type="default" onClick={onConfirm2}>添加类型</Button></Col>
                <Col> <Button type="dashed" onClick={showModal2} style={{ display: typeID ? 'block' : 'none', background: "#86c145" }}>更新类型</Button></Col>
                <Col> <Button type="primary" onClick={pullRemote}>同步类型</Button></Col>
            </Row>
            <MdEditor value={data.text} onChange={udpKey} theme={
                window?.matchMedia('(prefers-color-scheme: dark)')?.matches ? "dark" : "light"
            } style={{ height: "calc(100vh - 180px)" }} showCodeRowNumber codeFoldable={false} />
            <Modal
                title="设置类型"
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
                    {/* {
                        <Form.Item className="item" name="icon" label="图标">
                            <Input allowClear size="middle" />
                        </Form.Item>
                    } */}
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
                existType={ typeID}
            />
        </div >
    )
}

export default Charts;
