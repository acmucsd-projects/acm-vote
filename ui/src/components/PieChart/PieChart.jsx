import React, { useEffect, useState, useRef } from 'react';
// Goodbye D3 :))
import Chart from 'chart.js';
import './PieChart.css';

const PieChart = (props) => {
    const { colorArray, optionArray, voteData } = props;
    const chartCanvas = useRef(null);
    const [currChartContent, setCurrChartContent] = useState();
    const chartConfig = {
        type: "pie",
        data: {
            labels: optionArray,
            datasets: [{
                data: voteData,
                backgroundColor: colorArray
            }]
        },
        options: {
            legend: {
                display: false
            }
        }
    };

    useEffect(() => {
        if (chartCanvas && chartCanvas.current) {
            let chartContent = new Chart(chartCanvas.current, chartConfig);
            setCurrChartContent(chartContent);
        }
    }, [chartCanvas])

    return (
        <div className="pie-chart-wrapper">
            <canvas ref={chartCanvas} />
        </div>
    )
}

export default PieChart;