import React from "react";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const SalaryAllwDedPreview = ({ allEmployees = [], reportHeading, dateFrom, dateTo }) => {
  // Log received data for debugging
  React.useEffect(() => {
    console.log("All Employees Data:", allEmployees);
  }, [allEmployees]); 
  // Group employees by department
  const grouped = {};
  allEmployees.forEach(emp => {
    const section = emp.Department || "No Department";
    if (!grouped[section]) grouped[section] = [];
    grouped[section].push(emp);
  });

  // Table columns (auto width)
  const columns = [
    { key: "EmpCode", label: "E-Code", width: "auto" },
    { key: "EName", label: "Name", width: "auto" },
    { key: "Designation", label: "Designation", width: "auto" },
  ];

    // PDF Export
    const handlePrintAllPDF = () => {
      if (!allEmployees.length) return;
      const doc = new jsPDF('l', 'pt', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();

    const drawHeader = () => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor('#222');
      doc.text('Zeta Solutions Pvt Ltd', 40, 40);
      doc.setFontSize(11);
      doc.setTextColor('#222');
      doc.text(
        `OverTime Sheet for the Month ( ${dateFrom?.slice(0, 7)} )`,
        40,
        60
      );
    };

    let first = true;
    Object.entries(grouped).forEach(([section, emps]) => {
      if (!first) doc.addPage();
      first = false;

      drawHeader();

      // Calculate department totals
      const totalSalary = emps.reduce((sum, emp) => sum + (parseFloat(emp.SalaryWithAllow) || 0), 0);
      const totalHours = emps.reduce((sum, emp) => sum + (parseFloat(emp.OverTime) || 0), 0);
      const totalAmount = emps.reduce((sum, emp) => sum + (parseFloat(emp.OverTimeRs) || 0), 0);

      // Prepare body rows
      const bodyRows = emps.map((emp, idx) =>
        columns.map(col => {
          if (col.key === "srl") return idx + 1;
          if (col.key === "Signature") return "";
          // Show '-' instead of 0 or 0.00
          const val = emp[col.key];
          if (val === 0 || val === "0" || val === "0.00") return "-";
          return val !== undefined && val !== null && val !== "" ? val : "-";
        })
      );

      // Add grand total row
      const totalRow = columns.map(col => {
        if (col.key === "srl") return "";
        if (col.key === "EmpCode") return "";
        if (col.key === "EName") return "";
        if (col.key === "Designation") return "Department Totals :";
        if (col.key === "SalaryWithAllow") return totalSalary ? totalSalary.toLocaleString() : "-";
        if (col.key === "OverTime") return totalHours ? totalHours.toLocaleString() : "-";
        if (col.key === "OverTimeRs") return totalAmount ? totalAmount.toLocaleString() : "-";
        if (col.key === "Signature") return "";
        return "";
      });

      bodyRows.push(totalRow);

      autoTable(doc, {
        startY: 70,
        head: [
          [
            {
              content: section,
              colSpan: columns.length,
              styles: {
                fillColor: [200, 230, 201],
                textColor: [0, 77, 64],
                fontStyle: 'bold',
                fontSize: 7,
                halign: 'left',
                cellPadding: 2,
                lineWidth: 1,
                lineColor: [230, 230, 230],
              }
            }
          ],
          columns.map(col => ({
            content: col.label,
            styles: {
              fillColor: '#e1f5fe',
              textColor: '#222',
              fontStyle: 'bold',
              fontSize: 7,
              halign: 'center',
              valign: 'middle',
              lineColor: [230, 230, 230],
              lineWidth: 1,
            }
          }))
        ],
        body: bodyRows,
        theme: 'grid',
        headStyles: {
          fillColor: '#e1f5fe',
          textColor: '#222',
          fontStyle: 'bold',
          fontSize: 8,
          halign: 'center',
          valign: 'middle',
          lineColor: [230, 230, 230],
          lineWidth: 1,
        },
        bodyStyles: {
          fontSize: 7,
          font: 'helvetica',
          halign: 'center',
          valign: 'middle',
          lineColor: [230, 230, 230],
          lineWidth: 1,
        },
        alternateRowStyles: { fillColor: '' },
        margin: { left: 40, right: 40 },
        columnStyles: columns.reduce((acc, col, idx) => {
          acc[idx] = { cellWidth: 'auto', halign: col.key === "EName" || col.key === "Designation" ? "left" : "center" };
          return acc;
        }, {}),
        didParseCell: function (data) {
          if (data.row.index === 0 && data.section === 'head') {
            data.cell.styles.fontSize = 9;
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.halign = 'left';
            data.cell.styles.fillColor = '#F7EDD4';
            data.cell.styles.textColor = '#222';
            data.cell.styles.lineWidth = 1;
            data.cell.styles.lineColor = [230, 230, 230];
          }
          // Style the grand total row
          if (data.row.index === bodyRows.length - 1 && data.section === 'body') {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [220, 240, 255];
          }
        }
      });
    });
    const pageCount = doc.internal.getNumberOfPages();
    const pageHeight = doc.internal.pageSize.getHeight();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 40, pageHeight - 15, { align: 'right' });
    }

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

export default SalaryAllwDedPreview;