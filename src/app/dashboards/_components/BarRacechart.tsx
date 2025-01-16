// components/BarRaceChart.tsx

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

// Define types for the data structure
interface DataItem {
  name: string;
  value: number;
}

interface BarRaceChartProps {
  data: DataItem[];
}

const BarRaceChart: React.FC<BarRaceChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [chartData, setChartData] = useState<DataItem[]>(data);
  const width = 800;
  const height = 400;

  useEffect(() => {
    // D3 chart rendering logic
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const x = d3.scaleLinear()
      .domain([0, d3.max(chartData, (d) => d.value) || 100])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleBand()
      .domain(chartData.map((d) => d.name))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    // Remove previous bars and labels
    svg.selectAll('.bar').remove();
    svg.selectAll('.label').remove();

    // Render the bars
    const bars = svg.selectAll<SVGRectElement, DataItem>('.bar')
      .data(chartData, (d) => d.name);

    bars.exit().transition().duration(500)
      .attr('width', 0)
      .remove();

    bars.enter().append('rect')
      .attr('class', 'bar')
      .attr('x', margin.left)
      .attr('y', (d) => y(d.name) ?? 0)
      .attr('width', 0)
      .attr('height', y.bandwidth())
      .attr('fill', 'steelblue')
      .merge(bars)
      .transition()
      .duration(1000)
      .attr('width', (d) => x(d.value) - margin.left);

    // Render the labels
    const labels = svg.selectAll<SVGTextElement, DataItem>('.label')
      .data(chartData, (d) => d.name);

    labels.exit().remove();

    labels.enter().append('text')
      .attr('class', 'label')
      .attr('x', margin.left)
      .attr('y', (d) => y(d.name) ?? 0)
      .attr('dy', y.bandwidth() / 2)
      .attr('dx', 5)
      .attr('alignment-baseline', 'middle')
      .text((d) => d.name)
      .merge(labels);

    // Render axis
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y));

    // Update data dynamically
    const interval = setInterval(() => {
      setChartData(
        data.map((d) => ({
          name: d.name,
          value: Math.floor(Math.random() * 100), // Random value for race effect
        }))
      );
    }, 2000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [chartData, data]);

  return <svg ref={svgRef}></svg>;
};

export default BarRaceChart;
