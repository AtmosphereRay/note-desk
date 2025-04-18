import { ReloadOutlined } from "@ant-design/icons"
import {useIconStyle} from "./iconStyleConfig";
import './iconStyle.less'

import { Tooltip } from "antd";

import { useAliveController } from "react-activation";
import { useLocationHooks } from "@renderer/hooks/useLoaction";



function ReloadIcon () {
    const tip_text = <span>刷新当前页面</span>
    const style = useIconStyle()

    const { refresh } = useAliveController();
    const { currentName } = useLocationHooks()

    function handleClick(){
        refresh(currentName as string)
    }
    
    return (
        <Tooltip placement="bottom" title={tip_text}>
            <div className="icon-wrapper">
                <div className="header-icon-hover" onClick={handleClick}>
                    <ReloadOutlined style={style} />
                </div>
            </div>
        </Tooltip>
        
    )
};
 
export default ReloadIcon;