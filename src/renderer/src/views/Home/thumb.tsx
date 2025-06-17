import './ThumbnailList.css'; // 引入样式文件
import { useState } from 'react';
import { Modal } from 'antd';
import { useNotesHooks } from '@renderer/hooks/useNotes';
import { Demo, Essay } from "~/config/enmu";

const ThumbnailList = ({ thumbnails }) => {
    // 定义状态变量，用于控制对话框是否显示
    const [isModalVisible, setIsModalVisible] = useState(false);

    const notes = useNotesHooks();

    // 打开对话框的函数
    const showModal = () => {
        location.hash = "charts"
    };

    // 关闭对话框的函数
    const handleOk = () => {
        setIsModalVisible(false);
    };

    // 取消按钮的处理函数
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const readConfig = (ev) => {
        console.log(ev, 'read config')
        ev.preventDefault();
        if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (var i = 0; i < ev.dataTransfer.items.length; i++) {
                // If dropped items aren't files, reject them
                if (ev.dataTransfer.items[i].kind === 'file') {
                    var file = ev.dataTransfer.items[i].getAsFile();
                    console.log('single ==>: ... file[' + i + '].name = ' + file.name, file);
                    const reader = new FileReader();
                    reader.onerror = (e) => {
                        console.log(e, 'read failed!')
                    }
                    reader.onload = (e) => {
                        console.log(e.target.result, '读取完成')
                        // readCtx.innerText = e.target.result;
                        const types: EssayTypes[] = JSON.parse(e.target.result as string);

                        window.App.pubEvent(Demo.MongoEvent, {
                            e: "add", data: {
                                name: Essay.typeKey,
                                data: types
                            }
                        })

                        Promise.all(types.map(item => window.db.add(Essay.typeKey, item)))
                            .then(() => {
                                // window.db.pageQuery(Essay.typeKey).then()
                                notes.init();
                                console.log('read finished!', types)
                            }).catch(e => {
                                console.log('read file failed:', e)
                            })

                    }

                    reader.readAsText(file);
                }
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            for (var i = 0; i < ev.dataTransfer.files.length; i++) {
                console.log('multi==> : ... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
            }
        }

        // Pass event to removeDragData for cleanup
        // removeDragData(ev)
        ev.dataTransfer.items && ev.dataTransfer.items.clear();
    }

    const toNoteTypePage = (option) => {
        if (option) {
            // console.log(option)
            location.hash = `charts?id=${option.id}&type=${option.type}&icon=${option.icon}`
            return;
        }
        // showModal();
        location.hash = "charts"
    }
    return (
        <div className="thumbnail-list">
            {thumbnails.map((thumbnail, index) => (
                <div key={index} className="thumbnail-item" onClick={() => toNoteTypePage(thumbnail)}>
                    <img src={thumbnail.icon} alt={thumbnail.type} className="thumbnail-image" width={120} />
                    <div className="thumbnail-info">
                        <h3>{thumbnail.type}</h3>
                        <p>类型: {thumbnail.t}</p>
                    </div>
                </div>
            ))}

            <div className="thumbnail-item add" key="index-route" onClick={() => toNoteTypePage(null)} onDrop={readConfig} onDragOver={(e) => e.preventDefault()}>
                <img src="https://tse2-mm.cn.bing.net/th/id/OIP-C.U7FfAyDpymE1yL0yhMnHQgAAAA?rs=1&pid=ImgDetMain" alt="add" className="thumbnail-image" />
                <div className="thumbnail-info">
                    <h3>Add</h3>
                </div>
            </div>

            <Modal
                title="基本对话框"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>这是一个基本的对话框示例。</p>
            </Modal>
        </div>
    );
};

export default ThumbnailList;
