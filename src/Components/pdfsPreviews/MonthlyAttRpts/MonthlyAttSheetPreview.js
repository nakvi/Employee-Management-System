import React from "react";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const MonthlyAttSheetPreview = ({ allEmployees = [], reportHeading, dateFrom, dateTo }) => {
  // Group employees by department
  const grouped = {};
  allEmployees.forEach(emp => {
    const section = emp.Department || "No Department";
    if (!grouped[section]) grouped[section] = [];
    grouped[section].push(emp);
  });

  // PDF Export
  const handlePrintAllPDF = () => {
    if (!allEmployees.length) return;
    const doc = new jsPDF('l', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    // Find max days in month
    const daysInMonth = new Date(dateFrom?.slice(0, 7) + "-01");
    daysInMonth.setMonth(daysInMonth.getMonth() + 1);
    daysInMonth.setDate(0);
    const totalDays = daysInMonth.getDate();

    Object.entries(grouped).forEach(([section, emps], secIdx) => {
      if (secIdx > 0) doc.addPage();

      // Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('Shafi Lifestyle (Pvt.) Ltd.', 40, 40);
      doc.setFontSize(11);
      doc.text(
        `Attendance Sheet For the Month ( ${dateFrom?.slice(0, 7)} )`,
        40,
        60
      );
      doc.setFontSize(9);
      doc.text(`Print Date:   ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 160, 60);

      // Table head: First column = department name, then 01...31, then Tot
      const headRow = [
        { content: section, styles: { fontStyle: 'bold', fontSize: 10, halign: 'left' } },
        ...Array.from({ length: totalDays }, (_, i) => (i + 1).toString().padStart(2, "0")),
        "Tot"
      ];

      // Prepare body rows
      const bodyRows = emps.map(emp => {
        const attCodes = [];
        let total = 0;
        for (let d = 1; d <= totalDays; d++) {
          const code = emp[`D${d.toString().padStart(2, "0")}`] || "";
          attCodes.push(code);
          if (code === "PP") total += 1;
        }
        return [
          `${emp.EmpCode}:${emp.EName}`,
          ...attCodes,
          emp.SalaryDays || total.toFixed(1)
        ];
      });

      autoTable(doc, {
        startY: 95,
        head: [headRow],
        body: bodyRows,
        theme: 'grid',
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: '#222',
          fontStyle: 'bold',
          fontSize: 8,
          font: 'helvetica',
          halign: 'center',
          valign: 'middle',
          lineColor: [200, 200, 200], // light border
          lineWidth: 0.5,
        },
        bodyStyles: {
          fontSize: 8,
          font: 'helvetica',
          halign: 'center',
          valign: 'middle',
          lineColor: [220, 220, 220], // even lighter border
          lineWidth: 0.3,
        },
        alternateRowStyles: {
          fillColor: [255, 255, 255],
        },
        margin: { left: 30, right: 30 },
        columnStyles: {
          0: { halign: 'left', cellWidth: 120 },
          [totalDays + 1]: { halign: 'center', cellWidth: 35 },
        },

      didParseCell: function (data) {
        if (data.section === 'body' && ["SN", "HL", "SPL"].includes(data.cell.raw)) {
          data.cell.styles.fillColor = [220, 220, 220];
          data.cell.styles.textColor = [0, 0, 0];
          data.cell.styles.fontStyle = 'bold';
        }
        }
      });
    });

    window.open(doc.output("bloburl"), "_blank");
  };

  // Data check
  if (!allEmployees || allEmployees.length === 0) {
    return (
      <div style={{ margin: "0 auto", maxWidth: 1100 }}>
        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 2px 12px #0001", padding: 40, textAlign: "center" }}>
          <h4>No Data Found</h4>
        </div>
      </div>
    );
  }

  // Attendance Sheet Horizontal Preview (React Table)
  const daysInMonth = new Date(dateFrom?.slice(0, 7) + "-01");
  daysInMonth.setMonth(daysInMonth.getMonth() + 1);
  daysInMonth.setDate(0);
  const totalDays = daysInMonth.getDate();
  const dayCols = Array.from({ length: totalDays }, (_, i) => (i + 1).toString().padStart(2, "0"));

  return (
    <div style={{ overflowX: "auto", margin: "20px 0" }}>
      {/* Print All PDF Button */}
      {allEmployees.length >= 1 && (
        <div style={{ textAlign: "right", margin: "10px 0" }}>
          <button onClick={handlePrintAllPDF} style={{ padding: "6px 18px", background: "#5ba4b6", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
            Print All PDF
          </button>
        </div>
      )}
      {Object.entries(grouped).map(([section, emps]) => (
        <div key={section} style={{ marginBottom: 30 }}>
          <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #aaa", minWidth: 120, fontWeight: "bold", textAlign: "left" }}>{section}</th>
                {dayCols.map(day => (
                  <th key={day} style={{ border: "1px solid #aaa", minWidth: 28, textAlign: "center" }}>{day}</th>
                ))}
                <th style={{ border: "1px solid #aaa", minWidth: 35 }}>Tot</th>
              </tr>
            </thead>
            <tbody>
              {emps.map(emp => {
                let total = 0;
                return (
                  <tr key={emp.EmpID}>
                    <td style={{ border: "1px solid #aaa", fontWeight: "bold" }}>{emp.EmpCode}:{emp.EName}</td>
                    {dayCols.map(day => {
                      const code = emp[`D${day}`] || "";
                      if (code === "PP") total += 1;
                      return (
                        <td key={day} style={{
                          border: "1px solid #aaa",
                          background: ["SN", "HL", "SPL"].includes(code) ? "#e0e0e0" : "#fff",
                          fontWeight: ["SN", "HL", "SPL"].includes(code) ? "bold" : "normal",
                          textAlign: "center"
                        }}>{code}</td>
                      );
                    })}
                    <td style={{ border: "1px solid #aaa", textAlign: "center" }}>{emp.SalaryDays || total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default MonthlyAttSheetPreview;