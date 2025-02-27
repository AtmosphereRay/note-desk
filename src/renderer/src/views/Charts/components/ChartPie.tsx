import Charts from "@renderer/components/Charts";
import Card from "@renderer/components/Card";

 
import { useCommonStore } from "@renderer/hooks/useCommonStore";

function ChartPie() {

	const { themeStyle } = useCommonStore()

    const series = [44,  13, 43, 22]

	const op = {
		chart: {
            height: 350,
			type: "pie",
			foreColor: themeStyle.textColor
		},
		labels: ["Team A", "Team B", "Team C", "Team D",],
		responsive: [
			{
				breakpoint: 480,
				options: {
					chart: {
						width: 200,
					},
					legend: {
						position: "bottom",
					},
				},
			},
		],
        legend: {
            position: 'top',
            horizontalAlign: 'center',
          },
	}  

	return (
		<Card
			border="true"
			title="Pie Chart"
			style={{
				padding: "1rem",
			}}
		>
			<Charts options={op} series={series} type="pie" height="350" />
		</Card>
	);
}

export default ChartPie;
