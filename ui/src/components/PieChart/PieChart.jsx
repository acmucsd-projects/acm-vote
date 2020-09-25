import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Arc = (props) => {
    const { data, index, createArc, color, format } = props;
    return (
        <g key={index} className="arc">
            <path className="arc" d={createArc(data)} fill={color} />
        </g>
    );
}

const PieChart = (props) => {
    const { colorArray, radius, voteData } = props;
    const ref = useRef(null);

    const createPie = d3.pie()
        .value(d => d.value)
        .sort(null);

    const createArc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    const colors = d3.scaleOrdinal()
        .domain([10, 1])
        .range(colorArray);

    const format = d3.format(".2f");
    const data = createPie([
        {
            optionName: "Milk first",
            votes: 10
        }, 
        {
            optionName: "Cereal first",
            votes: 1
        }
    ]); // It somehow doesn't accept json format lol which is weird


    useEffect(() => {
        /*const data = createPie(voteData);
        const group = d3.select(ref.current);
        const groupWithData = group.selectAll("g.arc").data(data);

        groupWithData.exit().remove();

        const groupWithUpdate = groupWithData
            .enter()
            .append("g")
            .attr("class", "arc");

        const path = groupWithUpdate
            .append("path")
            .merge(groupWithData.select("path.arc"));

        path
            .attr("class", "arc")
            .attr("d", createArc)
            .attr("fill", (d, i) => colors(i));*/
        console.log("voteData: " + JSON.stringify(voteData));
    }, [voteData]);

    return (
        <svg width={radius * 2} height={radius * 2}>
            <g height={radius * 2}
                transform={`translate(${radius} ${radius})`}>
            {data.map((d, i) => {
                console.log("d: " + d + "i: " + i);
                return (
                    <Arc
                        key={i}
                        data={d}
                        index={i}
                        createArc={createArc}
                        color={colors(colorArray.length - i - 1)}
                        format={format}
                    />
                )
            })}
            </g>
        </svg>
    );
}

export default PieChart;