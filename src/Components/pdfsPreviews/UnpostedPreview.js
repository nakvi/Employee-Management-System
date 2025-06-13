import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
const UnpostedPreview = ({ groupedData }) => {
  const reportRef = useRef();
  // Table columns fixed order
  const columns = [
    { key: "EmpCode", label: "E-Code" },
    { key: "EName", label: "Name" },
    { key: "Designation", label: "Designation" },
    { key: "StartTime", label: "Time IN" },
    { key: "DateIn", label: "Time OUT" },
    { key: "LateTime", label: "Late Time" },
    { key: "Remarks", label: "Remarks" },
  ];

  // Print date/time
  const now = new Date();
  const printDate = now.toLocaleDateString();
  const printTime = now.toLocaleTimeString();

  const handlePrintPDF = () => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });

  // Header
  doc.setFontSize(16);
  doc.text("LECOMPANY NAME", doc.internal.pageSize.getWidth() / 2, 30, { align: "center" });
  doc.setFontSize(12);
  doc.text(`Unposted Attendance for the date ${printDate}`, doc.internal.pageSize.getWidth() / 2, 50, { align: "center" });

  let startY = 70;

  groupedData.forEach((section, idx) => {
    // Section Title
    doc.setFontSize(13);
    doc.setTextColor("#a13b00");
    doc.text(section.section, 40, startY);
    doc.setTextColor(0, 0, 0);

    // Table Data
    const tableBody = section.rows.map((row, i) => [
      i + 1,
      row.EmpCode || "",
      row.EName || "",
      row.Designation || "",
      row.StartTime || "",
      row.DateIn || "",
      row.LateTime || "",
      row.Remarks || "",
    ]);

    doc.autoTable({
      head: [[
        "#", "E-Code", "Name", "Designation", "Time IN", "Time OUT", "Late Time", "Remarks"
      ]],
      body: tableBody,
      startY: startY + 10,
      theme: "grid",
      headStyles: { fillColor: [91, 164, 182] },
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { left: 40, right: 40 },
      didDrawPage: (data) => {
        // For multipage, reset startY
        startY = data.cursor.y + 20;
      }
    });

    startY = doc.lastAutoTable.finalY + 30;
  });

  // Footer (optional)
  doc.setFontSize(10);
  doc.text(`Print Date: ${printDate}    Print Time: ${printTime}`, doc.internal.pageSize.getWidth() - 200, doc.internal.pageSize.getHeight() - 20);

  // Preview in new tab
  window.open(doc.output("bloburl"), "_blank");
};
  // const handlePrintPDF = async () => {
  //   const input = reportRef.current;
  //   const canvas = await html2canvas(input, { scale: 2 });
  //   const imgData = canvas.toDataURL("image/png");
  //   const pdf = new jsPDF({
  //     orientation: "landscape",
  //     unit: "pt",
  //     format: "a4", // Use standard A4 size
  //   });
  //   const pageWidth = pdf.internal.pageSize.getWidth();
  //   const pageHeight = pdf.internal.pageSize.getHeight();
  //   pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
  //   // pdf.save("D-01-Unposted.pdf");
  //   const pdfBlob = pdf.output("blob");
  //   const pdfUrl = URL.createObjectURL(pdfBlob);
  //   window.open(pdfUrl, "_blank");
  // };

  // Data check
  if (!groupedData || groupedData.length === 0) {
    return (
      <div style={{ margin: "0 auto", maxWidth: 1100 }}>
        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 2px 12px #0001", padding: 40, textAlign: "center" }}>
          <h4>No Data Found</h4>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      margin: "0 auto",
      maxWidth: 1100,
      minHeight: 400,
      background: "#f5f6fa",
      borderRadius: 8,
      boxShadow: "0 2px 12px #0001",
      padding: 24,
      overflow: "auto"
    }}>
      <div ref={reportRef} style={{
        fontFamily: "Arial, sans-serif",
        fontSize: 13,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #0001",
        padding: 24,
        minWidth: 900,
        margin: "0 auto"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 18, marginBottom: 4 }}>
          LECOMPANY NAME
        </div>
        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 15, marginBottom: 12 }}>
          Unposted Attendance for the date {printDate}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", fontSize: 12, marginBottom: 8 }}>
          <div style={{ marginRight: 16 }}>Print Date : {printDate}</div>
          <div>Print Time : {printTime}</div>
        </div>
        {/* Sections */}
        {groupedData.map((section, idx) => (
          <div key={section.section} style={{ marginBottom: 18 }}>
            {/* Section Name */}
            <div style={{
              background: "#e6b97a",
              color: "#a13b00",
              padding: "2px 10px",
              fontWeight: "bold",
              borderLeft: "4px solid #a13b00",
              borderTop: idx === 0 ? "1px solid #bbb" : "none",
              borderBottom: "1px solid #bbb",
              fontSize: 15,
              margin: "10px 0 0 0"
            }}>
              {section.section}
            </div>
            {/* Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 0 }}>
              <thead>
                <tr style={{ background: "#5ba4b6", color: "#fff" }}>
                  <th style={{ border: "1px solid #e0e0e0", padding: "2px 6px", width: 30 }}>#</th>
                  {columns.map(col => (
                    <th key={col.key} style={{ border: "1px solid #e0e0e0", padding: "2px 6px" }}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f7fafd" }}>
                    <td style={{ border: "1px solid #e0e0e0", padding: "2px 6px", textAlign: "center" }}>{i + 1}</td>
                    {columns.map(col => (
                      <td key={col.key} style={{ border: "1px solid #e0e0e0", padding: "2px 6px" }}>
                        {row[col.key] || ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        {/* Footer */}
        <div style={{ textAlign: "right", fontSize: 12, marginTop: 24 }}>
          {/* Page number JS PDF se add hota hai, yahan preview me nahi aayega */}
        </div>
      </div>
      {/* Print Button */}
      <div style={{ textAlign: "right", margin: "10px 0" }}>
        <button onClick={handlePrintPDF} style={{ padding: "6px 18px", background: "#5ba4b6", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
          Print PDF
        </button>
      </div>
    </div>
  );
};

export default UnpostedPreview;