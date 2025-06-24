import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const SalarySummaryReportPreview = ({ summaryData = [], reportHeading, dateFrom, dateTo }) => {
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
    if (!summaryData.length) {
      console.warn("No summary data to print.");
      return;
    }

    const doc = new jsPDF('l', 'pt', 'a4'); // 'l' for landscape
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Calculate the report month string
    const displayMonth = dateFrom ? new Date(dateFrom).toLocaleString('en-US', { year: 'numeric', month: 'long' }) : 'Current Month';

    // --- Header Function for All Pages ---
    const addHeader = (doc, pageNumber) => {
      // Company Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      // doc.text('Shafi Lifestyle (Pvt.) Ltd.', pageWidth / 2, 40, { align: 'center' });

      // Report Heading
      doc.setFontSize(14);
      doc.text(reportHeading || `Salary Summary for the Month (${displayMonth})`, pageWidth / 2, 60, { align: 'center' });

      // Print Date & Time
      doc.setFontSize(9);
      // doc.setFont('helvetica', 'normal');
      // doc.text(`Print Date: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 130, 40);
      // doc.text(`Print Time: ${new Date().toLocaleTimeString('en-GB')}`, pageWidth - 130, 60);

      // You can also add page number here if you want it in the header area
      // doc.text(`Page ${pageNumber}`, pageWidth - 50, 20); // Example
    };
    // --- End Header Function ---

    const summaryHeaders = [
      // ... (Your existing summaryHeaders array with styles) ...
      { content: "Sr#", styles: { fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', fontSize: 8, valign: 'middle', lineColor: [180, 180, 180], lineWidth: 0.3, cellPadding: 2 } },
      { content: "Department", styles: { fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', fontSize: 8, valign: 'middle', lineColor: [180, 180, 180], lineWidth: 0.3, cellPadding: 2 } },
      { content: "Strength", styles: { fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', fontSize: 8, valign: 'middle', lineColor: [180, 180, 180], lineWidth: 0.3, cellPadding: 2 } },
      { content: "Basic Salary", styles: { fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', fontSize: 8, valign: 'middle', lineColor: [180, 180, 180], lineWidth: 0.3, cellPadding: 2 } },
      { content: "Work Days", styles: { fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', fontSize: 8, valign: 'middle', lineColor: [180, 180, 180], lineWidth: 0.3, cellPadding: 2 } },
      { content: "Earned Salary", styles: { fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', fontSize: 8, valign: 'middle', lineColor: [180, 180, 180], lineWidth: 0.3, cellPadding: 2 } },
      { content: "Arr.", styles: { fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', fontSize: 8, valign: 'middle', lineColor: [180, 180, 180], lineWidth: 0.3, cellPadding: 2 } },
      { content: "Allow.", styles: { fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', fontSize: 8, valign: 'middle', lineColor: [180, 180, 180], lineWidth: 0.3, cellPadding: 2 } },
      { content: "Gross Salary", styles: { fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', fontSize: 8, valign: 'middle', lineColor: [180, 180, 180], lineWidth: 0.3, cellPadding: 2 } },
      { content: "EOBI", styles: { fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', fontSize: 8, valign: 'middle', lineColor: [180, 180, 180], lineWidth: 0.3, cellPadding: 2 } },
      { content: "PF", styles: { fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', fontSize: 8, valign: 'middle', lineColor: [180, 180, 180], lineWidth: 0.3, cellPadding: 2 } },
      { content: "Income Tax", styles: { fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', fontSize: 8, valign: 'middle', lineColor: [180, 180, 180], lineWidth: 0.3, cellPadding: 2 } },
      { content: "Health Insur.", styles: { fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', fontSize: 8, valign: 'middle', lineColor: [180, 180, 180], lineWidth: 0.3, cellPadding: 2 } },
      { content: "L / Sale", styles: { fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', fontSize: 8, valign: 'middle', lineColor: [180, 180, 180], lineWidth: 0.3, cellPadding: 2 } },
      { content: "Canteen", styles: { fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', fontSize: 8, valign: 'middle', lineColor: [180, 180, 180], lineWidth: 0.3, cellPadding: 2 } },
      { content: "Adv / Loan", styles: { fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', fontSize: 8, valign: 'middle', lineColor: [180, 180, 180], lineWidth: 0.3, cellPadding: 2 } },
      { content: "Total Deduct", styles: { fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', fontSize: 8, valign: 'middle', lineColor: [180, 180, 180], lineWidth: 0.3, cellPadding: 2 } },
      { content: "Net Salary", styles: { fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', fontSize: 8, valign: 'middle', lineColor: [180, 180, 180], lineWidth: 0.3, cellPadding: 2 } }
    ];

    const tableBody = summaryData.map((data, idx) => {
      return [
        idx + 1,
        data.Department || '',
        formatNumber(data.Strength),
        formatNumber(data.BasicSalary),
        formatNumber(data.MonthDays),
        formatNumber(data.EarnedSalary),
        formatNumber(data.Arrears),
        formatNumber(data.Allowance),
        formatNumber(data.GrossSalary),
        formatNumber(data.EOBIAmount),
        formatNumber(data.PFAmount),
        formatNumber(data.IncomeTax),
        formatNumber(data.Deduction4),
        formatNumber(data.LocalSale),
        formatNumber(data.Canteen),
        formatNumber(data.Deduction3),
        formatNumber(data.TotalDeduction),
        formatNumber(data.NetPayable)
      ];
    });

    const tableFoot = [[
      '', // This will correspond to Sr# (column 0)
      '', // This will correspond to Department (column 1)
      { content: 'Grand Totals :    ', styles: { fontStyle: 'bold', halign: 'right' } }, // This will be in Strength (column 2)
      formatNumber(grandTotals.basicSalary), // Basic Salary (column 3)
      formatNumber('-'), // Work Days (column 4)
      formatNumber(grandTotals.earnedSalary), // Earned Salary (column 5)
      formatNumber(grandTotals.arrears), // Arr. (column 6)
      formatNumber(grandTotals.allowance), // Allow. (column 7)
      formatNumber(grandTotals.grossSalary), // Gross Salary (column 8)
      formatNumber(grandTotals.eobi), // EOBI (column 9)
      formatNumber(grandTotals.pf), // PF (column 10)
      formatNumber(grandTotals.incomeTax), // Income Tax (column 11)
      formatNumber(grandTotals.healthInsur), // Health Insur. (column 12)
      formatNumber(grandTotals.localSale), // L / Sale (column 13)
      formatNumber(grandTotals.canteen), // Canteen (column 14)
      formatNumber(grandTotals.advLoan), // Adv / Loan (column 15)
      formatNumber(grandTotals.totalDeduct), // Total Deduct (column 16)
      formatNumber(grandTotals.netPayable) // Net Salary (column 17)
    ]];

    // --- Call autoTable with didDrawPage hook ---
    autoTable(doc, {
      startY: 70,
      head: [summaryHeaders],
      body: tableBody,
      // foot: tableFoot,
      theme: 'grid',

      headStyles: {
        fillColor: [32, 178, 170],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
        halign: 'center',
        valign: 'middle',
        lineColor: [180, 180, 180],
        lineWidth: 0.3,
        cellPadding: 2,
      },
      bodyStyles: {
        fontSize: 7,
        halign: 'center',
        valign: 'middle',
        lineColor: [220, 220, 220],
        lineWidth: 0.3,
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: '#f9f9f9',
      },
      // footStyles: {
      //     fillColor: '#e1f5fe',
      //     textColor: '#222',
      //     fontStyle: 'bold',
      //     fontSize: 7,
      //     halign: 'right',
      //     valign: 'middle',
      //     lineColor: [180, 180, 180],
      //     lineWidth: 0.3,
      //     cellPadding: 2,
      // },
      margin: { left: 10, right: 10, top: 70, bottom: 60 },
      columnStyles: {
        0: { cellWidth: 25, halign: 'center' },
        1: { cellWidth: 80, halign: 'left' },
        2: { cellWidth: 40, halign: 'right' },
        3: { cellWidth: 55, halign: 'right' },
        4: { cellWidth: 30, halign: 'right' },
        5: { cellWidth: 45, halign: 'right' },
        6: { cellWidth: 40, halign: 'right' },
        7: { cellWidth: 40, halign: 'right' },
        8: { cellWidth: 60, halign: 'right' },
        9: { cellWidth: 35, halign: 'right' },
        10: { cellWidth: 45, halign: 'right' },
        11: { cellWidth: 40, halign: 'right' },
        12: { cellWidth: 40, halign: 'right' },
        13: { cellWidth: 45, halign: 'right' },
        14: { cellWidth: 40, halign: 'right' },
        15: { cellWidth: 50, halign: 'right' },
        16: { cellWidth: 55, halign: 'right' },
        17: { cellWidth: 55, halign: 'right' },
      },
      // This hook runs on every page
      didDrawPage: function (data) {
        addHeader(doc, data.pageNumber); // Call the header function

        // const signatureY = doc.internal.pageSize.height - 40;
        // doc.setFontSize(9);
        // doc.setFont('helvetica', 'normal');

        // doc.text('Prepared By', data.settings.margin.left + 50, signatureY);
        // doc.text('Checked By', pageWidth / 2, signatureY, { align: 'center' });
        // doc.text('Approved By', pageWidth - data.settings.margin.right - 50, signatureY, { align: 'right' });

        // // Page number at the bottom center of each page
        // doc.setFontSize(8);
        // `data.pageCount` is available within didDrawPage to get total pages
        // const pageText = `Page ${data.pageNumber} of ${data.pageCount}`; 
        // doc.text(pageText, pageWidth / 2, pageHeight - 15, { align: 'center' });
      },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 2,
      body: tableFoot,
      theme: 'grid',
      styles: {
        fillColor: '#e1f5fe',
        textColor: '#222',
        fontStyle: 'bold',
        fontSize: 7,
        halign: 'right', // Default alignment for numbers
        valign: 'middle',
        lineColor: [180, 180, 180],
        // lineWidth: 0,
        cellPadding: 2,
      },
      columnStyles: {
        // These MUST EXACTLY match the main table's column widths.
        0:  { cellWidth: 25, lineWidth: { right: 0 } },
        1:  { cellWidth: 40, lineWidth: { right: 0 } },
        2:  { cellWidth: 80, lineWidth: { left:  0 } , halign: 'right' },  // Strength (where 'Grand Totals :' text now lives)
        3:  { cellWidth: 55, lineWidth: 0.5 , halign: 'right' }, // Basic Salary
        4:  { cellWidth: 30, lineWidth: 0.5 , halign: 'right' }, // Work Days
        5:  { cellWidth: 45, lineWidth: 0.5 , halign: 'right' }, // Earned Salary
        6:  { cellWidth: 40, lineWidth: 0.5 , halign: 'right' }, // Arr.
        7:  { cellWidth: 40, lineWidth: 0.5 , halign: 'right' }, // Allow.
        8:  { cellWidth: 60, lineWidth: 0.5 , halign: 'right' }, // Gross Salary
        9:  { cellWidth: 35, lineWidth: 0.5 , halign: 'right' }, // EOBI
        10: { cellWidth: 45, lineWidth: 0.5 , halign: 'right' }, // PF
        11: { cellWidth: 40, lineWidth: 0.5 , halign: 'right' }, // Income Tax
        12: { cellWidth: 40, lineWidth: 0.5 , halign: 'right' }, // Health Insur.
        13: { cellWidth: 45, lineWidth: 0.5 , halign: 'right' }, // L / Sale
        14: { cellWidth: 40, lineWidth: 0.5 , halign: 'right' }, // Canteen
        15: { cellWidth: 50, lineWidth: 0.5 , halign: 'right' }, // Adv / Loan
        16: { cellWidth: 55, lineWidth: 0.5 , halign: 'right' }, // Total Deduct
        17: { cellWidth: 55, lineWidth: 0.5 , halign: 'right' }, // Net Salary
      },
      // Set margin for this table to match the main table's margin
      margin: { left: 10, right: 10 },
    });

    const totalPages = doc.internal.getNumberOfPages();

    // Define margins based on what autoTable would have used (from your margin option)
    const marginLeft = 10; // From your autoTable margin: { left: 10, ... }
    const marginRight = 10; // From your autoTable margin: { ..., right: 10, ... }

    // Loop through all pages to update the total page count (Right aligned)
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      // Change: X-coordinate to be pageWidth - marginRight - some_offset, and align: 'right'
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - marginRight - 10, pageHeight - 15, { align: 'right' }); // Adjusted X-pos for right alignment
    }

    // Draw signatures ONLY on the last page
    doc.setPage(totalPages); // Go to the very last page

    const signatureTextY = doc.internal.pageSize.height - 40; // Y-position for the text (e.g., "Prepared By")
    const lineLength = 100; // Adjusted line length to make it fit better, you can change this
    const lineY = signatureTextY - 8; // Y-position for the line, slightly above the text and more space

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    // --- Signature 1: Prepared By ---
    // Calculate the center X for 'Prepared By' text: marginLeft + 50
    // To center the line on this text, line starts at (center X - half line length) and ends at (center X + half line length)
    const preparedByTextCenterX = marginLeft + 50 + (doc.getStringUnitWidth('Prepared By') * doc.internal.getFontSize() / 2); // Calculate center of text
    const preparedByLineStartX = preparedByTextCenterX - (lineLength / 2);
    const preparedByLineEndX = preparedByTextCenterX + (lineLength / 2);
    doc.line(preparedByLineStartX, lineY, preparedByLineEndX, lineY);
    doc.text('Prepared By', marginLeft + 50, signatureTextY); // Text position remains the same

    // --- Signature 2: Checked By ---
    // 'Checked By' text is already centered on pageWidth / 2
    const checkedByLineStartX = (pageWidth / 2) - (lineLength / 2);
    const checkedByLineEndX = (pageWidth / 2) + (lineLength / 2);
    doc.line(checkedByLineStartX, lineY, checkedByLineEndX, lineY);
    doc.text('Checked By', pageWidth / 2, signatureTextY, { align: 'center' }); // Text position remains the same

    // --- Signature 3: Approved By ---
    // Calculate the center X for 'Approved By' text (right aligned): pageWidth - marginRight - 50
    // We need to find the "logical" center of the right-aligned text to center the line above it.
    const approvedByTextEndX = pageWidth - marginRight - 50; // This is the right-most point of the text
    const approvedByTextWidth = doc.getStringUnitWidth('Approved By') * doc.internal.getFontSize();
    const approvedByTextCenterX = approvedByTextEndX - (approvedByTextWidth / 2); // Calculate center of text
    const approvedByLineStartX = approvedByTextCenterX - (lineLength / 2);
    const approvedByLineEndX = approvedByTextCenterX + (lineLength / 2);
    doc.line(approvedByLineStartX, lineY, approvedByLineEndX, lineY);
    doc.text('Approved By', approvedByTextEndX, signatureTextY, { align: 'right' }); // Text position remains the same
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

export default SalarySummaryReportPreview;