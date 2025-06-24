import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const DepartmentChart = () => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 900;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    const data = {
      name: "Total 33",
      children: [
        { 
          name: "Development 16", 
          children: [
            { name: "Magento 3" },
            { name: "App Development 5" },
            { name: "Wordpress Development 4" },
            { name: "Web Development 4" }
          ] 
        },
        { 
          name: "Marketing 9", 
          children: [
            { name: "Designing 3" },
            { name: "Data Entry 2" },
            { name: "Human Resources 2" }
          ] 
        },
        { 
          name: "Production 8", 
          children: [
            { name: "Quality Assurance 3" },
            { name: "Software 5" }
          ] 
        }
      ]
    };

    // Create hierarchy and tree layout
    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([height - 100, width - 200]); // Swapped width/height for horizontal layout
    
    // Compute the tree layout
    treeLayout(root);

    // Center the tree vertically
    const yOffset = 50;
    root.each(d => {
      d.y = d.y + yOffset;
    });

    // Draw links (lines between nodes)
    svg.append("g")
      .selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x))
      .attr("fill", "none")
      .attr("stroke", "#999")
      .attr("stroke-width", 1.5);

    // Create node groups
    const node = svg.append("g")
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.y},${d.x})`);

    // Add circles for each node
    node.append("circle")
      .attr("r", 5)
      .attr("fill", d => d.depth === 0 ? "#555" : 
                        d.depth === 1 ? "#777" : "#999");

    // Add text to each node
    node.append("text")
      .attr("dy", d => d.children ? -10 : 10)
      .attr("x", d => d.children ? -10 : 10)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.name)
      .style("font-size", "12px")
      .style("font-family", "sans-serif")
      .style("fill", d => d.depth === 0 ? "#000" : "#333");

    return () => {
      svg.selectAll("*").remove();
    };
  }, []);

  return (
    <div style={{ width: '100%', overflow: 'auto' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default DepartmentChart;