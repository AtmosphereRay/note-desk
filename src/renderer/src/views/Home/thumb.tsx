import './ThumbnailList.css'; // 引入样式文件
import { useState } from 'react';
import { Modal } from 'antd';
const ThumbnailList = ({ thumbnails }) => {
    // 定义状态变量，用于控制对话框是否显示
    const [isModalVisible, setIsModalVisible] = useState(false);

    // 打开对话框的函数
    const showModal = () => {
        setIsModalVisible(true);
    };

    // 关闭对话框的函数
    const handleOk = () => {
        setIsModalVisible(false);
    };

    // 取消按钮的处理函数
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    return (
        <div className="thumbnail-list">
            {thumbnails.map((thumbnail, index) => (
                <div key={index} className="thumbnail-item">
                    <img src={thumbnail.a} alt={thumbnail.nm} className="thumbnail-image" />
                    <div className="thumbnail-info">
                        <h3>{thumbnail.nm}</h3>
                        <p>类型: {thumbnail.t}</p>
                    </div>
                </div>
            ))}

            <div className="thumbnail-item add" onClick={showModal}>
                <img src="https://tse2-mm.cn.bing.net/th/id/OIP-C.U7FfAyDpymE1yL0yhMnHQgAAAA?rs=1&pid=ImgDetMain" alt="add" className="thumbnail-image" />
                <div className="thumbnail-info">
                    <h3>Add</h3>
                </div>
            </div>

            <Modal
                title="基本对话框"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>这是一个基本的对话框示例。</p>
            </Modal>
        </div>
    );
};

export default ThumbnailList;
