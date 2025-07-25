// import React, { useRef } from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// const PostedPreview = ({ groupedData }) => {
//   const reportRef = useRef();

//   const columns = [
//   { key: "ECode", label: "E-Code" },
//   { key: "Name", label: "Name" },
//   { key: "Designation", label: "Designation" },
//   { key: "TimeIN", label: "Time IN" },
//   { key: "TimeOUT", label: "Time OUT" },
//   { key: "LateTime", label: "Late Time" },
//   { key: "OT", label: "O/T" },
//   { key: "WorkingHrs", label: "Working Hrs" },
//   { key: "LateSitting", label: "Late Sitting" },
//   { key: "Code", label: "Code" },
// ];
//   // Find first non-empty section
//   const firstSection = groupedData.find(sec => sec.rows && sec.rows.length > 0);
//   // Columns ko first row ki keys se generate karein
//   // const columns = firstSection ? Object.keys(firstSection.rows[0]) : [];
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

// return (
//   <div style={{ margin: "0 auto", overflow: "auto" }}>
//     <div
//       ref={reportRef}
//       style={{
//         fontFamily: "Arial, sans-serif",
//         fontSize: 13,
//         background: "#fff",
//         border: "1px solid #bbb",
//         padding: 24,
//         minWidth: 900,
//       }}
//     >
//       {/* ...header... */}
//       {groupedData.map((section, idx) => {
//         const columns = section.rows.length > 0 ? Object.keys(section.rows[0]) : [];
//         return (
//           <div key={section.section} style={{ marginBottom: 10 }}>
//             <div
//               style={{
//                 background: "#5ba4b6",
//                 color: "#fff",
//                 padding: "4px 8px",
//                 fontWeight: "bold",
//                 borderTop: idx === 0 ? "1px solid #bbb" : "none",
//                 borderBottom: "1px solid #bbb",
//               }}
//             >
//               {section.section}
//             </div>
//             <table style={{ width: "auto", borderCollapse: "collapse", fontSize: 12 }}>
//               <thead>
//                 <tr style={{ background: "#eaf3f7" }}>
//                   {columns.map((col) => (
//                     <th key={col} style={{ border: "1px solid #e0e0e082", padding: "2px 6px" }}>
//                       {col}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {section.rows.map((row, i) => (
//                   <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f7fafd" }}>
//                     {columns.map((col) => (
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
//       {/* ...footer... */}
//     </div>
//     {/* ...print button... */}
//   </div>
// );
// };

// export default PostedPreview;


import React, { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';


const PostedPreview = ({ groupedData, reportHeading , reportDate }) => {
  console.log(groupedData[0]?.rows[0]);
  const reportRef = useRef();
  // Table columns fixed order
const columns = [
  { key: "EmpCode", label: "E-Code" },
  { key: "EName", label: "Name" },
  { key: "Designation", label: "Designation" },
  { key: "ShiftTimeIn", label: "Time IN" },
  { key: "ShiftTimeOut", label: "Time OUT" },
  { key: "LateTime", label: "Late Time" },
  { key: "OT", label: "O / T" },
  { key: "TT", label: "Working Hrs" },
  { key: "LateSitting", label: "Late Sitting" },
  { key: "AttCode", label: "Code" },
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

    const pad = n => n.toString().padStart(2, '0');

    const sections = groupedData.map(sec => ({
      title: sec.section,
      head: ['#', ...columns.map(col => col.label)],
      rows: sec.rows.map((row, idx) => [
        (idx + 1).toString(),
        ...columns.map(col => {
          // Format ShiftTimeIn/Out as HH:00:00 if number
          if (col.key === "ShiftTimeIn" || col.key === "ShiftTimeOut") {
            const val = row[col.key];
            if (val === null || val === undefined || val === "" || val === 0 || val === "0") return "00:00";
            if (typeof val === "number") return `${pad(val)}:00`;
            return val;
          }
          // Format OT/TT as HH:mm:ss if string, else 00:00:00
          if (col.key === "OT" || col.key === "TT") {
            const val = row[col.key];
            if (!val || val === "0" || val === 0) return "00:00";
            if (typeof val === "string") {
              const match = val.match(/\d{2}:\d{2}/);
              if (match) return match[0];
            }
            return val;
          }
          // Show 0 for LateTime or LateSitting if empty/null/zero
          if (col.key === "LateTime" || col.key === "LateSitting") {
            return row[col.key] && row[col.key] !== "0" ? row[col.key] : "0";
          }
          // Default
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
          // halign: 'left',
          lineColor: [230, 230, 230],
          lineWidth: 0.3,
        },
        
        bodyStyles: {
          fontSize: 7,
          font: 'helvetica',
          // halign: 'center',
          lineColor: [230, 230, 230],
          lineWidth: 0.3,
        },
        alternateRowStyles: {
          fillColor: [247, 250, 253],
        },
        margin: { top: 80, left: 30, right: 40 }, // <-- Add top margin for header space
        columnStyles: {
          0: { halign: 'left', cellWidth: 20 },    // #
          1: { halign: 'left', cellWidth: 40 },    // E-Code
          2: { halign: 'left', cellWidth: 80 },    // Name
          3: { halign: 'left', cellWidth: 80 },    // Designation
          4: { halign: 'center', cellWidth: 45 },  // Time IN
          5: { halign: 'center', cellWidth: 45 },  // Time OUT
          6: { halign: 'center', cellWidth: 45 },  // Late Time
          7: { halign: 'center', cellWidth: 45 },  // O/T
          8: { halign: 'center', cellWidth: 45 },  // Working Hrs
          9: { halign: 'center', cellWidth: 45 },  // Late Sitting
          10: { halign: 'center', cellWidth: 45 }, // Code
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
            doc.text(`Posted Attendance for the date ${reportDate}`, 40, 75);
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
          // Apply alignment only to header row (excluding the section title row)
          if (data.section === 'head' && data.row.index === 1) {
            const colIndex = data.column.index;

            // Left align for specific headers
            if ([0, 1, 2, 3].includes(colIndex)) {
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
            <table style={{ width: "auto", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#eaf3f7" }}>
                  {columns.map((col) => (
                    <th key={col.key} style={{ border: "1px solid #e0e0e082", padding: "2px 6px" }}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f7fafd" }}>
                    {columns.map((col) => (
                     <td key={col.key} style={{ border: "1px solid #e0e0e082", padding: "2px 6px" }}>
                      {row[col.key] !== undefined && row[col.key] !== null && row[col.key] !== "" ? row[col.key] : "0"}
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

export default PostedPreview;