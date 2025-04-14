import { useEffect, useState, ReactNode } from "react";
import { MdEditor, MdPreview } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { useLocation } from "react-router";
import { Essay } from "~/config/enmu";


function Charts() {

    const [data, setData] = useState({ text: '', theme: 'dark' });
    const [state, setState] = useState(null)

    const search = new URLSearchParams(location.hash.slice(location.hash.indexOf('?')))

    console.log('测试', search.get('id'))


    const udpKey = (value: string) => {
        setData({ ...data, text: value })
    }

    useEffect(() => {
        if (search.get('id')) {
            setState(search.get('id') || null);
            console.log('artcy', search.get('id'))
            window.db.get(Essay.contentKey, search.get('id')).then((res: any) => {
                console.log('输出', res.title, res.id, '传入', search.get('id'))
                setData({ ...data, text: res.content ?? '' })

            })
        }

        console.log('??ASD?ASDS', '出发了')
        return () => {
            setState(null); // 清空状态
            console.log('听哈是大苏打', 'tuichu')
        }

    }, [search.get('id')]);

    return (
        <div className="charts">
            <p style={{ margin: 0 }}>query页</p>
            <MdPreview id={'my-editor-preview'} value={data.text} showCodeRowNumber codeFoldable={false} style={{ height: "calc(100vh - 10px)" }} />
        </div>
    )
}

export default Charts;
