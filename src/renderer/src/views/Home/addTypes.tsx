import React, { useState } from 'react';
import { Modal } from 'antd';

const App = () => {
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
        <div>
            {/* 按钮点击后触发 showModal 函数 */}
            <button onClick={showModal}>显示对话框</button>

            {/* Modal 组件，通过 isModalVisible 控制显示隐藏 */}
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

export default App;
