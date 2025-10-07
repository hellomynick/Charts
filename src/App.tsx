import React, {useEffect, useState} from "react";
import Papa from "papaparse";
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData} from "chart.js";
import {Bar} from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const App: React.FC = () => {
  const [allData, setAllData] = useState<Record<string, ChartData<"bar">>>({});

  useEffect(() => {
    // CSV đặt trong public/responses.csv
    fetch("/responses.csv")
      .then(res => res.text())
      .then(csvText => {
        const parsed = Papa.parse(csvText, {header: true});
        const headers = parsed.meta.fields || [];

        const result: Record<string, ChartData<"bar">> = {};

        headers.forEach(header => {
          if (header === "Dấu thời gian") return; // bỏ cột thời gian

          const answers: string[] = parsed.data.map((row: any) => row[header]?.trim() || "");
          const total = answers.length;

          const counts: Record<string, number> = {};
          answers.forEach(ans => {
            if (!ans) return;
            // Nếu nhiều phương án, split bằng ";"
            ans.split(";").forEach(option => {
              const key = option.trim();
              if (!key) return;
              if (!counts[key]) counts[key] = 0;
              counts[key]++;
            });
          });

          const labels = Object.keys(counts);
          const values = labels.map(l => Number(((counts[l] / total) * 100).toFixed(2)));

          result[header] = {
            labels,
            datasets: [
              {
                label: "% trả lời",
                data: values,
                backgroundColor: labels.map((_, i) => `hsl(${(i * 60) % 360}, 70%, 50%)`),
              },
            ],
          };
        });

        setAllData(result);
      });
  }, []);

  return (
    <div style={{padding: "20px"}}>
      <h1>Thống kê Google Form</h1>
      {Object.entries(allData).map(([question, chartData]) => (
        <div key={question} style={{marginBottom: "50px"}}>
          <h3>{question}</h3>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {position: "top"},
                title: {display: false},
              },
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default App;
