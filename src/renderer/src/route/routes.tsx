import { HomeOutlined, UserOutlined, FormOutlined, WarningOutlined, UndoOutlined, SettingOutlined } from "@ant-design/icons";

import LayOut from "@renderer/components/Layout/LayOut";
import Home from "@renderer/views/Home";
import Login from "@renderer/views/Login";
import Charts from "@renderer/views/Charts";
import NotFound from "@renderer/views/NotFound";
import ManegeGoods from "@renderer/views/manege/ManegeGoods";
 

import { RouteType } from "./type";
import UpdateComponent from "@renderer/views/Upadte/update";

export const routes: RouteType[] = [
	{
		path: "/login",
		name: "登录",
		element: <Login />,
	},
	{
		path: "/",
		element: <LayOut />,
		children: [
			{
				index: "true",
				path: "index",
				name: "笔记",
				icon: <HomeOutlined />,
				element: <Home />,
			},
			{
				path: "charts",
				name: "编辑栏",
				element: <Charts />,
				icon:<FormOutlined />
			},
			{
				path: "manege",
				name: "预览面板",
				icon: <UserOutlined />,
				element: <ManegeGoods />,
	 
			},
			{
				path: "manege3",
				name: "系统管理",
				icon: <SettingOutlined />,
				type: "sub",
				children: [
					{
						path: "manege_goods3",
						name: "商品管理3",
						element: <ManegeGoods />,
					},
 
				],
			},
			{
				path: "update",
				name: "文章列表",
				icon: <UndoOutlined />,
				element: < UpdateComponent />

			},
			{
				path: "not_found",
				name: "错误 404",
				element: <NotFound />,
				icon: <WarningOutlined />,
			},

		],
	},
	{
		path: "/*",
		name: "404",
		element: <NotFound />,
	},
];
// 将路由扁平化
const flatRoutes = (routes: RouteType[]) => {
	let res: RouteType[] = [];
	routes.forEach((item) => {
		res.push(item);
		if (item.children && item.children.length > 0) {
			res.push(...flatRoutes(item.children));
		}
	});

	return res;
};

export const flatRoutesList = flatRoutes(routes);
