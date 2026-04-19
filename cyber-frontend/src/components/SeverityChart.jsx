import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const SeverityChart = ({ endpoints }) => {
  let high = 0,
    medium = 0,
    low = 0;

  endpoints.forEach((ep) => {
    ep.vulnerabilities.forEach((v) => {
      if (v.severity === "High" || v.severity === "Critical") high++;
      else if (v.severity === "Medium") medium++;
      else if (v.severity === "Low") low++;
    });
  });

  const data = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        data: [high, medium, low],
        backgroundColor: ["#FF4D4F", "#FFA940", "#40A9FF"],
      },
    ],
  };

  return (
    <div className="bg-[#121821] border border-[#1F2937] p-4 rounded-md shadow-sm w-64">
      <p className="text-sm mb-2 text-gray-400">Severity Distribution</p>
      <Pie data={data} />
    </div>
  );
};

export default SeverityChart;
