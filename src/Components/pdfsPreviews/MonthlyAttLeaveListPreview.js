import React from "react";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Group by department
function groupByDepartment(data) {
  const grouped = {};
  data.forEach(row => {
    const key = row.Department || "No Department";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(row);
  });
  return grouped;
}

const columns = [
  { key: "Sr", label: "Sr #", width: 20 },
  { key: "EmpCode", label: "E-Code", width: 40 },
  { key: "EName", label: "Name", width: 100 },
  { key: "Designation", label: "Designation", width: 110 },
  { key: "AttCode", label: "Leave Type", width: 30 },
  { key: "VDate", label: "Date From / To", width: 70 },
  { key: "VNo", label: "V No.", width: 40 },
  { key: "LeaveDesc", label: "Remarks", width: 105 },
];

const MonthlyAttLeaveListPreview = ({ allEmployees = [], reportHeading, dateFrom, dateTo }) => {
  // Group data by department
  const grouped = groupByDepartment(allEmployees);

  // PDF Export
  const handlePrintAllPDF = () => {
    if (!allEmployees.length) return;
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('Shafi Lifestyle (Pvt.) Ltd.', 40, 40);
    doc.setFontSize(11);
    doc.setTextColor('#222');
    doc.text(
      `Leave List For the Month ( ${dateFrom?.slice(0, 7)} )`,
      40,
      60
    );
    doc.setFontSize(10);
    doc.setTextColor('#222');
    doc.text(`Print Date: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 130, 40);

    doc.setFontSize(11);
    doc.setTextColor('#222');
    doc.text(`Leaves For the Month : ${dateFrom?.slice(0, 7)}`, 40, 80);

    let startY = 95;
    let sr = 1;

    Object.entries(grouped).forEach(([dept, rows], deptIdx) => {
      if (deptIdx > 0) {
        doc.addPage();
        startY = 40;
      }

      // Department Row
      autoTable(doc, {
        startY,
        head: [[
          {
            content: dept,
            colSpan: columns.length,
            styles: {
              fillColor: '#F7EDD4',
              textColor: '#222',
              fontStyle: 'bold',
              fontSize: 7,
              halign: 'left',
              cellPadding: 6,
              lineColor: [230, 230, 230],
              lineWidth: 0.3,
            }
          }
        ]],
        body: [],
        theme: 'grid',
        styles: {
          fontSize: 7,
          cellPadding: 2,
        },
        margin: { left: 40, right: 40 },
        tableLineWidth: 0.3,
        tableLineColor: [230, 230, 230],
      });

      // Table Header + Data
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY,
        head: [columns.map(col => col.label)],
        body: rows.map((row, idx) => [
          sr++,
          row.EmpCode || "",
          row.EName || "",
          row.Designation || "",
          row.AttCode || "",
          row.VDate ? new Date(row.VDate).toLocaleDateString('en-GB') : "",
          row.VNo || "",
          row.LeaveDesc || "",
        ]),
        theme: 'grid',
        headStyles: {
          fillColor: '#E1F5FE',
          textColor: '#222',
          fontStyle: 'bold',
          fontSize: 7,
          halign: 'center',
          lineColor: [230, 230, 230],
          lineWidth: 0.3,
        },
        bodyStyles: {
          fontSize: 7,
          font: 'helvetica',
          halign: 'center',
          lineColor: [230, 230, 230],
          lineWidth: 0.3,
        },
        alternateRowStyles: {
          fillColor: '',
        },
        margin: { left: 40, right: 40 },
        columnStyles: columns.reduce((acc, col, idx) => {
          acc[idx] = { cellWidth: col.width, halign: col.key === "EName" || col.key === "Designation" || col.key === "LeaveDesc" ? "left" : "center" };
          return acc;
        }, {}),
      });

      startY = doc.lastAutoTable.finalY + 10;
    });

    window.open(doc.output("bloburl"), "_blank");
  };

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
            Leave List For the Month ( {dateFrom?.slice(0, 7)} )
          </div>
          <div style={{ fontWeight: "bold", fontSize: 14, color: "#444", marginTop: 2 }}>
            Leaves For the Month : {dateFrom?.slice(0, 7)}
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 13 }}>
          <div>Print Date: {new Date().toLocaleDateString()}</div>
        </div>
      </div>
      {/* Department wise tables */}
      {Object.entries(grouped).map(([dept, rows], deptIdx) => (
        <div key={dept} style={{ marginBottom: 30 }}>
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
                  {dept}
                </th>
              </tr>
              {/* Column Headers */}
              <tr style={{ background: "#fff9c4", color: "#004d40" }}>
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
              {rows.map((row, idx) => (
                <tr key={row.VID || idx} style={{ background: idx % 2 === 0 ? "#fff" : "#e8f5e9" }}>
                  <td style={{ border: "1px solid #78909c", textAlign: "center" }}>{idx + 1}</td>
                  <td style={{ border: "1px solid #78909c", textAlign: "center" }}>{row.EmpCode}</td>
                  <td style={{ border: "1px solid #78909c", textAlign: "left", fontWeight: "bold" }}>{row.EName}</td>
                  <td style={{ border: "1px solid #78909c", textAlign: "left" }}>{row.Designation}</td>
                  <td style={{ border: "1px solid #78909c", textAlign: "center" }}>{row.AttCode}</td>
                  <td style={{ border: "1px solid #78909c", textAlign: "center" }}>{row.VDate ? new Date(row.VDate).toLocaleDateString('en-GB') : ""}</td>
                  <td style={{ border: "1px solid #78909c", textAlign: "center" }}>{row.VNo}</td>
                  <td style={{ border: "1px solid #78909c", textAlign: "left" }}>{row.LeaveDesc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default MonthlyAttLeaveListPreview;