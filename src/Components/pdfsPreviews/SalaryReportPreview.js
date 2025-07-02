import React from "react";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const SalaryReportPreview = ({ allEmployees = [], reportHeading, dateFrom, dateTo }) => {

  console.log("All Employees for Report/PDF:", allEmployees);

  // Helper to format numbers for display (e.g., add commas, handle undefined/null)
  const formatNumber = (num) => {
    if (num === null || num === undefined || num === "") return "-";
    if (typeof num === 'string') {
      num = parseFloat(num.replace(/,/g, ''));
      if (isNaN(num)) return "-";
    }
    return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  // Group allEmployees by Department for both HTML preview and PDF
  const groupedByDepartment = allEmployees.reduce((acc, employee) => {
    const department = employee.Department || "Unknown Department";
    if (!acc[department]) {
      acc[department] = [];
    }
    acc[department].push(employee);
    return acc;
  }, {});

  // --- PDF Export Logic ---
  const handlePrintAllPDF = () => {
    if (!allEmployees.length) {
      console.warn("No employee data to print.");
      return;
    }

    // const doc = new jsPDF('l', 'pt', 'a4');
    const doc = new jsPDF('l', 'pt', 'letter');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let totalPages = 0;
    let firstPage = true;

    for (const departmentName in groupedByDepartment) {
      if (!firstPage) {
        doc.addPage();
      } else {
        firstPage = false;
      }

      const departmentEmployees = groupedByDepartment[departmentName];

      // Header for each department page
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      // doc.text('Shafi Lifestyle (Pvt.) Ltd.', pageWidth / 2, 40, { align: 'center' });
      doc.setFontSize(14);
      doc.text(`Salary Sheet for the Month (${dateFrom ? dateFrom.slice(0, 7) : new Date().getFullYear() + '-' + (new Date().getMonth() + 1).toString().padStart(2, '0')})`, pageWidth / 2, 60, { align: 'center' });
      doc.setFontSize(12);
      // doc.text(departmentName, pageWidth / 2, 80, { align: 'center' });

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Print Date: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 130, 40);
      doc.text(`Print Time: ${new Date().toLocaleTimeString('en-GB')}`, pageWidth - 130, 60);



      // --- IMPORTANT CHANGE HERE: Define grouped headers ---
      const departmentNameRow = [
        {
          content: departmentName, colSpan: 21, styles: {
            halign: 'left', fontSize: 9, fillColor: '#F7EDD4', textColor: '#222', lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5, cellPadding: 2, fontStyle: 'bold',
          }
        },
      ];
      const mainHeaders = [
        {
          content: 'Employee Profile', colSpan: 5, styles: {
            halign: 'center', fontSize: 6.5, fillColor: '#e1f5fe', textColor: '#222', lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
          }
        }, // Light Blue for main headers
        {
          content: 'Salary', colSpan: 3, styles: {
            halign: 'center', fontSize: 6.5, fillColor: '#e1f5fe', textColor: '#222', lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
          }
        },
        {
          content: 'Arr/Allow', colSpan: 2, styles: {
            halign: 'center', fontSize: 6.5, fillColor: '#e1f5fe', textColor: '#222', lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
          }
        },
        {
          content: 'Deductions', colSpan: 7, styles: {
            halign: 'center', fontSize: 6.5, fillColor: '#e1f5fe', textColor: '#222', lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
          }
        },
        {
          content: 'Payable', colSpan: 4, styles: {
            halign: 'center', fontSize: 6.5, fillColor: '#e1f5fe', textColor: '#222', lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
          }
        },
      ];

      // Sub Headers - NOW DEFINED WITH INDIVIDUAL CELL STYLES
      const subHeaders = [
        {
          content: "Srl #", styles: {
            fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', // <-- Comma added here
            fontSize: 6.5,
            halign: 'center',
            valign: 'middle',
            lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
            cellPadding: 2,
          }
        },
        {
          content: "E-Code", styles: {
            fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', // <-- Comma added here
            fontSize: 6.5,
            halign: 'center',
            valign: 'middle',
            lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
            cellPadding: 2,
          }
        },
        {
          content: "Employee Name", styles: {
            fillColor: '#e1f5fe', textColor: '#222', halign: 'left', fontStyle: 'bold', // <-- Comma added here
            fontSize: 6.5,
            halign: 'left',
            valign: 'middle',
            lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
            cellPadding: 2,
          }
        },
        {
          content: "Designation", styles: {
            fillColor: '#e1f5fe', textColor: '#222', halign: 'left', fontStyle: 'bold', // <-- Comma added here
            fontSize: 6.5,
            halign: 'left',
            valign: 'middle',
            lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
            cellPadding: 2,
          }
        },
        {
          content: "Date of Joining", styles: {
            fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', // <-- Comma added here
            fontSize: 6.5,
            halign: 'center',
            valign: 'middle',
            lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
            cellPadding: 2,
          }
        },
        {
          content: "Basic Salary", styles: {
            fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', // <-- Comma added here
            fontSize: 6.5,
            halign: 'center',
            valign: 'middle',
            lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
            cellPadding: 2,
          }
        },
        {
          content: "Work Days", styles: {
            fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', // <-- Comma added here
            fontSize: 6.5,
            halign: 'center',
            valign: 'middle',
            lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
            cellPadding: 2,
          }
        },
        {
          content: "Earned Salary", styles: {
            fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', // <-- Comma added here
            fontSize: 6.5,
            halign: 'center',
            valign: 'middle',
            lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
            cellPadding: 2,
          }
        },
        {
          content: "Arrears", styles: {
            fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', // <-- Comma added here
            fontSize: 6.5,
            halign: 'center',
            valign: 'middle',
            lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
            cellPadding: 2,
          }
        },
        {
          content: "Allowance", styles: {
            fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', // <-- Comma added here
            fontSize: 6.5,
            halign: 'center',
            valign: 'middle',
            lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
            cellPadding: 2,
          }
        },
        {
          content: "Gross Salary", styles: {
            fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', // <-- Comma added here
            fontSize: 6.5,
            halign: 'center',
            valign: 'middle',
            lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
            cellPadding: 2,
          }
        },
        {
          content: "EOBI", styles: {
            fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', // <-- Comma added here
            fontSize: 6.5,
            halign: 'center',
            valign: 'middle',
            lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
            cellPadding: 2,
          }
        },
        {
          content: "PF", styles: {
            fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', // <-- Comma added here
            fontSize: 6.5,
            halign: 'center',
            valign: 'middle',
            lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
            cellPadding: 2,
          }
        },
        {
          content: "Income Tax", styles: {
            fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', // <-- Comma added here
            fontSize: 6.5,
            halign: 'center',
            valign: 'middle',
            lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
            cellPadding: 2,
          }
        },
        {
          content: "Health Insur.", styles: {
            fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', // <-- Comma added here
            fontSize: 6.5,
            halign: 'center',
            valign: 'middle',
            lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
            cellPadding: 2,
          }
        },
        {
          content: "Canteen", styles: {
            fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', // <-- Comma added here
            fontSize: 6.5,
            halign: 'center',
            valign: 'middle',
            lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
            cellPadding: 2,
          }
        },
        {
          content: "L / Sale", styles: {
            fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', // <-- Comma added here
            fontSize: 6.5,
            halign: 'center',
            valign: 'middle',
            lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
            cellPadding: 2,
          }
        },
        {
          content: "Adv / Loan", styles: {
            fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', // <-- Comma added here
            fontSize: 6.5,
            halign: 'center',
            valign: 'middle',
            lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
            cellPadding: 2,
          }
        },
        {
          content: "Tot Deduct", styles: {
            fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', // <-- Comma added here
            fontSize: 6.5,
            halign: 'center',
            valign: 'middle',
            lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
            cellPadding: 2,
          }
        },
        {
          content: "Net Salary", styles: {
            fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', // <-- Comma added here
            fontSize: 6.5,
            halign: 'center',
            valign: 'middle',
            lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
            cellPadding: 2,
          }
        },
        {
          content: "Signature", styles: {
            fillColor: '#e1f5fe', textColor: '#222', halign: 'center', fontStyle: 'bold', // <-- Comma added here
            fontSize: 6.5,
            valign: 'middle',
            lineColor: [230, 230, 230], // Gray border
            lineWidth: 0.5,
            cellPadding: 2,
          }
        }
      ];
      // --- END IMPORTANT CHANGE ---

      const tableHeaders = [departmentNameRow, mainHeaders, subHeaders];
      // const tableHeaders = [subHeaders,departmentNameRow];

      const tableBody = departmentEmployees.map((employee, idx) => {
         const att = employee.Attendance?.[0] || {};

        const doj = att.DOJ ? new Date(att.DOJ).toLocaleDateString('en-GB') : '';
        const employeeName = att.EName?.replace(/\n/g, ' ') || '';
        const designation = att.Designation?.replace(/\n/g, ' ') || '';
        const advLoan = att.Deduction1 + att.Deduction2 || 0; 

        return [
          idx + 1,
          att.EmpCode || '',
          employeeName,
          designation,
          doj,
          formatNumber(att.SalaryWithAllow || '-'),
          formatNumber(att.SalaryDays || '-'),
          formatNumber(att.EarnedSalary || '-'),
          formatNumber(att.Arrears || '-'), // Now separate
          formatNumber(att.TotalAllowances || '-'), // Now separate
          formatNumber(att.GrossSalary || '-'),
          formatNumber(att.EOBIAmount || '-'),
          formatNumber(att.PFAmount || '-'),
          formatNumber(att.IncomeTax || '-'),
          formatNumber(att.Deduction3 || '-'),
          formatNumber(att.Canteen || '-'),
          formatNumber(att.LocalSale || '-'),
          advLoan ? formatNumber(advLoan) : '-',
          formatNumber(att.TotalDeduction || '-'),
          formatNumber(att.NetPayable || '-'),
          att.Signature || ''
        ];
      });

      // Recalculate department totals based on new column structure
      const departmentTotals = departmentEmployees.reduce((acc, employee) => {
        const att = employee.Attendance?.[0] || {};
        const advLoan = (parseFloat(att.Deduction1 || 0) + parseFloat(att.Deduction2 || 0));
        acc.salaryWithAllow += parseFloat(att.SalaryWithAllow || 0);
        acc.earnedSalary += parseFloat(att.EarnedSalary || 0);
        acc.arrears += parseFloat(att.Arrears || 0);
        acc.totalAllowances += parseFloat(att.TotalAllowances || 0);
        acc.grossSalary += parseFloat(att.GrossSalary || 0);
        acc.eobi += parseFloat(att.EOBIAmount || 0);
        acc.pf += parseFloat(att.PFAmount || 0);
        acc.incomeTax += parseFloat(att.IncomeTax || 0);
        acc.healthInsur += parseFloat(att.Deduction3 || 0);
        acc.canteen += parseFloat(att.Canteen || 0);
        acc.lSale += parseFloat(att.LocalSale || 0);
        acc.advLoan += advLoan;
        acc.totDeduct += parseFloat(att.TotalDeduction || 0);
        acc.netSalary += parseFloat(att.NetPayable || 0);
        return acc;
      }, {
        salaryWithAllow: 0, earnedSalary: 0, arrears: 0, totalAllowances: 0, grossSalary: 0, eobi: 0, pf: 0,
        incomeTax: 0, healthInsur: 0, canteen: 0, lSale: 0, advLoan: 0,
        totDeduct: 0, netSalary: 0
      });

      // Adjust tableFoot for the new header structure (20 columns instead of 19 from before)
      const tableFoot = [[
        { content: 'Department Totals :', colSpan: 5, styles: { fontStyle: 'bold', halign: 'right' } },
        formatNumber(departmentTotals.salaryWithAllow || '-'),
        '', // Empty for Work Days
        formatNumber(departmentTotals.earnedSalary || '-'),
        formatNumber(departmentTotals.arrears || '-'), // Now separate
        formatNumber(departmentTotals.totalAllowances || '-'), // Now separate
        formatNumber(departmentTotals.grossSalary || '-'),
        formatNumber(departmentTotals.eobi || '-'),
        formatNumber(departmentTotals.pf || '-'),
        formatNumber(departmentTotals.incomeTax || '-'),
        formatNumber(departmentTotals.healthInsur || '-'),
        formatNumber(departmentTotals.canteen || '-'),
        formatNumber(departmentTotals.lSale || '-'),
        formatNumber(departmentTotals.advLoan || '-'),
        formatNumber(departmentTotals.totDeduct || '-'),
        formatNumber(departmentTotals.netSalary || '-'),
        '' // Empty for signature
      ]];


     autoTable(doc, {
      startY: 70,
      tableWidth: 'auto',
      head: tableHeaders,
      body: tableBody,
      foot: tableFoot,
      theme: 'grid',
      headStyles: [
        { fontStyle: 'bold', fontSize: 6.5, halign: 'center', valign: 'middle', lineColor: [230,    230, 230], lineWidth: 0.5, cellPadding: 2 },
        { fontStyle: 'bold', fontSize: 6.5, halign: 'center', valign: 'middle', lineColor: [230,    230, 230], lineWidth: 0.5, cellPadding: 2 }
      ],
      bodyStyles: {
        fontSize: 6,
        valign: 'top',
        lineColor: [220, 220, 220],
        lineWidth: 0.5,
      },
      alternateRowStyles: { fillColor: '' },
      footStyles: {
        fillColor: '#e1f5fe',
        textColor: '#222',
        fontStyle: 'bold',
        fontSize: 6,
        halign: 'right',
        valign: 'top',
        lineColor: [230, 230, 230],
        lineWidth: 0.5,
      },
      margin: { left: 10, right: 10, top: 70, bottom: 80 },
      columnStyles: {
        0: { cellWidth: 'auto', halign: 'center' },   // Srl #
        1: { cellWidth: 'auto', halign: 'center' },   // E-Code
        2: { cellWidth: 'auto', halign: 'left' },     // Employee Name
        3: { cellWidth: 'auto', halign: 'left' },     // Designation
        4: { cellWidth: 'auto', halign: 'center' },   // Date of Joining
        5: { cellWidth: 'auto', halign: 'right' },    // Basic Salary
        6: { cellWidth: 'auto', halign: 'center' },   // Work Days
        7: { cellWidth: 'auto', halign: 'right' },    // Earned Salary
        8: { cellWidth: 'auto', halign: 'right' },    // Arrears
        9: { cellWidth: 'auto', halign: 'right' },    // Allowance
        10: { cellWidth: 'auto', halign: 'right' },   // Gross Salary
        11: { cellWidth: 'auto', halign: 'right' },   // EOBI
        12: { cellWidth: 'auto', halign: 'right' },   // PF
        13: { cellWidth: 'auto', halign: 'right' },   // Income Tax
        14: { cellWidth: 'auto', halign: 'right' },   // Health Insur.
        15: { cellWidth: 'auto', halign: 'right' },   // Canteen
        16: { cellWidth: 'auto', halign: 'right' },   // L / Sale
        17: { cellWidth: 'auto', halign: 'right' },   // Adv / Loan
        18: { cellWidth: 'auto', halign: 'right' },   // Tot Deduct
        19: { cellWidth: 'auto', halign: 'right' }    // Net Salary
        // Signature column (20) default (center)
      },
      didDrawPage: function (data) {
        const signatureY = doc.internal.pageSize.height - 40;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Prepared By', data.settings.margin.left + 50, signatureY);
        doc.text('Checked By', pageWidth / 2, signatureY, { align: 'center' });
        doc.text('Approved By', pageWidth - data.settings.margin.right - 50, signatureY, {    align: 'right' });
      }
    });
    }
    totalPages = doc.internal.getNumberOfPages();

    // Loop through all pages to update the page number
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal'); // Set font for page number text
      const pageText = 'Page ' + i + ' of ' + totalPages;
      // Position the page number (adjust if needed)
      doc.text(pageText,  pageWidth - 100, pageHeight - 15, { align: 'right' });
    }
    window.open(doc.output("bloburl"), "_blank");
  };



  // Let's create the HTML version of the headers to match the PDF.
  const htmlTableHeaders = (
    <>
      {/* First Row: Grouped Headers */}
      <tr style={{ background: "#F7EDD4", borderBottom: "2px solid #ccc", fontWeight: "bold" }}>
        <th colSpan="5" style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Employee Profile</th>
        <th colSpan="3" style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Salary</th>
        <th colSpan="2" style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Arr/Allow</th>
        <th colSpan="7" style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Deductions</th>
        <th colSpan="3" style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Payable</th>
      </tr>
      {/* Second Row: Sub-Headers */}
      <tr style={{ background: "#e1f5fe", borderBottom: "2px solid #ccc" }}>
        <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Srl #</th>
        <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>E-Code</th>
        <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Employee Name</th>
        <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Designation</th>
        <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Date of Joining</th>
        <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Basic Salary</th>
        <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Work Days</th>
        <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Earned Salary</th>
        <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Arrears</th> {/* NEW */}
        <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Allowance</th> {/* NEW */}
        <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Gross Salary</th>
        <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>EOBI</th>
        <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>PF</th>
        <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Income Tax</th>
        <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Health Insur.</th>
        <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Canteen</th>
        <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>L / Sale</th>
        <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Adv / Loan</th>
        <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Tot Deduct</th>
        <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Net Salary</th>
        <th style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}>Signature</th>
      </tr>
    </>
  );


  // Data check: If no data is found at all, display a message.
  if (!allEmployees || allEmployees.length === 0) {
    return (
      <div style={{ margin: "0 auto", maxWidth: 1100 }}>
        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 2px 12px #0001", padding: 40, textAlign: "center" }}>
          <h4>No Salary Data Found for the selected filters.</h4>
        </div>
      </div>
    );
  }

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
      {/* Print All PDF Button */}
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <button onClick={handlePrintAllPDF} style={{ padding: "8px 20px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 14 }}>
          Print Report PDF
        </button>
      </div>

      {/* Loop through departments for HTML display */}
      {Object.keys(groupedByDepartment).map((departmentName, depIdx) => {
        const departmentEmployees = groupedByDepartment[departmentName];
        // Recalculate department totals for HTML based on new column structure
        const departmentTotals = departmentEmployees.reduce((acc, employee) => {
          acc.earnedSalary += parseFloat(employee.EarnedSalary || 0);
          acc.arrears += parseFloat(employee.Arrears || 0); // Separate
          acc.allowance += parseFloat(employee.Allowance || 0); // Separate
          acc.grossSalary += parseFloat(employee.GrossSalary || 0);
          acc.eobi += parseFloat(employee.EOBIAmount || 0);
          acc.pf += parseFloat(employee.PFAmount || 0);
          acc.incomeTax += parseFloat(employee.IncomeTax || 0);
          acc.healthInsur += parseFloat(employee.Deduction4 || 0);
          acc.canteen += parseFloat(employee.Canteen || 0);
          acc.lSale += parseFloat(employee.LocalSale || 0);
          acc.advLoan += parseFloat(employee.Deduction3 || 0);
          acc.totDeduct += parseFloat(employee.TotalDeduction || 0);
          acc.netSalary += parseFloat(employee.NetPayable || 0);
          return acc;
        }, {
          earnedSalary: 0, arrears: 0, allowance: 0, grossSalary: 0, eobi: 0, pf: 0,
          incomeTax: 0, healthInsur: 0, canteen: 0, lSale: 0, advLoan: 0,
          totDeduct: 0, netSalary: 0
        });

        return (
          <div key={departmentName} style={{ marginBottom: '40px', pageBreakAfter: 'always' }}>
            {/* Header for each department section in HTML */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontWeight: "bold", fontSize: 20, marginBottom: 5 }}>Shafi Lifestyle (Pvt.) Ltd.</div>
              <div style={{ fontWeight: "bold", fontSize: 16, color: '#333' }}>
                Salary Sheet for the Month ({dateFrom ? dateFrom.slice(0, 7) : new Date().getFullYear() + '-' + (new Date().getMonth() + 1).toString().padStart(2, '0')})
              </div>
              <div style={{ fontWeight: "normal", fontSize: 14, color: '#555' }}>{departmentName}</div>
            </div>

            {/* Main Salary Report Table for HTML Preview */}
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 10,
              fontFamily: 'Arial, sans-serif'
            }}>
              <thead>
                {htmlTableHeaders} {/* Use the defined HTML headers */}
              </thead>
              <tbody>
                {departmentEmployees.map((employee, index) => (
                  <tr key={employee.EmpID || index} style={{ background: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}>
                    <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "center" }}>{index + 1}</td>
                    <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "center" }}>{employee.EmpCode || ''}</td>
                    <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "left" }}>{employee.EName || ''}</td>
                    <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "left" }}>{employee.Designation || ''}</td>
                    <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "center" }}>{employee.DOJ ? new Date(employee.DOJ).toLocaleDateString('en-GB') : ''}</td>
                    <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(employee.BasicSalary)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "center" }}>{formatNumber(employee.WorkingDays)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(employee.EarnedSalary)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(employee.Arrears)}</td> {/* NEW */}
                    <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(employee.Allowance)}</td> {/* NEW */}
                    <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(employee.GrossSalary)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(employee.EOBIAmount)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(employee.PFAmount)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(employee.IncomeTax)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(employee.Deduction4)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(employee.Canteen)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(employee.LocalSale)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(employee.Deduction3)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(employee.TotalDeduction)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "right" }}>{formatNumber(employee.NetPayable)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "6px 4px", textAlign: "center" }}>{employee.Signature || ''}</td>
                  </tr>
                ))}
                {/* Department Totals Row - Adjust colSpan for the new column count (21 columns) */}
                <tr style={{ background: "#e0f2f1", fontWeight: "bold" }}>
                  <td colSpan="7" style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>Department Totals :</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(departmentTotals.earnedSalary)}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(departmentTotals.arrears)}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(departmentTotals.allowance)}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(departmentTotals.grossSalary)}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(departmentTotals.eobi)}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(departmentTotals.pf)}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(departmentTotals.incomeTax)}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(departmentTotals.healthInsur)}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(departmentTotals.canteen)}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(departmentTotals.lSale)}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(departmentTotals.advLoan)}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(departmentTotals.totDeduct)}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "right" }}>{formatNumber(departmentTotals.netSalary)}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px 4px", textAlign: "center" }}></td> {/* Empty for Signature */}
                </tr>
              </tbody>
            </table>
          </div>
        );
      })}

      {/* Signatures Section (outside department loop) */}
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

export default SalaryReportPreview;