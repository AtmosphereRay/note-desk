import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import { Demo } from "~/config/enmu";
const GlobalExitModal = () => {
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const hideModal = () => {
        setVisible(false);
    };

    const handleConfirm = () => {
        // 处理确认逻辑
        console.log('退出确认');
        hideModal();
    };

    const handleCancel = () => {
        // 处理取消逻辑
        console.log('退出取消');
        hideModal();
    };

    const onConfirm = () => window.App.pubEvent(Demo.destroy)



    window.App.once(Demo.onBeforeQuit, () => {
        showModal();
    })

    return (
        <Modal
            title="操作提示"
            open={visible}
            onOk={onConfirm}
            onCancel={handleCancel}
            centered
            footer={[
                <Button key="back" onClick={handleCancel}>
                    取消
                </Button>,
                <Button key="submit" type="primary" onClick={onConfirm}>
                    确定
                </Button>,
            ]}
        >
            <p>您确定要退出吗？</p>
        </Modal>
    );
};

export default GlobalExitModal;
