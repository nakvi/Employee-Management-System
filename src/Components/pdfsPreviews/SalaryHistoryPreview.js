import React from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const SalaryHistoryPreview = ({ data = [], reportHeading, dateFrom, dateTo }) => {
  if (!data || data.length === 0) {
    return <div>No Salary Data Found for the selected filters.</div>;
  }

  // Only one employee for this report
  const employee = data[0];
  const attendance = employee.Attendance || [];

  // Helper to format numbers
  const formatNumber = (num) => {
    if (num === null || num === undefined || num === "" || isNaN(num)) return "-";
    return Number(num).toLocaleString("en-US", { minimumFractionDigits: 0 });
  };

  // Month name helper
  const getMonthYear = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString("en-GB", { month: "short", year: "numeric" });
  };

  // Calculate totals for each column
  const totals = attendance.reduce(
    (acc, att) => {
      acc.salaryWithAllow += Number(att.SalaryWithAllow || 0);
      acc.earnedSalary += Number(att.EarnedSalary || 0);
      acc.totalAllowances += Number(att.TotalAllowances || 0);
      acc.grossSalary += Number(att.GrossSalary || 0);
      acc.incomeTax += Number(att.IncomeTax || 0);
      acc.eobiAmount += Number(att.EOBIAmount || 0);
      acc.deduction += Number(att.Deduction || 0);
      acc.deduction1 += Number(att.Deduction1 || 0);

      // Calculate dedAmount for this row
      const dedAmount =
        Number(att.IncomeTax || 0) +
        Number(att.EOBIAmount || 0) +
        Number(att.Deduction || 0) +
        Number(att.Deduction1 || 0);

      // Other Deductions = TotalDeduction - (IncomeTax + EOBIAmount + Deduction + Deduction1)
      acc.otherDeductions += Math.max(0, Number(att.TotalDeduction || 0) - dedAmount);

      acc.totalDeduction += Number(att.TotalDeduction || 0);
      acc.netPayable += Number(att.NetPayable || 0);
      return acc;
    },
    {
      salaryWithAllow: 0,
      earnedSalary: 0,
      totalAllowances: 0,
      grossSalary: 0,
      incomeTax: 0,
      eobiAmount: 0,
      deduction: 0,
      deduction1: 0,
      otherDeductions: 0,
      totalDeduction: 0,
      netPayable: 0,
    }
  );

  // PDF Export
  const handlePrintPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Zeta Solutions Pvt Ltd", 20, 40);
    doc.setFontSize(12);
    doc.text("Employee Salary History", 20, 60);

    // Department
    doc.setFontSize(11);
    doc.setTextColor(200, 0, 0);
    doc.text(
      employee.Department ? employee.Department.toUpperCase() : "",
      20,
      80
    );
    doc.setTextColor(0, 0, 0);

    // Employee Info Row
    autoTable(doc, {
      startY: 90,
      head: [
        [
          "E-Code",
          employee.EmpCode || "",
          "Name",
          employee.EName || "",
          "Designation",
          employee.Designation || "",
          "D O J",
          employee.DOJ
            ? new Date(employee.DOJ).toLocaleDateString("en-GB")
            : "",
        ],
      ],
      theme: "grid",
      styles: { fontSize: 7.5, cellPadding: 3, valign: "middle" },
      headStyles: { fillColor: "#F7EDD4", textColor: 0, },
      bodyStyles: { lineColor: [230, 230, 230], lineWidth: 0.5 },
      columnStyles: {
        0: { fontStyle: "bold" },
        2: { fontStyle: "bold" },
        4: { fontStyle: "bold" },
        6: { fontStyle: "bold" },
      },
      margin: { left: 20, right: 20 },
    });

    // Table Data
    const tableBody = attendance.map((att, idx) => {
      const dedAmount =
        Number(att.IncomeTax || 0) +
        Number(att.EOBIAmount || 0) +
        Number(att.Deduction || 0) +
        Number(att.Deduction1 || 0);
      const othDed = Math.max(0, Number(att.TotalDeduction || 0) - dedAmount);

      return [
        idx + 1,
        getMonthYear(att.VDate),
        formatNumber(att.SalaryWithAllow || '-'),
        formatNumber(att.EarnedSalary || '-'),
        formatNumber(att.TotalAllowances || '-'),
        formatNumber(att.GrossSalary || '-'),
        formatNumber(att.IncomeTax || '-'),
        formatNumber(att.EOBIAmount || '-'),
        formatNumber(att.Deduction || '-'),
        formatNumber(att.Deduction1 || '-'),
        formatNumber(othDed || '-'),
        formatNumber(att.TotalDeduction || '-'),
        formatNumber(att.NetPayable || '-'),
      ];
    });

    // Totals Row
    const totalsRow = [
      { content: "Employee Totals :", colSpan: 2, styles: { halign: "right", fontStyle: "bold" } },
      formatNumber(totals.salaryWithAllow || '-'),
      formatNumber(totals.earnedSalary || '-'),
      formatNumber(totals.totalAllowances || '-'),
      formatNumber(totals.grossSalary || '-'),
      formatNumber(totals.incomeTax || '-'),
      formatNumber(totals.eobiAmount || '-'),
      formatNumber(totals.deduction || '-'),
      formatNumber(totals.deduction1 || '-'),
      formatNumber(totals.otherDeductions || '-'),
      formatNumber(totals.totalDeduction || '-'),
      formatNumber(totals.netPayable || '-'),
    ];

    // Table
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 0,
      head: [
        [
          "Srl#",
          "Month",
          "Monthly Salary",
          "Cal Salary",
          "Allowances",
          "Payable",
          "ITax",
          "EOBI",
          "Advance",
          "Loan",
          "Other Deductions",
          "Total Deductions",
          "NetPayable",
        ],
      ],
      body: tableBody,
      foot: [totalsRow],
      theme: "grid",
      styles: { fontSize: 7, cellPadding: 2, valign: "top", lineColor: [230, 230, 230], lineWidth: 0.5, overflow: 'visible', whiteSpace: 'nowrap', cellWidth: 'auto' },
      headStyles: { fillColor: "#e0f7fa", halign: "center", textColor: 0, lineColor: [230, 230, 230], lineWidth: 0.5 },
      bodyStyles: { lineColor: [230, 230, 230], lineWidth: 0.5 },
      footStyles: { fillColor: "#e0f7fa", fontStyle: "bold", halign: "right", textColor: 0, lineColor: [230, 230, 230], lineWidth: 0.5 },
      columnStyles: {
        0: { halign: "center" },
        1: { halign: "center" },
        2: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" },
        6: { halign: "right" },
        7: { halign: "right" },
        8: { halign: "right" },
        9: { halign: "right" },
        10: { halign: "right" },
        11: { halign: "right" },
        12: { halign: "right" },
      },
      margin: { left: 20, right: 20 },
      // tableWidth: "auto",
    });

    // Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    const totalPages = doc.internal.getNumberOfPages();
    const marginLeft = 10;
    const marginRight = 10;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - marginRight - 10, pageHeight - 15, { align: 'right' });
    }

    doc.setPage(totalPages);

    window.open(doc.output("bloburl"), "_blank");
  };

  // --- HTML Render ---
  return (
    <div
      style={{
        margin: "30px auto",
        maxWidth: 1200,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 12px #0001",
        padding: 24,
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: 18, marginBottom: 4 }}>
        Zeta Solutions Pvt Ltd
      </div>
      <div style={{ fontWeight: "bold", fontSize: 16, marginBottom: 12 }}>
        Employee Salary History
      </div>
      <div
        style={{
          marginBottom: 10,
          fontSize: 15,
          color: "#b00",
          fontWeight: "bold",
        }}
      >
        {employee.Department ? employee.Department.toUpperCase() : ""}
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: 10,
          fontSize: 13,
        }}
      >
        <tbody>
          <tr style={{ background: "#e1f5fe" }}>
            <td style={{ padding: "4px 8px" }}>
              <b>E-Code</b>
            </td>
            <td style={{ padding: "4px 8px" }}>{employee.EmpCode}</td>
            <td style={{ padding: "4px 8px" }}>
              <b>Name</b>
            </td>
            <td style={{ padding: "4px 8px" }}>{employee.EName}</td>
            <td style={{ padding: "4px 8px" }}>
              <b>Designation</b>
            </td>
            <td style={{ padding: "4px 8px" }}>{employee.Designation}</td>
            <td style={{ padding: "4px 8px" }}>
              <b>D O J</b>
            </td>
            <td style={{ padding: "4px 8px" }}>
              {employee.DOJ
                ? new Date(employee.DOJ).toLocaleDateString("en-GB")
                : ""}
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <button
          onClick={handlePrintPDF}
          style={{
            padding: "8px 20px",
            background: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Print Report PDF
        </button>
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 13,
        }}
      >
        <thead>
          <tr style={{ background: "#b2dfdb" }}>
            <th style={{ border: "1px solid #888", padding: "4px 6px" }}>Srl#</th>
            <th style={{ border: "1px solid #888", padding: "4px 6px" }}>Month</th>
            <th style={{ border: "1px solid #888", padding: "4px 6px" }}>Monthly Salary</th>
            <th style={{ border: "1px solid #888", padding: "4px 6px" }}>Calculated Salary</th>
            <th style={{ border: "1px solid #888", padding: "4px 6px" }}>Allowances</th>
            <th style={{ border: "1px solid #888", padding: "4px 6px" }}>Payable</th>
            <th style={{ border: "1px solid #888", padding: "4px 6px" }}>ITax</th>
            <th style={{ border: "1px solid #888", padding: "4px 6px" }}>EOBI</th>
            <th style={{ border: "1px solid #888", padding: "4px 6px" }}>Advance</th>
            <th style={{ border: "1px solid #888", padding: "4px 6px" }}>Loan</th>
            <th style={{ border: "1px solid #888", padding: "4px 6px" }}>Other Deductions</th>
            <th style={{ border: "1px solid #888", padding: "4px 6px" }}>Total Deductions</th>
            <th style={{ border: "1px solid #888", padding: "4px 6px" }}>NetPayable</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((att, idx) => (
            <tr
              key={att.VID}
              style={{ background: idx % 2 === 0 ? "#fff" : "#f7f7f7" }}
            >
              <td style={{ border: "1px solid #ccc", textAlign: "center" }}>{idx + 1}</td>
              <td style={{ border: "1px solid #ccc", textAlign: "center" }}>{getMonthYear(att.VDate)}</td>
              <td style={{ border: "1px solid #ccc", textAlign: "right" }}>{formatNumber(att.SalaryWithAllow)}</td>
              <td style={{ border: "1px solid #ccc", textAlign: "right" }}>{formatNumber(att.EarnedSalary)}</td>
              <td style={{ border: "1px solid #ccc", textAlign: "right" }}>{formatNumber(att.TotalAllowances)}</td>
              <td style={{ border: "1px solid #ccc", textAlign: "right" }}>{formatNumber(att.GrossSalary)}</td>
              <td style={{ border: "1px solid #ccc", textAlign: "right" }}>{formatNumber(att.IncomeTax)}</td>
              <td style={{ border: "1px solid #ccc", textAlign: "right" }}>{formatNumber(att.EOBIAmount)}</td>
              <td style={{ border: "1px solid #ccc", textAlign: "right" }}>{formatNumber(att.Deduction)}</td>
              <td style={{ border: "1px solid #ccc", textAlign: "right" }}>{formatNumber(att.Deduction1)}</td>
              <td style={{ border: "1px solid #ccc", textAlign: "right" }}>
                {formatNumber(
                  Number(att.TotalDeduction || 0) -
                  Number(att.Deduction || 0) -
                  Number(att.Deduction1 || 0)
                )}
              </td>
              <td style={{ border: "1px solid #ccc", textAlign: "right" }}>{formatNumber(att.TotalDeduction)}</td>
              <td style={{ border: "1px solid #ccc", textAlign: "right" }}>{formatNumber(att.NetPayable)}</td>
            </tr>
          ))}
          <tr style={{ background: "#f5f5f5", fontWeight: "bold" }}>
            <td colSpan={2} style={{ border: "1px solid #888", textAlign: "right" }}>
              Employee Totals :
            </td>
            <td style={{ border: "1px solid #888", textAlign: "right" }}>{formatNumber(totals.salaryWithAllow)}</td>
            <td style={{ border: "1px solid #888", textAlign: "right" }}>{formatNumber(totals.earnedSalary)}</td>
            <td style={{ border: "1px solid #888", textAlign: "right" }}>{formatNumber(totals.totalAllowances)}</td>
            <td style={{ border: "1px solid #888", textAlign: "right" }}>{formatNumber(totals.grossSalary)}</td>
            <td style={{ border: "1px solid #888", textAlign: "right" }}>{formatNumber(totals.incomeTax)}</td>
            <td style={{ border: "1px solid #888", textAlign: "right" }}>{formatNumber(totals.eobiAmount)}</td>
            <td style={{ border: "1px solid #888", textAlign: "right" }}>{formatNumber(totals.deduction)}</td>
            <td style={{ border: "1px solid #888", textAlign: "right" }}>{formatNumber(totals.deduction1)}</td>
            <td style={{ border: "1px solid #888", textAlign: "right" }}>{formatNumber(totals.otherDeductions)}</td>
            <td style={{ border: "1px solid #888", textAlign: "right" }}>{formatNumber(totals.totalDeduction)}</td>
            <td style={{ border: "1px solid #888", textAlign: "right" }}>{formatNumber(totals.netPayable)}</td>
          </tr>
        </tbody>
      </table>
      {/* Signatures */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: 50,
          fontSize: 14,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              borderTop: "1px solid #000",
              width: "120px",
              margin: "10px auto 0",
            }}
          ></div>
          <div>Prepared By</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              borderTop: "1px solid #000",
              width: "120px",
              margin: "10px auto 0",
            }}
          ></div>
          <div>Checked By</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              borderTop: "1px solid #000",
              width: "120px",
              margin: "10px auto 0",
            }}
          ></div>
          <div>Approved By</div>
        </div>
      </div>
    </div>
  );
};

export default SalaryHistoryPreview;