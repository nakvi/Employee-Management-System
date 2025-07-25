import React, { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';



const UnpostedPreview = ({ groupedData, reportHeading , reportDate }) => {
  const reportRef = useRef();
  // Table columns fixed order
  const columns = [
    { key: "EmpCode", label: "E-Code" },
    { key: "EName", label: "Name" },
    { key: "Designation", label: "Designation" },
    { key: "DateIn", label: "Time IN" },
    { key: "DateOut", label: "Time OUT" },
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
      ...columns.map(col => {
        if (col.key === "DateIn" || col.key === "DateOut") {
          // Show only time part (assume value is "YYYY-MM-DD HH:mm:ss" or similar)
          const val = row[col.key];
          if (!val) return "";
          // Try to extract time part
          const match = val.match(/\d{2}:\d{2}/);
          return match ? match[0] : val;
        }
        if (col.key === "LateTime") {
          // Show 0 if null, empty, or 0
          return row[col.key] && row[col.key] !== "0" ? row[col.key] : "0";
        }
        return row[col.key] || "";
      })
    ])
  }));


  // Header
  // doc.setFont('helvetica', 'bold');
  // doc.setFontSize(10);
  // doc.text('LECOMPANY NAME', 40, 60);
  // doc.setFont('helvetica', 'normal');
  // doc.setFontSize(10);
  // if (reportHeading && reportHeading.trim() !== "") {
  //   doc.text(reportHeading, 40, 75);
  // } else {
  //   doc.text(`Unposted Attendance for the date ${reportDate}`, 40, 75);
  // }

  

  // doc.setFontSize(8);
  // doc.text(`Print Date: ${getCurrentDate()}`, pageWidth - 130, 60);
  // doc.text(`Print Time: ${getCurrentTime()}`, pageWidth - 130, 75);

  let startY = 80;
  sections.forEach((section) => {
    autoTable(doc, {
      startY,
      head: [
        [
          {
            content: section.title,
            colSpan: 8,
            styles: {
              halign: 'left',
              fillColor: '#F7EDD4',
              textColor: '#222',
              fontStyle: 'bold',
              fontSize: 9,
              cellPadding: 2,
              font: 'helvetica'
            }
          }
        ],
        section.head
      ],
      body: section.rows,
      theme: 'grid',
      headStyles: {
        fillColor: '#fff',
        textColor: '#222',
        fontStyle: 'bold',
        fontSize: 7,
        font: 'helvetica',
        halign: 'left',
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
        fillColor: [247, 250, 253],
      },
       margin: { top: 75, left: 40, right: 40 }, // <-- Add top margin for header space
      columnStyles: {
        0: { halign: 'left', cellWidth: 20 },
        1: { halign: 'left', cellWidth: 40 },
        2: { halign: 'left', cellWidth: 110 },
        3: { halign: 'left', cellWidth: 110 },
        4: { halign: 'center', cellWidth: 45 },
        5: { halign: 'center', cellWidth: 45 },
        6: { halign: 'center', cellWidth: 45 },
        7: { halign: 'left', cellWidth: 100 },
      },
      didDrawPage: function (data) {
        // Header on every page
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('LECOMPANY NAME', 40, 60);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        if (reportHeading && reportHeading.trim() !== "") {
          doc.text(reportHeading, 40, 75);
        } else {
          doc.text(`Unposted Attendance for the date ${reportDate}`, 40, 75);
        }
        doc.setFontSize(8);
        doc.text(`Print Date: ${getCurrentDate()}`, pageWidth - 130, 60);
        doc.text(`Print Time: ${getCurrentTime()}`, pageWidth - 130, 75);

        // Page number (optional)
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(7);
        doc.text(
          `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`,
          pageWidth - 40,
          doc.internal.pageSize.getHeight() - 20,
          { align: 'right' }
        );
      },
      didParseCell: function (data) {
          // Apply alignment only to header row (excluding the section title row)
          if (data.section === 'head' && data.row.index === 1) {
            const colIndex = data.column.index;

            // Left align for specific headers
            if ([0, 1, 2, 3 , 7].includes(colIndex)) {
              data.cell.styles.halign = 'left';
            } else {
              // Center align for others
              data.cell.styles.halign = 'center';
            }
          }
        }
    });

    startY = doc.lastAutoTable.finalY + 10;
  });
  // sections.forEach((section) => {
  //   autoTable(doc, {
  //     startY,
  //     head: [
  //       [
  //         {
  //           content: section.title,
  //           colSpan: 8,
  //           styles: {
  //             halign: 'left',
  //             fillColor: '#F7EDD4',
  //             // textColor: [161, 59, 0],
  //             textColor: '#222',
  //             // fillColor: [230, 185, 122],
  //             // textColor: [161, 59, 0],
  //             fontStyle: 'bold',
  //             fontSize: 9,
  //             cellPadding: 5,
  //             font: 'helvetica'
  //           }
  //         }
  //       ],
  //       section.head
  //     ],
  //     body: section.rows,
  //     theme: 'grid',
  //     headStyles: {
  //       // fillColor: [91, 164, 182],
  //       fillColor: '#fff',
  //       // fillColor: [64, 81, 137],
  //       textColor: '#222',
  //       // textColor: [255, 255, 255],
  //       fontStyle: 'bold',
  //       fontSize: 7,
  //       font: 'helvetica',
  //       halign: 'left',
  //       lineColor: [230, 230, 230], // lighter border
  //       lineWidth: 0.3,
  //     },
  //     bodyStyles: {
  //       fontSize: 7,
  //       font: 'helvetica',
  //       halign: 'center',
  //       lineColor: [230, 230, 230], // lighter border
  //       lineWidth: 0.3,
  //     },
  //     alternateRowStyles: {
  //       fillColor: [247, 250, 253],
  //     },
  //     margin: { left: 40, right: 40 },
  //     columnStyles: {
  //       0: { halign: 'left', cellWidth: 20 },    // #
  //       1: { halign: 'left', cellWidth: 40 },    // E-Code
  //       2: { halign: 'left', cellWidth: 110 },   // Name
  //       3: { halign: 'left', cellWidth: 110 },   // Designation
  //       4: { halign: 'center', cellWidth: 45 },  // Time IN
  //       5: { halign: 'center', cellWidth: 45 },  // Time OUT
  //       6: { halign: 'center', cellWidth: 45 },  // Late Time
  //       7: { halign: 'left', cellWidth: 100 },   // Remarks
  //     },
  //     didDrawPage: function (data) {
  //       const pageCount = doc.internal.getNumberOfPages();
  //       doc.setFontSize(7);
  //       doc.text(
  //         `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`,
  //         pageWidth - 40,
  //         doc.internal.pageSize.getHeight() - 20,
  //         { align: 'right' }
  //       );
  //     },
  //   });

  //   startY = doc.lastAutoTable.finalY + 10;
  // });

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
        {/* Print Button */}
      <div style={{ textAlign: "right", margin: "10px 0" }}>
        <button onClick={handlePrintPDF} style={{ padding: "6px 18px", background: "#5ba4b6", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
          Print PDF
        </button>
      </div>
      <div ref={reportRef} style={{
        fontFamily: "helvetica, sans-serif",
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
    
    </div>
  );
};

export default UnpostedPreview;