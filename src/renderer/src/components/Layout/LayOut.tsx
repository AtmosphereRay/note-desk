import { Layout, Flex } from "antd";
import { Outlet } from "react-router-dom";

import MenuComponent from "@renderer/components/Menu";
import Header from "@renderer/components/Header";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { PathFindName, setTitle } from "@renderer/util";
import { useCommonStore } from "@renderer/hooks/useCommonStore";
import { addTabItem } from "@renderer/store/Tab";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@renderer/store";
import { useNavigate } from "react-router-dom";
import config from "@renderer/config";
import LoadingComponent from "@renderer/components/Loading";

const { Content } = Layout;
let loading_t: any = null;

function LayOut() {
	const { pathname } = useLocation();
	const { tabList, themeStyle, isStretched } = useCommonStore();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		//  修改html title
		let pathArr = pathname.split("/");
		let path = pathArr[pathArr.length - 1];
		if (path === "") path = "/";
		let title = PathFindName(path);
		setTitle(title);

		// 修改 tab 栏
		if (path !== "/") {
			if (tabList.findIndex((item) => item.path === pathname) === -1) {
				dispatch(
					addTabItem({
						path: pathname,
						name: title,
						active: "false",
					})
				);
				// 如果已经alive 则不loading
				setIsLoading(true);
				loading_t = setTimeout(() => {
					setIsLoading(false);
				}, 600);
			}
		}

		const isLogin = localStorage.getItem(config.TOKEN_NAME);
		if (!isLogin) {
			navigate("login");
		}

		// TODO message 功能

		// 模拟请求展示 Loading
		// 后续可以使用 hook 控制 在请求拦截器中调用

		return () => {
			clearTimeout(loading_t);
		};
	}, [pathname]);

	return (
		<Flex gap="middle" wrap="wrap">
			<Layout style={{ maxHeight: "100vh" }}>
				<MenuComponent />
				<Layout>
					<Header></Header>
					<Content
						style={{
							height: "100%",
							padding: "1rem " + (isStretched ? "4rem" : "1rem"),
							overflowY: "scroll",
							backgroundColor: themeStyle.bgc,
							color: themeStyle.textColor,
						}}
					>
						{isLoading ? <LoadingComponent /> : <Outlet />}
					</Content>
				</Layout>
			</Layout>
		</Flex>
	);
}

export default LayOut;
