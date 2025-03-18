import { useNotesHooks } from "@renderer/hooks/useNotes";
import { useEffect, useState } from "react"
import { Essay } from "~/config/enmu"


export default function UpdateComponent() {
    const notes = useNotesHooks();
    const [isReq, udpReq] = useState(false);
    const queryArticels = () => {
        udpReq(true)

        isReq != true && window.db.pageQuery(Essay.contentKey)
            .then(res => {
                console.log('all articel', res)
            }).finally(() => {
                udpReq(false)
            })
    }
    useEffect(() => {
        queryArticels();
    },[])
    return (
        <div className="update-page">
            更新界面

        </div>
    )
}