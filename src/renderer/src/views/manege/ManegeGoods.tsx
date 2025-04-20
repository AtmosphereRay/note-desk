import { useEffect, useState, ReactNode } from "react";
import { MdEditor, MdPreview } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { useLocation } from "react-router";
import { Demo, Essay } from "~/config/enmu";
import { Button } from "antd";


function Charts() {

    const [data, setData] = useState({ text: '', theme: 'dark' });
    const [state, setState] = useState(null)

    const search = new URLSearchParams(location.hash.slice(location.hash.indexOf('?')));
    const [preview, udppreview] = useState(true);
    const [oldTxt, udpTxt] = useState('');
    const [title, udpTxt1] = useState('');


    // console.log('测试', search.get('id'))


    const udpKey = (value: string) => {
        setData({ ...data, text: value })
    }

    useEffect(() => {
        if (search.get('id')) {
            setState(search.get('id') || null);
            udppreview(true);
            console.log('artcy', search.get('id'))
            window.db.get(Essay.contentKey, search.get('id')).then((res: any) => {
                console.log('输出', res?.title, res?.id, '传入', search.get('id'));
                if (res?.title) {
                    udpTxt(res.content ?? '');
                    udpTxt1(res?.title ?? '');
                    setData({ ...data, text: res.content ?? '' })
                }

            })
        }

        console.log('初始化触发了', Object.fromEntries(search))
        return () => {
            setState(null); // 清空状态
            console.log('听哈是大苏打', 'tuichu')
        }

    }, [search.get('id')]);

    const save = () => {

        if (window.navigator.onLine && search.get('_id') && data.text != oldTxt) {

            window.App.pubEvent(Demo.MongoEvent, {
                e: "put",
                data: {
                    name: Essay.contentKey,
                    data: {
                        id: search.get('id'),
                        content: data.text
                    }
                }
            })
        }
        if (data.text != oldTxt && search.get('id')) {
            console.log('修改了', search.get('id'), window.navigator.onLine);


            window.db.update(Essay.contentKey, search.get('id'), { content: data.text })
                .then(res => { console.log('更新结果', res) })
                .catch(e => { console.log(e.message, e, '更新失败') })
                .finally(() => { udppreview(true); })
        } else {
            console.log('未修改')
            udppreview(true);

        }
    }

    return (
        <div className="charts">
            <p style={{ margin: '0 0px', display: "flex", justifyContent: "space-between" }} >
                <div className="handle">
                    <Button type='dashed' style={{ margin: '0 20px 0 0 ' }} onClick={() => udppreview(false)}>编辑</Button>
                    <Button type="primary" onClick={save}>保存</Button>
                </div>
                <div className="title">
                    当前标题: {title}
                </div>
            </p>
            {
                preview ? <MdPreview id={'my-editor-preview'} value={data.text} showCodeRowNumber codeFoldable={false} style={{ height: "calc(100vh - 180px)" }} />
                    : <MdEditor value={data.text} onChange={udpKey} theme={
                        window?.matchMedia('(prefers-color-scheme: dark)')?.matches ? "dark" : "light"
                    } style={{ height: "calc(100vh - 180px)" }} showCodeRowNumber codeFoldable={false} />
            }
        </div>
    )
}

export default Charts;
