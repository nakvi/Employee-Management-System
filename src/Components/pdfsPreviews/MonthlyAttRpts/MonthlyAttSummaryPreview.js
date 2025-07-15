import React from "react";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const MonthlyAttSummaryPreview = ({ allEmployees = [], reportHeading, dateFrom, dateTo }) => {
  // Group employees by department
  const grouped = {};
  allEmployees.forEach(emp => {
    const section = emp.Department || "No Department";
    if (!grouped[section]) grouped[section] = [];
    grouped[section].push(emp);
  });

  // Table columns (as per your API)
  const columns = [
    { key: "EmpCode", label: "Code", width: 45 },
    { key: "EName", label: "Name", width: 90 },
    { key: "MonthDays", label: "Total Days", width: 45 },
    { key: "WorkingDays", label: "Worked", width: 45 },
    { key: "OverTime", label: "O/T", width: 38 },
    { key: "PPDays", label: "PP", width: 32 },
    { key: "HDDays", label: "HD", width: 32 },
    { key: "FHDays", label: "FH", width: 32 },
    { key: "GHDays", label: "GH", width: 32 },
    { key: "WEDays", label: "WE", width: 32 },
    { key: "Annual", label: "AL", width: 32 },
    { key: "Casual", label: "CL", width: 32 },
    { key: "Sick", label: "SL", width: 32 },
    { key: "HalfDay", label: "HL", width: 32 },
    { key: "MLDays", label: "ML", width: 32 },
    { key: "CPL", label: "CPL", width: 32 },
    { key: "ABDays", label: "AB", width: 32 },
    { key: "LateDays", label: "Late", width: 32 },
    { key: "LeaveBalance", label: "L-Bal", width: 38 },
    { key: "NetDays", label: "Net Days", width: 45 },
  ];

  // PDF Export
  const handlePrintAllPDF = () => {
    if (!allEmployees.length) return;
    const doc = new jsPDF('l', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header function
    const drawHeader = () => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor('#222');
      doc.text('Shafi Lifestyle (Pvt.) Ltd.', 40, 40);
      doc.setFontSize(11);
      doc.setTextColor('#222');
      doc.text(
        `Attendance Summary Of the Month ( ${dateFrom?.slice(0, 7)} )`,
        40,
        60
      );
      doc.setFontSize(9);
      doc.setTextColor('#222');
      doc.text(`Print Date: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 130, 40);
      doc.text(`Print Time: ${new Date().toLocaleTimeString('en-GB')}`, pageWidth - 130, 60);
    };

    let first = true;
    Object.entries(grouped).forEach(([section, emps]) => {
      if (!first) doc.addPage();
      first = false;

      drawHeader();

      // Department Table
      autoTable(doc, {
        startY: 80,
        head: [
          [
            {
              content: section,
              colSpan: columns.length,
              styles: {
                fillColor: [200, 230, 201], // light green
                textColor: [0, 77, 64],
                fontStyle: 'bold',
                fontSize: 8,
                halign: 'left',
                cellPadding: 4,
                lineWidth: 1,
                lineColor: [120, 144, 156],
              }
            }
          ],
          columns.map(col => ({
            content: col.label,
            styles: {
              fillColor: '#e1f5fe',
              textColor: '#222',
              fontStyle: 'bold',
              fontSize: 8,
              halign: 'center',
              valign: 'middle',
              lineColor: [120, 144, 156],
              lineWidth: 1,
            }
          }))
        ],
        body: emps.map(emp =>
          columns.map(col =>
            emp[col.key] !== undefined && emp[col.key] !== null ? emp[col.key] : "-"
          )
        ),
        theme: 'grid',
        headStyles: {
          fillColor: '#e1f5fe',
          textColor: '#222',
          fontStyle: 'bold',
          fontSize: 8,
          halign: 'center',
          valign: 'middle',
          lineColor: [120, 144, 156],
          lineWidth: 1,
        },
        bodyStyles: {
          fontSize: 7,
          font: 'helvetica',
          halign: 'center',
          valign: 'middle',
          lineColor: [120, 144, 156],
          lineWidth: 1,
        },
        alternateRowStyles: {
          fillColor: '',
        },
        margin: { left: 40, right: 40 },
        columnStyles: columns.reduce((acc, col, idx) => {
          acc[idx] = { cellWidth: col.width, halign: col.key === "EName" ? "left" : "center" };
          return acc;
        }, {}),
        didParseCell: function (data) {
          // Department name row
          if (data.row.index === 0 && data.section === 'head') {
            data.cell.styles.fontSize = 12;
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.halign = 'left';
            data.cell.styles.fillColor = '#F7EDD4';
            data.cell.styles.textColor = '#222';
            data.cell.styles.lineWidth = 1;
            data.cell.styles.lineColor = [120, 144, 156];
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

  // Preview
  return (
    <div style={{ margin: "30px auto", maxWidth: 1200, background: "#fff", borderRadius: 8, boxShadow: "0 2px 12px #0001", padding: 24, overflow: "auto" }}>
      {/* Print All PDF Button */}
      {allEmployees.length > 0 && (
        <div style={{ textAlign: "right", margin: "10px 0" }}>
          <button onClick={handlePrintAllPDF} style={{ padding: "6px 18px", background: "#00796b", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
            Print All PDF
          </button>
        </div>
      )}
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <div>
          <div style={{ fontWeight: "bold", fontSize: 18 }}>Shafi Lifestyle (Pvt.) Ltd.</div>
          <div style={{ fontWeight: "bold", fontSize: 15, color: "#00796b", marginTop: 2 }}>
            Attendance Summary Of the Month ( {dateFrom?.slice(0, 7)} )
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 13 }}>
          <div>Print Date: {new Date().toLocaleDateString()}</div>
          <div>Print Time: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>
      {/* Department wise tables */}
      {Object.entries(grouped).map(([section, emps]) => (
        <div key={section} style={{ marginBottom: 30 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 10 }}>
            <thead>
              {/* Department Name Row */}
              <tr>
                <th
                  colSpan={columns.length}
                  style={{
                    background: "#c8e6c9",
                    color: "#004d40",
                    fontWeight: "bold",
                    fontSize: 16,
                    textAlign: "left",
                    border: "1.5px solid #78909c",
                    borderBottom: "none",
                    padding: "6px 8px"
                  }}
                >
                  {section}
                </th>
              </tr>
              {/* Column Headers */}
              <tr style={{ background: "#c8e6c9", color: "#004d40" }}>
                {columns.map(col => (
                  <th
                    key={col.key}
                    style={{
                      border: "1px solid #78909c",
                      fontWeight: "bold",
                      textAlign: "center",
                      padding: "4px 3px",
                      minWidth: col.width
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {emps.map((emp, idx) => (
                <tr key={emp.EmpCode} style={{ background: idx % 2 === 0 ? "#fff" : "#e8f5e9" }}>
                  {columns.map(col => (
                    <td
                      key={col.key}
                      style={{
                        border: "1px solid #78909c",
                        textAlign: col.key === "EName" ? "left" : "center",
                        padding: "3px 2px",
                        fontWeight: col.key === "EmpCode" || col.key === "EName" ? "bold" : "normal"
                      }}
                    >
                      {emp[col.key] !== undefined && emp[col.key] !== null ? emp[col.key] : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default MonthlyAttSummaryPreview;