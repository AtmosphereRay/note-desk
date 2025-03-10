 
import { useState, useEffect } from "react";
import ThumbnailList from "./thumb";

import { useCommonStore } from "@renderer/hooks/useCommonStore";

import { Col, Row, Space } from "antd";

function Home() {

	const op = "50" // 卡片透明值 00 ~ FF

	const { themeStyle } = useCommonStore()

	useEffect(() => {
		console.log("home effect")
	}, [])

	const thumbnails = [
		{ t: 1, nm: "css", a: "https://tse4-mm.cn.bing.net/th/id/OIP-C.Gsnv2sCiGKr-2IhFiWmUlgAAAA?rs=1&pid=ImgDetMain" },
		{ t: 1, nm: "js", a: "https://fernando-gaitan.com.ar/wp-content/uploads/javascript_id.png" },
		{ t: 1, nm: "html", a: "https://cdn-icons-png.flaticon.com/128/1051/1051277.png" },
	]



	return (
		<div className="home-page">
			<ThumbnailList thumbnails={thumbnails}></ThumbnailList>
		</div>
	);
}

export default Home;
