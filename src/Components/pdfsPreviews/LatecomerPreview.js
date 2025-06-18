// import React, { useRef } from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// const dummyData = [
//   {
//     section: "ADMIN GENERAL LTS",
//     rows: [
//       { ECode: "A00158", Name: "HAZIK SAID", Designation: "MERCHANDISING & PL", TimeIN: "10:01:57", TimeOUT: "17:27:13", Late: "5min", Remarks: "Machine" },
//       { ECode: "A01111", Name: "MUHAMMAD IQBAL", Designation: "STORE HELPER", TimeIN: "11:52:53", TimeOUT: "20:26:16", Late: "25min", Remarks: "Machine" },
//       { ECode: "A01546", Name: "SHAN IQBAL", Designation: "COSTING & PLANNING", TimeIN: "09:22:43", TimeOUT: "17:38:14", Late: "2min", Remarks: "Machine" },
//     ]
//   },
//   {
//     section: "BOTTOM LTS",
//     rows: [
//       { ECode: "A00749", Name: "REHMAT ALI", Designation: "CUTTING HELPER", TimeIN: "08:25:26", TimeOUT: "16:59:23", Late: "2min", Remarks: "Machine" },
//     ]
//   },
//   {
//     section: "LASTING",
//     rows: [
//       { ECode: "A01909", Name: "MUHAMMAD AHMED", Designation: "ASSISTANT SUPERVISOR", TimeIN: "08:20:57", TimeOUT: "17:24:24", Late: "20min", Remarks: "Machine" },
//     ]
//   },
//   {
//     section: "MODEL ROOM LTS",
//     rows: [
//       { ECode: "A00735", Name: "MUHAMMAD JAVED", Designation: "UPPER MAN", TimeIN: "09:25:00", TimeOUT: "17:18:00", Late: "5min", Remarks: "Machine" },
//     ]
//   },
//   {
//     section: "PRODUCTIONS LTS",
//     rows: [
//       { ECode: "A00651", Name: "MUHAMMAD IRFAN", Designation: "STITCHING SUPERVISOR", TimeIN: "08:40:00", TimeOUT: "16:20:00", Late: "40min", Remarks: "Machine" },
//       { ECode: "A00954", Name: "MUHAMMAD IMTIAZ AKBAR", Designation: "PRODUCTION MANAGER", TimeIN: "09:20:00", TimeOUT: "17:14:00", Late: "50min", Remarks: "Machine" },
//       { ECode: "A01049", Name: "RASHEED AHMED", Designation: "EXECUTIVE DESIGNER", TimeIN: "08:24:17", TimeOUT: "17:01:50", Late: "2min", Remarks: "Machine" },
//       { ECode: "A01109", Name: "MOHSIN ALI", Designation: "LASTING SUPERVISOR", TimeIN: "08:24:11", TimeOUT: "17:01:55", Late: "2min", Remarks: "Machine" },
//     ]
//   },
//   {
//     section: "QUALITY & INSPECTION LTS",
//     rows: [
//       { ECode: "A00953", Name: "MUBASHAR ALI", Designation: "DISPATCH SUPERVISOR", TimeIN: "11:54:30", TimeOUT: "20:29:21", Late: "25min", Remarks: "Machine" },
//       { ECode: "A01012", Name: "ZEESHAN", Designation: "PACKER", TimeIN: "11:54:37", TimeOUT: "20:26:32", Late: "2min", Remarks: "Machine" },
//     ]
//   },
//   {
//     section: "SOCKS DEP LTS",
//     rows: [
//       { ECode: "A01316", Name: "SHOAIB", Designation: "SOCKS MAN", TimeIN: "08:36:48", TimeOUT: "17:26:56", Late: "5min", Remarks: "Machine" },
//       { ECode: "A01467", Name: "SUNNY HIDAYT", Designation: "PRINTING MAN", TimeIN: "08:25:44", TimeOUT: "17:09:05", Late: "2min", Remarks: "Machine" },
//     ]
//   },
// ];

// const LatecomerPreview = ({ groupedData }) => {
//   const reportRef = useRef();
//   // Find first non-empty section
//   const firstSection = groupedData.find(sec => sec.rows && sec.rows.length > 0);
//   // Columns ko first row ki keys se generate karein
//   const columns = firstSection ? Object.keys(firstSection.rows[0]) : [];
//   const handlePrintPDF = async () => {
//     const input = reportRef.current;
//     const canvas = await html2canvas(input, { scale: 2 });
//     const imgData = canvas.toDataURL("image/png");

//     // Set a smaller width for the PDF (e.g., 700pt instead of canvas.width)
//     const pdfWidth = 700;
//     // Calculate height to keep aspect ratio
//     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//     const pdf = new jsPDF({
//       orientation: "landscape",
//       unit: "pt",
//       format: [pdfWidth, pdfHeight],
//     });
//     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//     pdf.save("LateComerReport.pdf");
//   };

//  return (
//     <div style={{ maxWidth: 1200, margin: "0 auto" }}>
//       <div ref={reportRef} style={{ fontFamily: "Arial, sans-serif", fontSize: 13, background: "#fff", border: "1px solid #bbb", padding: 24 }}>
//         {/* ...header... */}
//         {groupedData.map((section, idx) => {
//         // Dynamic columns from first row of this section
//         const columns = section.rows.length > 0 ? Object.keys(section.rows[0]) : [];
//         return (
//           <div key={section.section} style={{ marginBottom: 10 }}>
//             <div style={{ background: "#5ba4b6", color: "#fff", padding: "4px 8px", fontWeight: "bold", borderTop: idx === 0 ? "1px solid #bbb" : "none", borderBottom: "1px solid #bbb" }}>
//               {section.section}
//             </div>
//             <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
//               <thead>
//                 <tr style={{ background: "#eaf3f7" }}>
//                   {columns.map(col => (
//                     <th key={col} style={{ border: "1px solid #e0e0e082", padding: "2px 6px" }}>
//                       {col}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {section.rows.map((row, i) => (
//                   <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f7fafd" }}>
//                     {columns.map(col => (
//                       <td key={col} style={{ border: "1px solid #e0e0e082", padding: "2px 6px" }}>
//                         {row[col]}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         );
//       })}

//         {/* ...footer... */}
//       </div>
//       {/* ...print button... */}
//     </div>
//   );
// };

// export default LatecomerPreview;

import React, { useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const columns = [
  { key: "EmpCode", label: "E-Code" },
  { key: "EName", label: "Name" },
  { key: "Designation", label: "Designation" },
  { key: "DateIn", label: "Time IN" },
  { key: "DateOut", label: "Time OUT" },
  { key: "LateTime", label: "Late Time" },
  { key: "Remarks", label: "Remarks" },
];

function formatTime(val) {
  if (!val) return "";
  if (typeof val === "string") {
    const match = val.match(/\d{2}:\d{2}:\d{2}/);
    if (match) return match[0];
    const match2 = val.match(/\d{2}:\d{2}/);
    if (match2) return match2[0];
  }
  return val;
}

function formatLateTime(val) {
  if (!val || val === 0 || val === "0") return "0";
  return `${val} min`;
}

function getCurrentDate() {
  const d = new Date();
  return d.toLocaleDateString('en-GB').replace(/\//g, '-');
}
function getCurrentTime() {
  const d = new Date();
  return d.toLocaleTimeString('en-GB', { hour12: false });
}

const LatecomerPreview = ({ groupedData, reportHeading, reportDate }) => {
  const reportRef = useRef();

  const handlePrintPDF = () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    const sections = groupedData.map(sec => ({
      title: sec.section,
      head: ['#', ...columns.map(col => col.label)],
      rows: sec.rows.map((row, idx) => [
        (idx + 1).toString(),
        ...columns.map(col => {
          if (col.key === "DateIn" || col.key === "DateOut") {
            return formatTime(row[col.key]);
          }
          if (col.key === "LateTime") {
            return formatLateTime(row[col.key]);
          }
          return row[col.key] || "";
        })
      ])
    }));

    let startY = 80;

    sections.forEach((section) => {
      autoTable(doc, {
        startY,
        head: [
          [
            {
              content: section.title,
              colSpan: columns.length + 1,
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
          // halign is overridden by columnStyles/didParseCell
          lineColor: [230, 230, 230],
          lineWidth: 0.3,
        },
        bodyStyles: {
          fontSize: 7,
          font: 'helvetica',
          lineColor: [230, 230, 230],
          lineWidth: 0.3,
        },
        alternateRowStyles: {
          fillColor: [247, 250, 253],
        },
        margin: { top: 80, left: 30, right: 40 },
        columnStyles: {
          0: { halign: 'left', cellWidth: 20 },    // #
          1: { halign: 'left', cellWidth: 40 },    // E-Code
          2: { halign: 'left', cellWidth: 110 },    // Name
          3: { halign: 'left', cellWidth: 110 },    // Designation
          4: { halign: 'center', cellWidth: 45 },  // Time IN
          5: { halign: 'center', cellWidth: 45 },  // Time OUT
          6: { halign: 'center', cellWidth: 45 },  // Late Time
          7: { halign: 'left', cellWidth: 110 },    // Remarks
        },
        didDrawPage: function () {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.text('LECOMPANY NAME', 40, 60);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          if (reportHeading && reportHeading.trim() !== "") {
            doc.text(reportHeading, 40, 75);
          } else {
            doc.text(`Latecomers report for the date ${reportDate}`, 40, 75);
          }
          doc.setFontSize(8);
          doc.text(`Print Date: ${getCurrentDate()}`, pageWidth - 130, 60);
          doc.text(`Print Time: ${getCurrentTime()}`, pageWidth - 130, 75);

          // Page number
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
          // Only header row (not section title)
          if (data.section === 'head' && data.row.index === 1) {
            const colIndex = data.column.index;
            // Left align for E-Code, Name, Designation, Remarks
            if ([0, 1, 2, ,3 , 7].includes(colIndex)) {
              data.cell.styles.halign = 'left';
            } else {
              data.cell.styles.halign = 'center';
            }
          }
        }
      });

      startY = doc.lastAutoTable.finalY + 10;
    });

    window.open(doc.output("bloburl"), "_blank");
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: "right", margin: "10px 0" }}>
        <button
          onClick={handlePrintPDF}
          style={{
            padding: "6px 18px",
            background: "#5ba4b6",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Print PDF
        </button>
      </div>
      <div
        ref={reportRef}
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: 13,
          background: "#fff",
          border: "1px solid #bbb",
          padding: 24,
        }}
      >
        {groupedData.map((section, idx) => (
          <div key={section.section} style={{ marginBottom: 10 }}>
            <div
              style={{
                background: "#5ba4b6",
                color: "#fff",
                padding: "4px 8px",
                fontWeight: "bold",
                borderTop: idx === 0 ? "1px solid #bbb" : "none",
                borderBottom: "1px solid #bbb",
              }}
            >
              {section.section}
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
              }}
            >
              <thead>
                <tr style={{ background: "#eaf3f7" }}>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      style={{
                        border: "1px solid #e0e0e082",
                        padding: "2px 6px",
                        textAlign:
                          ["DateIn", "DateOut", "LateTime"].includes(col.key)
                            ? "center"
                            : "left",
                      }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row, i) => (
                  <tr
                    key={i}
                    style={{
                      background: i % 2 === 0 ? "#fff" : "#f7fafd",
                    }}
                  >
                    {columns.map((col) => {
                      let value = row[col.key];
                      if (col.key === "DateIn" || col.key === "DateOut") {
                        value = formatTime(value);
                      }
                      if (col.key === "LateTime") {
                        value = formatLateTime(value);
                      }
                      return (
                        <td
                          key={col.key}
                          style={{
                            border: "1px solid #e0e0e082",
                            padding: "2px 6px",
                            textAlign:
                              ["DateIn", "DateOut", "LateTime"].includes(col.key)
                                ? "center"
                                : "left",
                          }}
                        >
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatecomerPreview;