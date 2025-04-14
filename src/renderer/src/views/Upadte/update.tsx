import { useNotesHooks } from "@renderer/hooks/useNotes";
import { useEffect, useState } from "react"
import { Essay } from "~/config/enmu"
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';
import { ArticleList } from "./article";
import { useNavigate } from "react-router";

export default function UpdateComponent() {
    const notes = useNotesHooks();
    const [isReq, udpReq] = useState(false);
    const [list, udpList] = useState([])
    const navigate = useNavigate();
    const queryArticels = () => {
        udpReq(true)

        isReq != true && window.db.pageQuery(Essay.contentKey)
            .then(res => {
                console.log('all articel', res)
                Array.isArray(res) && udpList([...res])
            }).finally(() => {
                udpReq(false)
            })
    }

    const goDetail = (id: string) => {
        console.log('click id', id)
        // navigate(`/manege?id=${id}`, { state: { id } })
        // history.pushState(id,'/manege')
        location.replace(`/#/manege?id=${id}`)
        // location.hash = `/manege?id=${id}`
    }

    useEffect(() => {
        queryArticels();
    }, [])
    return (
        <div className="update-page">
            <p>文章列表</p>
            <ArticleList list={list.map(t => {
                t.icon = notes['typeIcons'][t.type]
                t.pubTime = new Date(t.create_time).toLocaleString();
                // console.log(t.icon, notes['typeIcons'], t.type)
                return t;
            })} replaceKey={{
                'type': notes.types.reduce((t, tem) => { t[tem.id] = tem.type; return t }, {}),
            }} click={goDetail}></ArticleList>
 

        </div>
    )
}