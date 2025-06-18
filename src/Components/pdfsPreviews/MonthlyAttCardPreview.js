import React from "react";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const MonthlyAttCardPreview = ({ emp, allEmployees = [], reportHeading, dateFrom, dateTo }) => {
  const formatTime = (val) => {
    if (!val) return "";
    if (val.length > 8) return val.slice(11, 19);
    return val;
  };

  // Calculate total overtime (sum of OverTime column)
  const getTotalOverTime = (attendance) => {
    if (!attendance) return "";
    let totalMinutes = 0;
    attendance.forEach(row => {
      if (row.OverTime) {
        const parts = row.OverTime.split(':').map(Number);
        if (parts.length === 2) {
          totalMinutes += parts[0] * 60 + parts[1];
        } else if (parts.length === 3) {
          totalMinutes += parts[0] * 60 + parts[1] + Math.floor(parts[2] / 60);
        }
      }
    });
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

const handlePrintAllPDF = () => {
  if (!allEmployees.length) return;
  const doc = new jsPDF('p', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();

  allEmployees.forEach((emp, idx) => {
    if (idx > 0) doc.addPage();

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Shafi Lifestyle (Pvt.) Ltd.', 40, 40);
    doc.setFontSize(10);
    doc.text(
      `Attendance Card for the Month (${dateFrom?.slice(0, 7)})`,
      40,
      60
    );
    doc.setFontSize(9);
    doc.text(`Print Date: ${new Date().toLocaleDateString()}`, pageWidth - 130, 40);
    doc.text(`Print Time: ${new Date().toLocaleTimeString()}`, pageWidth - 130, 60);

    // Employee Info Section Row
    autoTable(doc, {
      startY: 75,
      head: [[
        {
          content: `Emp Code: ${emp.EmpCode}    Name: ${emp.EName}    Designation: ${emp.Designation}    D O J: ${emp.DOJ}    Department: ${emp.Department}    Over Time: 0`,
          colSpan: 9,
          styles: {
            halign: 'left',
            fillColor: [247, 237, 212],
            textColor: '#222',
            fontStyle: 'bold',
            fontSize: 9,
            cellPadding: 4,
            font: 'helvetica'
          }
        }
      ]],
      body: [],
      theme: 'plain',
      margin: { left: 40, right: 40 },
      tableLineWidth: 0,
    });

    // Attendance Table
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 2,
      head: [[
        "Srl#", "Day", "Closing Date", "Time In", "Time Out", "Tot Time", "Over Time", "Attendance", "Remarks"
      ]],
      body: emp.Attendance.map((row, idx) => [
        idx + 1,
        new Date(row.VDate).toLocaleDateString('en-US', { weekday: 'short' }),
        row.VDate,
        formatTime(row.DateIn),
        formatTime(row.DateOut),
        row.TotTime || "",
        row.OverTime || "",
        row.AttCode || "",
        row.Remarks || ""
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: '#e1f5fe',
        textColor: '#222',
        fontStyle: 'bold',
        fontSize: 8,
        font: 'helvetica',
        halign: 'center',
        lineColor: [230, 230, 230],
        lineWidth: 0.3,
      },
      bodyStyles: {
        fontSize: 8,
        font: 'helvetica',
        halign: 'center',
        lineColor: [230, 230, 230],
        lineWidth: 0.3,
      },
      alternateRowStyles: {
        fillColor: [247, 250, 253],
      },
      margin: { left: 40, right: 40 },
      columnStyles: {
        0: { halign: 'center', cellWidth: 30 },    // Srl#
        1: { halign: 'center', cellWidth: 40 },    // Day
        2: { halign: 'center', cellWidth: 90 },    // Closing Date
        3: { halign: 'center', cellWidth: 50 },    // Time In
        4: { halign: 'center', cellWidth: 50 },    // Time Out
        5: { halign: 'center', cellWidth: 50 },    // Tot Time
        6: { halign: 'center', cellWidth: 50 },    // Over Time
        7: { halign: 'center', cellWidth: 65 },    // Attendance
        8: { halign: 'left', cellWidth: 90 },      // Remarks
      },
    });
  });

  window.open(doc.output("bloburl"), "_blank");
};
  // Data check
  if (!emp || !emp.Attendance || emp.Attendance.length === 0) {
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
      margin: "30px auto",
      maxWidth: 1100,
      background: "#fff",
      borderRadius: 8,
      boxShadow: "0 2px 12px #0001",
      padding: 24,
      overflow: "auto"
    }}>
      {/* Print All PDF Button (only on first card) */}
      {allEmployees.length >= 1 && emp.EmpID === allEmployees[0].EmpID && (
        <div style={{ textAlign: "right", margin: "10px 0" }}>
          <button onClick={handlePrintAllPDF} style={{ padding: "6px 18px", background: "#5ba4b6", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
            Print All PDF
          </button>
        </div>
      )}
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <div>
          <div style={{ fontWeight: "bold", fontSize: 18 }}>Shafi Lifestyle (Pvt.) Ltd.</div>
          <div style={{ fontWeight: "bold", fontSize: 15 }}>
            Attendance Card for the Month ({dateFrom?.slice(0, 7)} )
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 13 }}>
          <div>Print Date: {new Date().toLocaleDateString()}</div>
        </div>
      </div>
      {/* Employee Info */}
      <table style={{ background: "#F7EDD4", width: "100%", marginBottom: 10, fontSize: 13 }}>
        <tbody>
          <tr>
            <td style={{ fontWeight: "bold" }}>Emp Code</td>
            <td>{emp.EmpCode}</td>
            <td style={{ fontWeight: "bold" }}>Name</td>
            <td>{emp.EName}</td>
            <td style={{ fontWeight: "bold" }}>Designation</td>
            <td>{emp.Designation}</td>
            <td style={{ fontWeight: "bold" }}>D O J</td>
            <td>{emp.DOJ}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold" }}>Department</td>
            <td>{emp.Department}</td>
            <td style={{ fontWeight: "bold" }}>Over Time</td>
            <td colSpan={3}>0</td>
          </tr>
        </tbody>
      </table>
      {/* Attendance Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: "#e1f5fe", color: "" }}>
            <th style={{ border: "1px solid #e0e0e0" }}>Srl#</th>
            <th style={{ border: "1px solid #e0e0e0" }}>Day</th>
            <th style={{ border: "1px solid #e0e0e0" }}>Closing Date</th>
            <th style={{ border: "1px solid #e0e0e0" }}>Time In</th>
            <th style={{ border: "1px solid #e0e0e0" }}>Time Out</th>
            <th style={{ border: "1px solid #e0e0e0" }}>Tot Time</th>
            <th style={{ border: "1px solid #e0e0e0" }}>Over Time</th>
            <th style={{ border: "1px solid #e0e0e0" }}>Attendance</th>
            <th style={{ border: "1px solid #e0e0e0" }}>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {emp.Attendance.map((row, idx) => (
            <tr key={idx} style={{ background: idx % 2 === 0 ? "#fff" : "#f7fafd" }}>
              <td style={{ border: "1px solid #e0e0e0", textAlign: "center" }}>{idx + 1}</td>
              <td style={{ border: "1px solid #e0e0e0", textAlign: "center" }}>{new Date(row.VDate).toLocaleDateString('en-US', { weekday: 'short' })}</td>
              <td style={{ border: "1px solid #e0e0e0", textAlign: "center" }}>{row.VDate}</td>
              <td style={{ border: "1px solid #e0e0e0", textAlign: "center" }}>{formatTime(row.DateIn)}</td>
              <td style={{ border: "1px solid #e0e0e0", textAlign: "center" }}>{formatTime(row.DateOut)}</td>
              <td style={{ border: "1px solid #e0e0e0", textAlign: "center" }}>{row.TotTime || ""}</td>
              <td style={{ border: "1px solid #e0e0e0", textAlign: "center" }}>{row.OverTime || ""}</td>
              <td style={{ border: "1px solid #e0e0e0", textAlign: "center" }}>{row.AttCode || ""}</td>
              <td style={{ border: "1px solid #e0e0e0", textAlign: "center" }}>{row.Remarks || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyAttCardPreview;