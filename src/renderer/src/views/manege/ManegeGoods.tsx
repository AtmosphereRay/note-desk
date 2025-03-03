import { useEffect, useState, ReactNode } from "react";
import { MdEditor, MdPreview } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
 

function Charts() {

    const [data, setData] = useState({
        text: "# 主题1 \n ## 主题2 \n# 主题1 \n ## 主题2 \n# 主题1 \n ## 主题2 \n# 主题1 \n ## 主题2 \n# 主题1 \n ## 主题2 \n# 主题1 \n ## 主题2 \n# 主题1 \n ## 主题2 \n# 主题1 \n ## 主题2 \n",
        theme: 'dark'
    });

    const udpKey = (value: string) => {
        setData({
            ...data,
            text: value
        })
    }

    useEffect(() => {


    }, []);

    return (
        <div className="charts">
            <p>  编辑页</p>
 
            <MdPreview id={'my-editor'} value={data.text} />
        </div>
    )
}

export default Charts;
