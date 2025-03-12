
import { useState, useEffect } from "react";
import ThumbnailList from "./thumb";

import { useNotesHooks } from "@renderer/hooks/useNotes";

import { Col, Row, Space } from "antd";

function Home() {

	const op = "50" // 卡片透明值 00 ~ FF
	const notes = useNotesHooks();


	useEffect(() => {
		console.log("home effect")
	}, [])





	return (
		<div className="home-page">
			<ThumbnailList thumbnails={notes.types}></ThumbnailList>
		</div>
	);
}

export default Home;
