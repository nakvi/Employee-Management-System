import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const SalaryFinalSettlementPreview = ({ allEmployees = [], reportHeading, dateFrom, dateTo }) => {

    useEffect(() => {
      console.log("allEmployees received by component:", allEmployees);
    }, [allEmployees]);

  const handlePrintFinalSettlement = () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginLeft = 40;

    const data = allEmployees[0];
    const amountInWords = "Two hundred twenty-two thousand seven hundred forty-nine and xx / 100";

    const fmt = (val) => (val === 0 || val === "0" || val === null || val === "-" ? "-" : val.toLocaleString());

    // ---------- TITLE ----------
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text("Zeta Solutions Pvt Ltd", pageWidth / 2, 40, { align: "center" });

    doc.setFontSize(10);
    doc.text("FINAL SETTLEMENT FORM", pageWidth / 2, 60, { align: "center" });

    // ---------- EMPLOYEE INFO ----------
    autoTable(doc, {
      startY: 75,
      theme: 'plain',
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fontStyle: 'bold' },
      margin: { left: marginLeft, right: marginLeft },
      body: [
        [
          { content: "No.", styles: { fontStyle: 'bold' } },
          { content: "-" },
          { content: "Code", styles: { fontStyle: 'bold' } },
          { content: data.EmpCode },
          { content: "Date", styles: { fontStyle: 'bold' } },
          { content: `-${new Date(data.VDate).toLocaleString('en-US', { month: 'short', year: 'numeric' })}` }
        ],
        [
          { content: "Mr. (Name of Employee):", styles: { fontStyle: 'bold' } },
          { content: data.EName, colSpan: 2 },
          { content: "Father Name:", styles: { fontStyle: 'bold' } },
          { content: data.FName, colSpan: 2 }
        ],
        [
          { content: "Designation:", styles: { fontStyle: 'bold' } },
          { content: data.Designation },
          { content: "Department:", styles: { fontStyle: 'bold' } },
          { content: data.Department },
          { content: "Rate of Pay Rs.:", styles: { fontStyle: 'bold' } },
          { content: fmt(data.BasicSalary) }
        ],
        [
          { content: "Date of Joining:", styles: { fontStyle: 'bold' } },
          { content: new Date(data.DOJ).toLocaleDateString() },
          { content: "Date of Leaving:", styles: { fontStyle: 'bold' } },
          { content: new Date(data.DOL).toLocaleDateString() },
          { content: "Tenure:", styles: { fontStyle: 'bold' } },
          { content: data.ServicePeriod }
        ],
        [
          { content: "With Gratuity / PF:", styles: { fontStyle: 'bold' } },
          { content: fmt(data.Gratuity), colSpan: 5 }
        ],
        [
          { content: "Service of the named employee has been dispensed because of", colSpan: 6 , styles: { cellPadding: 4 } },
        ]
      ],
      didParseCell: function (data) {
        const { cell, row, column } = data;
        const isLabel = cell.raw?.styles?.fontStyle === 'bold';
        if (!isLabel) {
          // Draw underline (bottom border only)
          cell.styles.lineWidth = { top: 0, right: 0, bottom: 0.5, left: 0 };
          cell.styles.lineColor = [0, 0, 0];
          cell.styles.cellPadding = { top: 4, right: 0, bottom: 4, left: 0 };
        } else {
          // No border for labels
          cell.styles.lineWidth = 0;
          cell.styles.cellPadding = { top: 4, right: 0, bottom: 4, left: 0 };
        }
      }
    });


     // ----- TABLE HEADINGS -----
  const paymentRows = [
    ["Salary M/O", fmt(data.BasicSalary)],
    ["Days", `${data.SalaryDays}  Rs. ${fmt(data.EarnedSalary)}`],
    ["Over Time", `-  Rs. -`],
    ["Gratuity / PF", fmt(data.Gratuity)],
    ["Leave Encashment", fmt(data.LeaveEncashment)]
  ];

  const deductionRows = [
    ["Others", "Rs. -"],
    ["Loan Advance", `Rs. ${fmt(data.LoanBalance)}`],
    ["Notice Pay", "Rs. -"]
  ];

  // ----- AUTO TABLE LAYOUT -----
  autoTable(doc, {
    startY: 190,
    theme: 'grid',
    head: [['Payments', 'Amount', 'Deductions', 'Amount']],
    body: Array.from({ length: 5 }, (_, i) => [
      paymentRows[i]?.[0] || '',
      paymentRows[i]?.[1] || '',
      deductionRows[i]?.[0] || '',
      deductionRows[i]?.[1] || ''
    ]),
    styles: { fontSize: 8, cellPadding: 5 },
    headStyles: { fillColor: '#e1f5fe', textColor: 20, fontStyle: 'bold' , halign: 'center' , lineWidth: 1, lineColor: [230, 230, 230]},
    columnStyles: {
      1: { halign: 'right' },
      3: { halign: 'right' }
    },
    tableWidth: 'auto',
    margin: { left: marginLeft, right: marginLeft }
  });

  const afterTableY = doc.lastAutoTable.finalY;
  doc.setFontSize(9);
  // ----- Total Payable -----
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Payable Amount Rs.`, pageWidth - 240, afterTableY + 25);
  doc.text(fmt(data.NetPayable), pageWidth - 80, afterTableY + 25, { align: 'right' });

  // ----- Amount in Words -----
  doc.setFont('helvetica', 'bold');
  doc.text("Amount In Words: ", marginLeft, afterTableY + 55);
  doc.text(amountInWords, marginLeft + 80, afterTableY + 55);

  // ----- Signatures -----
  doc.setFont('helvetica', 'normal');
  const signY = afterTableY + 130;

  doc.line(marginLeft, signY, marginLeft + 120, signY);
  doc.text("Prepared By", marginLeft, signY + 15 , { fontSize: 7 });

  doc.line(pageWidth / 2 - 70, signY, pageWidth / 2 + 70, signY);
  doc.text("Checked By", pageWidth / 2 - 20, signY + 15 , { fontSize: 7 });
  doc.text("Manager HR", pageWidth / 2 - 15, signY + 30 , { fontSize: 7 });

  doc.line(pageWidth - 170, signY, pageWidth - 40, signY);
  doc.text("Approved By", pageWidth - 130, signY + 15, { fontSize: 7 });

  // ----- Acknowledgement -----
  const footerY = signY + 100;
  doc.text(`I have received Rs. ${fmt(data.NetPayable)} from Zeta Solutions Pvt Ltd; No further demands of any kind from company are remaining.`, marginLeft, footerY , { fontSize: 7 });

  doc.line(marginLeft, footerY + 50, marginLeft + 240, footerY + 50);
  doc.text("RECIPIENT (Signature / Thumb Impression)", marginLeft, footerY + 65 , { fontSize: 7 });

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
          <button onClick={handlePrintFinalSettlement} style={{ padding: "6px 18px", background: "#00796b", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
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
   
    </div>
  );
};

export default SalaryFinalSettlementPreview;