import Card from "@renderer/components/Card";
import { Table, ConfigProvider } from "antd";
import { useCommonStore } from "@renderer/hooks/useCommonStore";

export default function HomeTable({
	data,
	columns,
}: {
	data: object[];
	columns: object[];
}) {
	const { themeStyle } = useCommonStore();

	return (
		<Card
			border="true"
			style={{
				padding: "1rem",
			}}
		>
			<ConfigProvider
				theme={{
					components: {
						Table: {
							/* 这里是你的组件 token */
							headerBorderRadius: 0,
							rowHoverBg: themeStyle.bgc3,
							headerBg: themeStyle.bgc2,
							headerColor: themeStyle.textColor,
							borderColor: themeStyle.borderColor,
							colorBgContainer:themeStyle.bgc2,
							colorText:themeStyle.textColor,
						},
					},
				}}
			>
				<Table
					style={{ background: "#bfa" }}
					dataSource={data}
					columns={columns}
					pagination={false}
				/>
			</ConfigProvider>
		</Card>
	);
}
