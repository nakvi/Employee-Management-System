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

  const handlePrintAllPDF = () => {
    if (!allEmployees.length) {
        console.warn("No employee data to print.");
        return;
    }

    const doc = new jsPDF('l', 'pt', 'letter');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const selectedMonth = dateFrom
        ? dateFrom.slice(0, 7)
        : new Date().getFullYear() + '-' + (new Date().getMonth() + 1).toString().padStart(2, '0');

    const subHeaders = [
        "Srl #", "Code", "Name", "Hire Date", "Monthly Salary",
        "Incrmt", "Cal. Salary", "Alwns", "G Salary", "OT", "Tot Payable", "I-Tax/EOBI",
        "Adv Ded", "Canteen", "Tot Dedu", "PP LW OF HD AB", "Net Payable", "Signature"
    ].map(text => ({
        content: text,
        styles: {
            fillColor: '#e1f5fe',
            textColor: '#222',
            halign: 'center',
            fontStyle: 'bold',
            fontSize: 6.5,
            valign: 'middle',
            lineColor: [230, 230, 230],
            lineWidth: 0.5,
            cellPadding: 1.5,
        }
    }));

    const commonColumnStyles = {
        0: { cellWidth: 15, halign: 'center' },  // Srl #
        1: { cellWidth: 25, halign: 'left' },    // Code
        2: { cellWidth: 90, halign: 'left' },    // Name
        3: { cellWidth: 45, halign: 'center' },  // Hire Date
        4: { cellWidth: 38, halign: 'right' },   // Monthly Salary
        5: { cellWidth: 38, halign: 'right' },   // Incrmt
        6: { cellWidth: 38, halign: 'right' },   // Cal. Salary
        7: { cellWidth: 38, halign: 'right' },   // Alwns
        8: { cellWidth: 38, halign: 'right' },   // G Salary
        9: { cellWidth: 38, halign: 'right' },   // OT
        10: { cellWidth: 38, halign: 'right' },  // Tot Payable
        11: { cellWidth: 38, halign: 'right' },  // I-Tax/EOBI
        12: { cellWidth: 38, halign: 'right' },  // Adv Ded
        13: { cellWidth: 38, halign: 'right' },  // Canteen
        14: { cellWidth: 38, halign: 'right' },  // Tot Dedu
        15: { cellWidth: 65, halign: 'center' }, // PP LW OF HD AB
        16: { cellWidth: 55, halign: 'right' },  // Net Payable
        17: { cellWidth: 60, halign: 'left' },   // Signature
    };

    // Group employees by department
    const groupedByDepartment = allEmployees.reduce((acc, employee) => {
        const department = employee.Department || "Unknown Department";
        if (!acc[department]) acc[department] = [];
        acc[department].push(employee);
        return acc;
    }, {});

    // Initialize grand totals
    let grandTotals = {
        BasicSalary: 0, Increment: 0, EarnedSalary: 0, Allowance: 0, GrossSalary: 0, OverTime: 0, SalaryWithAllow: 0,
        IncomeTax: 0, EOBIAmount: 0, AdvDed: 0, Canteen: 0, TotalDeduction: 0, NetPayable: 0,
        PPDays: 0, Annual: 0, Casual: 0, Sick: 0, GHDays: 0, FHDays: 0, WEDays: 0, HDDay: 0, ABDays: 0
    };

    const allTableData = [];

    let srl = 1;

    for (const departmentName in groupedByDepartment) {
        const departmentEmployees = groupedByDepartment[departmentName];

        // Department header row
        allTableData.push([{
            content: departmentName,
            colSpan: 18,
            styles: {
                halign: 'left',
                fontSize: 9,
                fillColor: '#F7EDD4',
                textColor: '#222',
                lineColor: [230, 230, 230],
                lineWidth: 0.5,
                cellPadding: 1.5,
                fontStyle: 'bold',
            }
        }]);

        // Department totals accumulator
        let deptTotals = {
            BasicSalary: 0, Increment: 0, EarnedSalary: 0, Allowance: 0, GrossSalary: 0, OverTime: 0, SalaryWithAllow: 0,
            IncomeTax: 0, EOBIAmount: 0, AdvDed: 0, Canteen: 0, TotalDeduction: 0, NetPayable: 0,
            PPDays: 0, Annual: 0, Casual: 0, Sick: 0, GHDays: 0, FHDays: 0, WEDays: 0, HDDay: 0, ABDays: 0
        };

        // Data rows
        const rows = departmentEmployees.map((emp, idx) => {
            const att = emp.Attendance?.[0] || {};
            deptTotals.BasicSalary += parseFloat(att.SalaryWithAllow || 0);
            deptTotals.Increment += parseFloat(att.Increment || 0);
            deptTotals.EarnedSalary += parseFloat(att.EarnedSalary || 0);
            deptTotals.Allowance += parseFloat(att.TotalAllowances || 0);
            deptTotals.GrossSalary += parseFloat(att.GrossSalary || 0) - parseFloat(att.TotalOverTimeRs || 0);
            deptTotals.OverTime += parseFloat(att.TotalOverTimeRs || 0);
            deptTotals.SalaryWithAllow += parseFloat(att.GrossSalary || 0);
            deptTotals.IncomeTax += parseFloat(att.IncomeTax || 0);
            deptTotals.EOBIAmount += parseFloat(att.EOBIAmount || 0);
            deptTotals.AdvDed += parseFloat((att.TotalDeduction || 0) - (att.Canteen || 0));
            deptTotals.Canteen += parseFloat(att.Canteen || 0);
            deptTotals.TotalDeduction += parseFloat(att.TotalDeduction || 0);
            deptTotals.NetPayable += parseFloat(att.NetPayable || 0);

            // For PP LW OF HD AB
            deptTotals.PPDays += parseFloat(att.PPDays || 0);
            deptTotals.Annual += parseFloat(att.Annual || 0);
            deptTotals.Casual += parseFloat(att.Casual || 0);
            deptTotals.Sick += parseFloat(att.Sick || 0);
            deptTotals.GHDays += parseFloat(att.GHDays || 0);
            deptTotals.FHDays += parseFloat(att.FHDays || 0);
            deptTotals.WEDays += parseFloat(att.WEDays || 0);
            deptTotals.HDDay += parseFloat(att.HDDay || 0);
            deptTotals.ABDays += parseFloat(att.ABDays || 0);

            const lw = (parseFloat(att.Annual || 0) + parseFloat(att.Casual || 0) + parseFloat(att.Sick || 0));
            const of = (parseFloat(att.GHDays || 0) + parseFloat(att.FHDays || 0) + parseFloat(att.WEDays || 0));
            const advDed = (parseFloat(att.TotalDeduction || 0) + parseFloat(att.Canteen || 0));
            return [
                idx + 1,
                `${emp.EmpCode || ''}`,
                { 
                  content: `${emp.EName?.replace(/\n/g, ' ') || ''} \n (${emp.Designation?.replace(/\n/g, ' ') || ''})`,
                  styles: { fontSize: 6 } 
                },
                emp.DOJ || '',
                formatNumber(att.SalaryWithAllow || '-'),
                formatNumber(att.Increment || '-'),
                formatNumber(att.EarnedSalary || '-'),
                formatNumber(att.TotalAllowances || '-'),
                formatNumber((att.GrossSalary || 0) - (att.TotalOverTimeRs || 0)),
                formatNumber(att.TotalOverTimeRs || '-'),
                formatNumber(att.GrossSalary || '-'),
                `${formatNumber(att.IncomeTax || '-')}\n${formatNumber(att.EOBIAmount || '-')}`,
                advDed ? formatNumber(advDed) : '-',
                formatNumber(att.Canteen || '-'),
                formatNumber(att.TotalDeduction || '-'),
                `${formatNumber(att.PPDays)}:${lw || 0}:${of || 0}:${formatNumber(att.HDDay || 0)}:${formatNumber(att.ABDays || 0)}`,
                formatNumber(att.NetPayable || '-'),
                emp.NIC || '-'
            ];
        });

        // Add department rows
        allTableData.push(...rows);

        // Department Totals for "PP LW OF HD AB"
        const deptLW = deptTotals.Annual + deptTotals.Casual + deptTotals.Sick;
        const deptOF = deptTotals.GHDays + deptTotals.FHDays + deptTotals.WEDays;
        const deptPPCol = `${formatNumber(deptTotals.PPDays)} : ${deptLW || 0} : ${deptOF || 0} : ${formatNumber(deptTotals.HDDay)} : ${formatNumber(deptTotals.ABDays)}`;

        // Add department totals row
        allTableData.push([
            { content: `Total for ${departmentName} : `, colSpan: 4, styles: { fontSize: 7, fontStyle: 'bold', halign: 'right', fillColor: '#e1f5fe', textColor: '#222' } },
            formatNumber(deptTotals.BasicSalary || '-'),
            formatNumber(deptTotals.Increment || '-'),
            formatNumber(deptTotals.EarnedSalary || '-'),
            formatNumber(deptTotals.Allowance || '-'),
            formatNumber(deptTotals.GrossSalary || '-'),
            formatNumber(deptTotals.OverTime || '-'),
            formatNumber(deptTotals.SalaryWithAllow || '-'),
            { content: `${formatNumber(deptTotals.IncomeTax || '-')}\n${formatNumber(deptTotals.EOBIAmount || '-')}`, styles: { cellWidth: 35, halign: 'right' } },
            formatNumber(deptTotals.AdvDed || '-'),
            formatNumber(deptTotals.Canteen || '-'),
            formatNumber(deptTotals.TotalDeduction || '-'),
            '',
            // deptPPCol, // <-- Show department totals for PP LW OF HD AB
            formatNumber(deptTotals.NetPayable || '-'),
            '' // Signature
        ]);

        // Add to grand totals (same as before)
        Object.keys(grandTotals).forEach(key => {
            if (deptTotals[key] !== undefined) {
                grandTotals[key] += deptTotals[key];
            }
        });
    }


    // Add grand totals row at the end
    const grandLW = (grandTotals.Annual || 0) + (grandTotals.Casual || 0) + (grandTotals.Sick || 0);
    const grandOF = (grandTotals.GHDays || 0) + (grandTotals.FHDays || 0) + (grandTotals.WEDays || 0);
    const grandPPCol = `${formatNumber(grandTotals.PPDays)} : ${grandLW || 0} : ${grandOF || 0} : ${formatNumber(grandTotals.HDDay)} : ${formatNumber(grandTotals.ABDays)}`;

    allTableData.push([
        { content: 'Grand Totals:', colSpan: 4, styles: { fontStyle: 'bold', halign: 'right', fillColor: '#e1f5fe', textColor: '#222' } },
        formatNumber(grandTotals.BasicSalary || '-'),
        formatNumber(grandTotals.Increment || '-'),
        formatNumber(grandTotals.EarnedSalary || '-'),
        formatNumber(grandTotals.Allowance || '-'),
        formatNumber(grandTotals.GrossSalary || '-'),
        formatNumber(grandTotals.OverTime || '-'),
        formatNumber(grandTotals.SalaryWithAllow || '-'),
        { content: `${formatNumber(grandTotals.IncomeTax || '-')}\n${formatNumber(grandTotals.EOBIAmount || '-')}`, styles: { cellWidth: 35, halign: 'right' } },
        formatNumber(grandTotals.AdvDed || '-'),
        formatNumber(grandTotals.Canteen || '-'),
        formatNumber(grandTotals.TotalDeduction || '-'),
        '',
        // grandPPCol, // <-- Show grand totals for PP LW OF HD AB
        formatNumber(grandTotals.NetPayable || '-'),
        '' // Signature
    ]);

    autoTable(doc, {
        startY: 70,
        head: [subHeaders],
        body: allTableData,
        theme: 'grid',
        margin: { top: 75, bottom: 90, left: 10, right: 10 },
        columnStyles: commonColumnStyles,
        headStyles: {
            fillColor: '#e1f5fe',
            textColor: '#222',
            halign: 'center',
            fontStyle: 'bold',
            fontSize: 6.5,
            valign: 'top',
            lineColor: [230, 230, 230],
            lineWidth: 0.5,
            cellPadding: 1.5,
        },
        bodyStyles: {
            fontSize: 6,
            cellPadding: 2.5,
            halign: 'center',
            valign: 'top',
            lineColor: [220, 220, 220],
            lineWidth: 0.5,
        },
        footStyles: {
            fillColor: '#e1f5fe',
            textColor: '#222',
            fontSize: 6,
            halign: 'center',
            valign: 'top',
            lineColor: [230, 230, 230],
            lineWidth: 0.5,
        },
        didDrawPage: function (data) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.text(`Salary Sheet for the Month (${selectedMonth})`, pageWidth / 2, 60, { align: 'center' });

            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.text(`Print Date: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 130, 65);

            const y = doc.internal.pageSize.height - 60;
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.text('Prepared By', data.settings.margin.left + 50, y);
            doc.text('Checked By', pageWidth / 2, y, { align: 'center' });
            doc.text('Approved By', pageWidth - data.settings.margin.right - 50, y, { align: 'right' });

            doc.setFontSize(8);
            const totalPages = doc.internal.getNumberOfPages();
            doc.text(`Page ${data.pageNumber} of ${totalPages}`, pageWidth - 100, pageHeight - 15, { align: 'right' });
          }
    });

    window.open(doc.output("bloburl"), "_blank");
};
  

//   const handlePrintAllPDF = () => {
//     if (!allEmployees.length) {
//         console.warn("No employee data to print.");
//         return;
//     }

//     const doc = new jsPDF('l', 'pt', 'letter');
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();

//     const selectedMonth = dateFrom
//         ? dateFrom.slice(0, 7)
//         : new Date().getFullYear() + '-' + (new Date().getMonth() + 1).toString().padStart(2, '0');

//     const subHeaders = [
//         "Srl #", "Code Name", "Hire Date", "Monthly Salary",
//         "Incrmt", "Cal. Salary", "Alwns", "G Salary", "OT", "Tot Payable", "I-Tax/EOBI",
//         "Adv Ded", "Canteen", "Tot Dedu", "PP LW OF HD AB", "Net Payable  Signature"
//     ].map(text => ({
//         content: text,
//         styles: {
//             fillColor: '#e1f5fe',
//             textColor: '#222',
//             halign: 'center',
//             fontStyle: 'bold',
//             fontSize: 6,
//             valign: 'top',
//             lineColor: [230, 230, 230],
//             lineWidth: 0.5,
//             cellPadding: 1.5,
//         }
//     }));

//     // Define common column styles for all data rows and subheaders
//       const commonColumnStyles = {
//           0: { cellWidth: 15, halign: 'center' },  // Srl #
//           1: { cellWidth: 90, halign: 'left' },    // Code Name
//           2: { cellWidth: 45, halign: 'center' },  // Hire Date
//           3: { cellWidth: 35, halign: 'right' },   // Monthly Salary
//           4: { cellWidth: 35, halign: 'right' },   // Incrmt
//           5: { cellWidth: 35, halign: 'right' },   // Cal. Salary
//           6: { cellWidth: 35, halign: 'right' },   // Alwns
//           7: { cellWidth: 35, halign: 'right' },   // G Salary
//           8: { cellWidth: 35, halign: 'right' },   // OT
//           9: { cellWidth: 35, halign: 'right' },   // Tot Payable
//           10: { cellWidth: 35, halign: 'right' },  // I-Tax/EOBI
//           11: { cellWidth: 35, halign: 'right' },  // Adv Ded
//           12: { cellWidth: 35, halign: 'right' },  // Canteen
//           13: { cellWidth: 35, halign: 'right' },  // Tot Dedu
//           14: { cellWidth: 65, halign: 'center' }, // PP LW OF HD AB
//           15: { cellWidth: 100, halign: 'left' },  // Net Payable
//       };


//     // Initialize totalGrossSalary and totalNetPayable outside the loop
//     let overallTotals = {
//         BasicSalary: 0,  earnedSalary: 0, arrears: 0, allowance: 0, grossSalary: 0,  OverTime: 0,  SalaryWithAllow: 0,
//         eobi: 0, pf: 0, incomeTax: 0, healthInsur: 0, canteen: 0,
//         lSale: 0, advLoan: 0, totalDeduction: 0, netPayable: 0
//     };

//     const allTableData = [];

//     for (const departmentName in groupedByDepartment) {
//         const departmentEmployees = groupedByDepartment[departmentName];

//         const deptHeader = [{
//             content: departmentName,
//             colSpan: 21, // Span all 21 columns
//             styles: {
//                 halign: 'left',
//                 fontSize: 9,
//                 fillColor: '#F7EDD4',
//                 textColor: '#222',
//                 lineColor: [230, 230, 230],
//                 lineWidth: 0.5,
//                 cellPadding: 1.5,
//                 fontStyle: 'bold',
//             }
//         }];

//           const totals = departmentEmployees.reduce((acc, emp) => {
//               const att = emp.Attendance?.[0] || {};

//               acc.BasicSalary += parseFloat(att.BasicSalary || 0);
//               acc.Increment += parseFloat(att.Increment || 0);
//               acc.earnedSalary += parseFloat(att.EarnedSalary || 0);
//               acc.allowance += parseFloat(att.TotalAllowances || 0);
//               acc.grossSalary += parseFloat(att.GrossSalary || 0);
//               acc.OverTime += parseFloat(att.OverTime || 0);
//               acc.SalaryWithAllow += parseFloat(att.SalaryWithAllow || 0);
//               acc.eobi += parseFloat(att.EOBIAmount || 0);
//               acc.pf += parseFloat(att.PFAmount || 0);
//               acc.incomeTax += parseFloat(att.IncomeTax || 0);
//               acc.healthInsur += parseFloat(att.Deduction4 || 0);
//               acc.canteen += parseFloat(att.Canteen || 0);
//               acc.lSale += parseFloat(att.LocalSale || 0);
//               acc.advLoan += parseFloat(att.Deduction3 || 0);
//               acc.totalDeduction += parseFloat(att.TotalDeduction || 0);
//               acc.netPayable += parseFloat(att.NetPayable || 0);

//               return acc;
//           }, {
//               BasicSalary: 0, earnedSalary: 0, Increment: 0, allowance: 0, grossSalary: 0, OverTime: 0, SalaryWithAllow: 0,
//               eobi: 0, pf: 0, incomeTax: 0, healthInsur: 0, canteen: 0,
//               lSale: 0, advLoan: 0, totalDeduction: 0, netPayable: 0
//           });

//         // Accumulate to overall totals
//         overallTotals.BasicSalary += totals.BasicSalary;
//         overallTotals.Increment += totals.Increment;
//         overallTotals.earnedSalary += totals.earnedSalary;
//         overallTotals.allowance += totals.allowance;
//         overallTotals.grossSalary += totals.grossSalary;
//         overallTotals.OverTime += totals.OverTime || 0;
//         overallTotals.SalaryWithAllow += totals.SalaryWithAllow || 0;
//         overallTotals.eobi += totals.eobi;
//         overallTotals.pf += totals.pf;
//         overallTotals.incomeTax += totals.incomeTax;
//         overallTotals.healthInsur += totals.healthInsur;
//         overallTotals.canteen += totals.canteen;
//         overallTotals.lSale += totals.lSale;
//         overallTotals.advLoan += totals.advLoan;
//         overallTotals.totalDeduction += totals.totalDeduction;
//         overallTotals.netPayable += totals.netPayable;

//         const rows = departmentEmployees.map((emp, idx) => {
//           const doj = emp.DOJ ? new Date(emp.DOJ).toLocaleDateString('en-GB') : '';
//           const att = emp.Attendance?.[0] || {};

//           const incomeTax = parseFloat(att.IncomeTax || 0);
//           const eobi = parseFloat(att.EOBIAmount || 0);
//           const advDed = parseFloat(att.Deduction3 || 0);
//           const canteen = parseFloat(att.Canteen || 0);
//           const totalDedu = parseFloat(att.TotalDeduction || 0);

//           return [
//             idx + 1,
//             `${emp.EmpCode || ''} - ${emp.EName?.replace(/\n/g, ' ') || ''} (${emp.Designation?.replace(/\n/g, ' ') || ''})`,
//             doj,
//             formatNumber(att.BasicSalary),
//             formatNumber(att.Increment),
//             formatNumber(att.EarnedSalary),
//             formatNumber(att.TotalAllowances),
//             formatNumber(att.GrossSalary),
//             formatNumber(att.OverTime || 0),
//             formatNumber(att.SalaryWithAllow || 0),
//             `${incomeTax}\n${eobi}`,
//             formatNumber(advDed),
//             formatNumber(canteen),
//             formatNumber(totalDedu),
//             `${att.PPDays || '0'} : ${att.LW || '0'} : ${att.OF || '0'} : ${att.HDDays || '0'} : ${att.ABDays || '0'}`,
//             formatNumber(att.NetPayable),
//             emp.Signature || ''
//           ];
//         });

//         const footer = [[
//             { content: 'Department Totals:', colSpan: 3, styles: { fontStyle: 'bold', halign: 'right' , fillColor: '#e1f5fe', textColor: '#222' } },
//             formatNumber(totals.BasicSalary),
//             formatNumber(totals.Increment),
//             formatNumber(totals.earnedSalary),
//             formatNumber(totals.allowance),
//             formatNumber(totals.grossSalary),
//             formatNumber(totals.OverTime || 0),
//             formatNumber(totals.SalaryWithAllow || 0),
//             { content: `${formatNumber(totals.incomeTax)}\n${formatNumber(totals.eobi)}`, styles: { cellWidth: 35, halign: 'right' } },
//             formatNumber(totals.incomeTax),
//             formatNumber(totals.healthInsur),
//             formatNumber(totals.canteen),
//             formatNumber(totals.lSale),
//             formatNumber(totals.advLoan),
//             formatNumber(totals.totalDeduction),
//             formatNumber(totals.netPayable),
//             '' // For signature column
//         ]];

//         allTableData.push(deptHeader, ...rows, ...footer); // Add department header, rows, and footer to main data
//     }

//     // Add grand totals row at the end
//     const grandTotalFooter = [[
//         { content: 'Grand Totals:', colSpan: 3, styles: { fontStyle: 'bold', halign: 'right', fillColor: '#e1f5fe', textColor: '#222' } },
//         formatNumber(overallTotals.BasicSalary),
//         formatNumber(overallTotals.Increment),
//         formatNumber(overallTotals.earnedSalary),
//         formatNumber(overallTotals.allowance),
//         formatNumber(overallTotals.grossSalary),
//         formatNumber(overallTotals.OverTime || 0),
//         formatNumber(overallTotals.SalaryWithAllow || 0),
//         { content: `${formatNumber(overallTotals.incomeTax)}\n${formatNumber(overallTotals.eobi)}`, styles: { cellWidth: 35, halign: 'right' } },
//         formatNumber(overallTotals.incomeTax),
//         formatNumber(overallTotals.healthInsur),
//         formatNumber(overallTotals.canteen),
//         formatNumber(overallTotals.lSale),
//         formatNumber(overallTotals.advLoan),
//         formatNumber(overallTotals.totalDeduction),
//         formatNumber(overallTotals.netPayable),
//         '' // For signature column
//     ]];

//     allTableData.push(...grandTotalFooter);


//     autoTable(doc, {
//         startY: 70, // Start below the main title
//         head: [subHeaders], // This will be the recurring header for all pages
//         body: allTableData, // All department data + grand totals
//         theme: 'grid',
//         margin: { top: 75, bottom: 60, left: 10, right: 10 }, // Adjust top margin to account for main header
//         columnStyles: commonColumnStyles,
//         headStyles: {
//             // Apply subHeader styles directly here as well to ensure consistency
//             fillColor: '#e1f5fe',
//             textColor: '#222',
//             halign: 'center',
//             fontStyle: 'bold',
//             fontSize: 6.5,
//             valign: 'top',
//             lineColor: [230, 230, 230],
//             lineWidth: 0.5,
//             cellPadding: 1.5,
//         },
//         bodyStyles: {
//             fontSize: 6.5,
//             halign: 'center', // Default for body cells
//             valign: 'top',
//             lineColor: [220, 220, 220],
//             lineWidth: 0.5,
//         },
//         footStyles: {
//             fillColor: '#e1f5fe',
//             textColor: '#222',
//             fontSize: 6.5,
//             halign: 'center',
//             valign: 'top',
//             lineColor: [230, 230, 230],
//             lineWidth: 0.5,
//         },
//         didDrawPage: function (data) {
//             // Draw the main page header on every page
//             doc.setFont('helvetica', 'bold');
//             doc.setFontSize(12);
//             doc.text(`Salary Sheet for the Month (${selectedMonth})`, pageWidth / 2, 60, { align: 'center' });

//             doc.setFontSize(9);
//             doc.setFont('helvetica', 'normal');
//             doc.text(`Print Date: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 130, 65);
//             // doc.text(`Print Time: ${new Date().toLocaleTimeString('en-GB')}`, pageWidth - 130, 60);

//             // Footer for Prepared/Checked/Approved
//             const y = doc.internal.pageSize.height - 40;
//             doc.setFontSize(9);
//             doc.setFont('helvetica', 'normal');
//             doc.text('Prepared By', data.settings.margin.left + 50, y);
//             doc.text('Checked By', pageWidth / 2, y, { align: 'center' });
//             doc.text('Approved By', pageWidth - data.settings.margin.right - 50, y, { align: 'right' });

//             // Page numbers
//             doc.setFontSize(8);
//             doc.text(`Page ${data.pageNumber} of ${data.pageCount}`, pageWidth - 100, pageHeight - 15, { align: 'right' });
//         }
//     });

//     window.open(doc.output("bloburl"), "_blank");
// };


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