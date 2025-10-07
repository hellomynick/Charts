import React from 'react';
import './App.css';
import {Bar} from 'react-chartjs-2';
import DataSeed from "./data";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
} from 'chart.js';

function App() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement
  );

  const {question, answer} = DataSeed();

  const chartDataList = Array.from(question.entries()).map(([questionId, options]) => {
    const counts = new Array(options.length).fill(0)
    const total = answer.length

    answer.forEach((ans) => {
      const arr = ans.get(questionId)
      if (arr) {
        arr.forEach((val, idx) => {
          if (val) counts[idx]++
        })
      }
    })

    const percentages = counts.map((c) => ((c / total) * 100).toFixed(1))

    return {
      id: questionId,
      labels: options,
      data: percentages,
    }
  })

  return (
    <div className="flex flex-col gap-10 p-6">
      {chartDataList.map((q) => (
        <div key={q.id} className="w-full">
          <h2 className="text-lg font-semibold mb-2">
            Câu {q.id}
          </h2>
          <Bar
            data={{
              labels: q.labels,
              datasets: [
                {
                  label: "% người chọn",
                  data: q.data,
                  backgroundColor: "rgba(75,192,192,0.6)",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {position: "top"},
                title: {display: true, text: `Câu hỏi ${q.id}`},
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {callback: (val) => val + "%"},
                },
              },
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default App;
