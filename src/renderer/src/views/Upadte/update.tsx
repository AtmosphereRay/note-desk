import { useNotesHooks } from "@renderer/hooks/useNotes";
import { useEffect, useState } from "react"
import { Essay } from "~/config/enmu"
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';

export default function UpdateComponent() {
    const notes = useNotesHooks();
    const [isReq, udpReq] = useState(false);
    const [list, udpList] = useState([])
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

    //     const text = `
    //   A dog is a type of domesticated animal.
    //   Known for its loyalty and faithfulness,
    //   it can be found as a welcome guest in many households across the world.
    // `;

    //     const items: CollapseProps['items'] = [
    //         {
    //             key: '1',
    //             label: 'This is panel header 1',
    //             children: <p>{text}</p>,
    //         },
    //         {
    //             key: '2',
    //             label: 'This is panel header 2',
    //             children: <p>{text}</p>,
    //         },
    //         {
    //             key: '3',
    //             label: 'This is panel header 3',
    //             children: <p>{text}</p>,
    //         },
    //     ];

    useEffect(() => {
        queryArticels();
    }, [])
    return (
        <div className="update-page">
            <p>文章列表</p>
            <Collapse items={list.map((item, idx) => {
                return {
                    key: item.idx,
                    label: item.title,
                    children: <p>{item.content}</p>
                }
            })} accordion defaultActiveKey={['1']} />
            <p>分页列表</p>

        </div>
    )
}