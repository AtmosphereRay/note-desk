import { useEffect, useState, ReactNode } from "react";
import { MdEditor, MdPreview } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';


function Charts() {

    const [data, setData] = useState({
        text: localStorage.getItem('txt') ?? '',
        theme: 'dark'
    });

    const udpKey = (value: string) => {
        setData({
            ...data,
            text: value
        })
    }

    useEffect(() => {
        setData({
            ...data,
            text: localStorage.getItem('txt') ?? ''
        })
        return () => {

        }
    }, []);

    return (
        <div className="charts">
            <p>query页</p>
            <MdPreview id={'my-editor-preview'} value={data.text} />
        </div>
    )
}

export default Charts;
