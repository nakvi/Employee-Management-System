import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const SalaryOverTimeSummaryReportPreview = ({ summaryData = [], reportHeading, dateFrom, dateTo }) => {
  useEffect(() => {
    console.log("summaryData received by component:", summaryData);
  }, [summaryData]);

  const formatNumber = (num) => {
    if (num === null || num === undefined) {
      return '-'; // Or any other placeholder for null/undefined numbers
    }
    const number = parseFloat(num);
    if (isNaN(number)) {
      return '-'; // Return '-' for non-numeric values
    }
    // If the number is 0, return '-' as per the example image
    if (number === 0) {
      return '-';
    }
    // Format to 2 decimal places and add commas for thousands
    return number.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  const grandTotals = useMemo(() => {
    return summaryData.reduce((acc, current) => {
      acc.strength += parseFloat(current.Strength || 0);
      acc.basicSalary += parseFloat(current.BasicSalary || 0);
      acc.workDays += parseFloat(current.MonthDays || 0);
      acc.earnedSalary += parseFloat(current.EarnedSalary || 0);
      acc.arrears += parseFloat(current.Arrears || 0);
      acc.allowance += parseFloat(current.Allowance || 0);
      acc.grossSalary += parseFloat(current.GrossSalary || 0);
      acc.eobi += parseFloat(current.EOBIAmount || 0);
      acc.pf += parseFloat(current.PFAmount || 0);
      acc.incomeTax += parseFloat(current.IncomeTax || 0);
      acc.healthInsur += parseFloat(current.Deduction4 || 0);
      acc.localSale += parseFloat(current.LocalSale || 0);
      acc.canteen += parseFloat(current.Canteen || 0);
      acc.advLoan += parseFloat(current.Deduction3 || 0);
      acc.totalDeduct += parseFloat(current.TotalDeduction || 0);
      acc.netPayable += parseFloat(current.NetPayable || 0);
      return acc;
    }, {
      strength: 0, basicSalary: 0, workDays: 0, earnedSalary: 0, arrears: 0,
      allowance: 0, grossSalary: 0, eobi: 0, pf: 0, incomeTax: 0, healthInsur: 0,
      localSale: 0, canteen: 0, advLoan: 0, totalDeduct: 0, netPayable: 0
    });
  }, [summaryData]);

  const handlePrintSummaryPDF = () => {
    if (!summaryData.length) return;

    const doc = new jsPDF('l', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Calculate totals
    let totalGross = 0, totalHours = 0, totalAmount = 0;
    summaryData.forEach(row => {
      totalGross += parseFloat(row.GrossSalary || 0);
      totalHours += parseFloat(row.Hours || 0);
      totalAmount += parseFloat(row.Amount || 0);
    });

    // Format function
    const fmt = (n) => (!n || n === 0 || n === "0" || n === "0.00") ? "-" : Number(n).toLocaleString();

    // Table headers
    const head = [[
      { content: "Sr#", styles: { fillColor: '#e1f5fe', halign: "center", lineColor: [230, 230, 230], lineWidth: 1, fontStyle: "bold" } },
      { content: "Department", styles: { fillColor: '#e1f5fe', halign: "left", lineColor: [230, 230, 230], lineWidth: 1, fontStyle: "bold" } },
      { content: "Gross Salary", styles: { fillColor: '#e1f5fe', halign: "right", lineColor: [230, 230, 230], lineWidth: 1, fontStyle: "bold" } },
      { content: "Hours", styles: { fillColor: '#e1f5fe', halign: "right", lineColor: [230, 230, 230], lineWidth: 1, fontStyle: "bold" } },
      { content: "Amount", styles: { fillColor: '#e1f5fe', halign: "right", lineColor: [230, 230, 230], lineWidth: 1, fontStyle: "bold" } },
    ]];

    // Table body
    const body = summaryData.map((row, idx) => [
      idx + 1,
      row.Department || "",
      fmt(row.GrossSalary),
      fmt(row.Hours),
      fmt(row.Amount)
    ]);

    // Grand totals row
    const foot = [[
      { content: "Totals :", colSpan: 2, styles: { halign: "right", fontStyle: "bold" } },
      { content: fmt(totalGross), styles: { fontStyle: "bold",  lineColor: [230, 230, 230], lineWidth: 1, halign: "right" } },
      { content: fmt(totalHours), styles: { fontStyle: "bold",  lineColor: [230, 230, 230], lineWidth: 1, halign: "right" } },
      { content: fmt(totalAmount), styles: { fontStyle: "bold", lineColor: [230, 230, 230], lineWidth: 1,  halign: "right" } },
    ]];

    let startY = 70;
    autoTable(doc, {
      startY,
      head,
      body,
      foot,
      theme: 'grid',
      headStyles: { fontSize: 8, lineColor: [230, 230, 230], lineWidth: 1, textColor: '#222', fillColor: '#e1f5fe', halign: 'center' },
      bodyStyles: { fontSize: 7, lineColor: [230, 230, 230], lineWidth: 1, textColor: '#222', halign: 'center' },
      footStyles: { fontSize: 8, lineColor: [230, 230, 230], lineWidth: 1, textColor: '#222', fillColor: '#e1f5fe', fontStyle: 'bold', halign: 'right' },
      columnStyles: {
        0: { cellWidth: 'auto', halign: 'center' },
        1: { cellWidth: 'auto', halign: 'left' },
        2: { cellWidth: 'auto', halign: 'right' },
        3: { cellWidth: 'auto', halign: 'right' },
        4: { cellWidth: 'auto', halign: 'right' },
      },
      margin: { left: 40, right: 40 },
      didDrawPage: function (data) {
        const pageWidth = doc.internal.pageSize.getWidth();

        // Draw custom header on all pages
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('Zeta Solutions Pvt Ltd', 40, 40);

        doc.setFontSize(12);
        const title = `OverTime Summary for the Month (${dateFrom ? new Date(dateFrom).toLocaleString('en-US', { year: 'numeric', month: 'long' }) : ''})`;
        const titleWidth = doc.getTextWidth(title);
        // const centerX = (pageWidth - titleWidth) / 2;
        doc.text(title, 40, 60);

        // Force space on all pages (very important)
        data.settings.margin.top = startY;
      }
    });

    // Page number bottom right
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 15, { align: 'right' });
    }

    window.open(doc.output("bloburl"), "_blank");
  };

  return (
    <div style={{
      margin: "30px auto",
      maxWidth: 'fit-content',
      background: "#fff",
      borderRadius: 8,
      boxShadow: "0 2px 12px #0001",
      padding: 24,
      overflowX: "auto"
    }}>
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <button onClick={handlePrintSummaryPDF} style={{ padding: "8px 20px", background: "#007bff", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 14 }}>
          Print Summary PDF
        </button>
      </div>

      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontWeight: "bold", fontSize: 20, marginBottom: 5 }}>Shafi Lifestyle (Pvt.) Ltd.</div>
        <div style={{ fontWeight: "bold", fontSize: 16, color: '#333' }}>
          {reportHeading || `Salary Summary for the Month (${dateFrom ? dateFrom.slice(0, 7) : new Date().getFullYear() + '-' + (new Date().getMonth() + 1).toString().padStart(2, '0')})`}
        </div>
      </div>

      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: 10,
        fontFamily: 'Arial, sans-serif'
      }}>
        <thead>
          <tr style={{ background: "#e1f5fe", color: "#fff", borderBottom: "2px solid #ccc", fontWeight: "bold" }}>
            <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Sr#</th>
            <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Department</th>
            <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Strength</th>
            <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Basic Salary</th>
            <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Work Days</th>
            <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Earned Salary</th>
            <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Arr.</th>
            <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Allow.</th>
            <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Gross Salary</th>
            <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>EOBI</th>
            <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>PF</th>
            <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Income Tax</th>
            <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Health Insur.</th>
            <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>L / Sale</th>
            <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Canteen</th>
            <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Adv / Loan</th>
            <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Total Deduct</th>
            <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Net Salary</th>
          </tr>
        </thead>
        <tbody>
          {summaryData.map((data, index) => (
            <tr key={index} style={{ background: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}>
              <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "center" }}>{index + 1}</td>
              <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "left" }}>{data.Department || ''}</td>
              <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(data.Strength)}</td>
              <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(data.BasicSalary)}</td>
              <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(data.MonthDays)}</td>
              <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(data.EarnedSalary)}</td>
              <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(data.Arrears)}</td>
              <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(data.Allowance)}</td>
              <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(data.GrossSalary)}</td>
              <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(data.EOBIAmount)}</td>
              <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(data.PFAmount)}</td>
              <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(data.IncomeTax)}</td>
              <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(data.Deduction4)}</td>
              <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(data.LocalSale)}</td>
              <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(data.Canteen)}</td>
              <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(data.Deduction3)}</td>
              <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(data.TotalDeduction)}</td>
              <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(data.NetPayable)}</td>
            </tr>
          ))}
          <tr style={{ background: "#EBF5FF", fontWeight: "bold" }}>
            <td colSpan="3" style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>Grand Totals :</td>
            <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(grandTotals.basicSalary)}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(grandTotals.workDays)}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(grandTotals.earnedSalary)}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(grandTotals.arrears)}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(grandTotals.allowance)}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(grandTotals.grossSalary)}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(grandTotals.eobi)}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(grandTotals.pf)}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(grandTotals.incomeTax)}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(grandTotals.healthInsur)}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(grandTotals.localSale)}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(grandTotals.canteen)}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(grandTotals.advLoan)}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(grandTotals.totalDeduct)}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(grandTotals.netPayable)}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 50, fontSize: 14 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ borderTop: "1px solid #000", width: "120px", margin: "10px auto 0" }}></div>
          <div>Prepared By</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ borderTop: "1px solid #000", width: "120px", margin: "10px auto 0" }}></div>
          <div>Checked By</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ borderTop: "1px solid #000", width: "120px", margin: "10px auto 0" }}></div>
          <div>Approved By</div>
        </div>
      </div>
    </div>
  );
};

export default SalaryOverTimeSummaryReportPreview;