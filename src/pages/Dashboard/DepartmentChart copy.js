
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const DepartmentChart = () => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 800;
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
    const treeLayout = d3.tree().size([width - 200, height - 200]);
    
    // Compute the tree layout
    treeLayout(root);

    // Center the tree
    const xOffset = 100;
    root.each(d => {
      d.x = d.x + xOffset;
    });

    // Draw links (lines between nodes)
    svg.append("g")
      .selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y))
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
      .attr("transform", d => `translate(${d.x},${d.y})`);

    // Add rectangles for each node
    node.append("rect")
      .attr("width", d => Math.max(120, d.data.name.length * 7)) // Dynamic width
      .attr("height", 30)
      .attr("x", d => -Math.max(120, d.data.name.length * 7) / 2)
      .attr("y", -15)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("fill", d => d.depth === 0 ? "#f0f0f0" : 
                        d.depth === 1 ? "#e0e0e0" : "#d0d0d0")
      .attr("stroke", "#999");

    // Add text to each node
    node.append("text")
      .attr("dy", 4)
      .attr("text-anchor", "middle")
      .text(d => d.data.name)
      .style("font-size", d => d.depth === 0 ? "14px" : "12px")
      .style("font-weight", d => d.depth === 0 ? "bold" : "normal");

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