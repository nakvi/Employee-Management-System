import React, { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';



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

  function getCurrentDate() {
  const d = new Date();
  return d.toLocaleDateString('en-GB').replace(/\//g, '-');
}
function getCurrentTime() {
  const d = new Date();
  return d.toLocaleTimeString('en-GB', { hour12: false });
}
  // Print date/time
  const now = new Date();
  const printDate = now.toLocaleDateString();
  const printTime = now.toLocaleTimeString();

const handlePrintPDF = () => {
  const doc = new jsPDF('p', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();

  // Convert groupedData to sections for PDF
  const sections = groupedData.map(sec => ({
    title: sec.section,
    head: ['#', ...columns.map(col => col.label)],
    rows: sec.rows.map((row, idx) => [
      (idx + 1).toString(),
      ...columns.map(col => row[col.key] || "")
    ])
  }));

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('LECOMPANY NAME', 40, 40);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('Unposted Attendance for the date 02/06/2025', 40, 60);

  doc.setFontSize(10);
  doc.text(`Print Date: ${getCurrentDate()}`, pageWidth - 180, 40);
  doc.text(`Print Time: ${getCurrentTime()}`, pageWidth - 180, 60);

  let startY = 80;

  sections.forEach((section) => {
    // Section Title Row
    autoTable(doc, {
      startY,
      head: [[section.title]],
      theme: 'plain',
      headStyles: {
        fillColor: [230, 185, 122], // Section color (match your HTML)
        textColor: [161, 59, 0],    // Section text color
        fontStyle: 'bold',
        fontSize: 11,
        halign: 'left',
        cellPadding: { left: 4, right: 0, top: 2, bottom: 2 },
      },
      styles: { cellWidth: 'wrap' },
      columnStyles: { 0: { cellWidth: pageWidth - 80 } },
      margin: { left: 40, right: 40 },
      didDrawPage: function (data) {
        // Page number in footer
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(9);
        doc.text(
          `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`,
          pageWidth - 80,
          doc.internal.pageSize.getHeight() - 20,
          { align: 'right' }
        );
      },
    });

    startY = doc.lastAutoTable.finalY;

    // Table Header and Data
    autoTable(doc, {
      startY,
      head: [section.head],
      body: section.rows,
      theme: 'grid',
      headStyles: {
        fillColor: [91, 164, 182], // Table header color (match your HTML)
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 9,
        halign: 'center',
        font: 'helvetica',
      },
      alternateRowStyles: {
        fillColor: [247, 250, 253], // Table alternate row color (match your HTML)
      },
      
      margin: { left: 40, right: 40 },
      didDrawPage: function (data) {
        // Page number in footer
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(9);
        doc.text(
          `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`,
          pageWidth - 80,
          doc.internal.pageSize.getHeight() - 20,
          { align: 'right' }
        );
      },
    });

    startY = doc.lastAutoTable.finalY + 10;
  });

  // Preview in new tab
  window.open(doc.output("bloburl"), "_blank");
};

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