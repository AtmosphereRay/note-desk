export function downloadTextFile(filename: string, text: string) {
    // 创建一个新的Blob对象，将文本内容包装起来
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });

    // 使用URL.createObjectURL()为这个Blob对象创建一个临时的URL
    const url = URL.createObjectURL(blob);

    // 创建一个隐藏的<a>元素用于触发下载
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;

    // 将<a>元素添加到DOM中，并模拟点击事件触发下载
    document.body.appendChild(a);
    a.click();

    // 下载完成后，移除<a>元素并释放URL对象
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}