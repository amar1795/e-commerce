import React, { use, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";




export default function StarChart(barChartData,initialCount) {
// console.log("this is the initialCount", initialCount);
  console.log("this is the barchart data:", barChartData.barChartData);

//   const initialData = [
//     {
//       name: "5 Stars",
//       uv: 5,
//       stars:initialCount[5] ,
//       amt: 2000
//     },
//     {
//       name: "4 Stars",
//       uv: 4,
//       stars: 0,
//       amt: 2000
//     },
//     {
//       name: "3 Stars",
//       uv: 3,
//       stars: 0,
//       amt: 2000
//     },
//     {
//       name: "2 Stars",
//       uv: 2,
//       stars: 0,
//       amt: 2000
//     },
//     {
//       name: "1 Stars",
//       uv: 1,
//       stars: 0,
//       amt: 2000
//     },
    
//   ];
//   const [data, setData] = useState(initialData);

// useEffect(() => {
//   const data = initialData.map((item, index) => ({
//     ...item,
//     stars: initialCount[index+1] || item.stars,
//   }));
//   setData(data);

//   console.log("this is the new initial data", data);
// }, [initialCount]);
const [data, setData] = useState([]);
useEffect(() => {
  const data1= barChartData.barChartData;
  setData(data1);

},[barChartData.barChartData] )
  return (
    <BarChart
      width={200}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}
      barSize={30}
    >
      
      <Bar dataKey="stars" barSize={8}  fill="#8884d8" background={{ fill: "#eee" }} />
    </BarChart>
  );
}
