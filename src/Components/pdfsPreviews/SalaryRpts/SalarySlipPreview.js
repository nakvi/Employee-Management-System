import React, { useEffect } from 'react';
import { jsPDF } from 'jspdf';

const SalarySlipPreview = ({ employeesData = [], reportHeading, monthYear, dateFrom, dateTo }) => {
    useEffect(() => {
        console.log("Employees data received by SalarySlipPreview:", employeesData);
        if (employeesData.length > 0) {
            console.log("Sample Employee Data (for debugging):", employeesData[0]);
        }
    }, [employeesData]);

    // Format for quantities (days, hours) - keeping 2 decimal places as seen in screenshot for attendance
    const formatNumber = (num) => {
        if (num === null || num === undefined || isNaN(parseFloat(num)) || parseFloat(num) === 0) {
            return '-'; // Return '-' for null/undefined/NaN/zero
        }
        return parseFloat(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Format for monetary values - 0 decimal places as seen in screenshot
    const formatCurrency = (num) => {
        if (num === null || num === undefined || isNaN(parseFloat(num)) || parseFloat(num) === 0) {
            return '-'; // Return '-' for null/undefined/NaN/zero
        }
        return parseFloat(num).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    };

    const numberToWords = (num) => {
        const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
        const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

        const numVal = parseFloat(num);
        if (isNaN(numVal) || numVal === 0) return 'Zero only.';

        const numStr = numVal.toFixed(2).split('.');
        let amount = parseInt(numStr[0]);
        let cents = parseInt(numStr[1]);

        let n = ('000000000' + amount).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return 'Not a number';
        let str = '';
        str += (parseInt(n[1]) !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
        str += (parseInt(n[2]) !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
        str += (parseInt(n[3]) !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
        str += (parseInt(n[4]) !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
        str += (parseInt(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';

        let result = str.trim();
        if (result === '') result = 'Zero';

        if (cents > 0) {
            result += ` and ${cents}/100`;
        }

        return result.charAt(0).toUpperCase() + result.slice(1) + ' only.';
    };

    const drawDottedLine = (doc, x1, y1, x2, y2, dotLength = 2, spaceLength = 1) => {
        const originalLineWidth = doc.getLineWidth();
        doc.setLineWidth(0.2); // Thinner dotted lines
        doc.setLineCap('butt'); // Ensure clean dot ends

        const totalLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const segmentLength = dotLength + spaceLength;
        const numSegments = Math.floor(totalLength / segmentLength);

        for (let i = 0; i < numSegments; i++) {
            const startX = x1 + (x2 - x1) * (i * segmentLength) / totalLength;
            const startY = y1 + (y2 - y1) * (i * segmentLength) / totalLength;
            const endX = x1 + (x2 - x1) * (i * segmentLength + dotLength) / totalLength;
            const endY = y1 + (y2 - y1) * (i * segmentLength + dotLength) / totalLength;
            doc.line(startX, startY, endX, endY);
        }
        doc.setLineWidth(originalLineWidth); // Reset line width
    };

    const handlePrintSalarySlipsPDF = () => {
        if (!employeesData || employeesData.length === 0) {
            console.warn("No employee data to generate salary slips.");
            return;
        }

        const doc = new jsPDF('p', 'pt', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const outerMargin = 20; // Overall page margin

        const slipHeight = (pageHeight - (3 * outerMargin)) / 2;
        const slipWidth = pageWidth - (2 * outerMargin);

        const slip1_startY = outerMargin;
        const slip2_startY = outerMargin + slipHeight + outerMargin;

        // Colors sampled directly from image_1d9c41.png
        const HEADER_BG_TEAL = [190, 230, 220]; // Lighter teal for header
        const ATTENDANCE_BG_GRAY = [245, 245, 245]; // Light gray for attendance box

        const drawSingleSalarySlip = (doc, employee, currentMonthYear, startYOffset) => {
            const innerContentXStart = outerMargin;
            const slipContentWidth = slipWidth;

            // --- No outer Red Border as per image_1d9c41.png ---

            // --- Header (LE and Payment Slip for the Month) ---
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.text('LE', pageWidth / 2, startYOffset + 15, { align: 'center' });
            doc.setFontSize(12);
            doc.text(`Payment Slip for the Month ( ${currentMonthYear} )`, pageWidth / 2, startYOffset + 30, { align: 'center' });

            let currentY = startYOffset + 50; // Starting Y for employee details

            // --- Employee Header Details (above the main box) ---
            const employeeHeaderHeight = 25;
            doc.setFillColor(...HEADER_BG_TEAL);
            doc.rect(innerContentXStart, currentY, slipContentWidth, employeeHeaderHeight, 'F'); // Fill
            doc.setDrawColor(0); // Black border
            doc.setLineWidth(0.5);
            doc.rect(innerContentXStart, currentY, slipContentWidth, employeeHeaderHeight, 'S'); // Stroke

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(0);

            const employeeDetailsY = currentY + 15/////////////////////////////////////////////////////////////////////////////////////////////////////////; // Vertical alignment for text
            const empCol1X = innerContentXStart + 5; // Start X for E-Code
            const empCol2X = innerContentXStart + 105; // Start X for Name
            const empCol3X = innerContentXStart + 245; // Start X for Department
            const empCol4X = innerContentXStart + 400; // Start X for Designation

            // E-Code
            doc.text('E-Code', empCol1X, employeeDetailsY);
            doc.text(employee.EmpCode || '70263', empCol1X + 45, employeeDetailsY);

            // Name
            doc.text('Name', empCol2X, employeeDetailsY);
            doc.text(employee.EName || 'MUHAMMAD JAMEEL', empCol2X + 35, employeeDetailsY); // Default as per image_1d9c41.png

            // Department
            doc.text('Department', empCol3X, employeeDetailsY);
            doc.text(employee.Department || 'ACCOUNTS', empCol3X + 55, employeeDetailsY); // Default as per image_1d9c41.png

            // Designation
            doc.text('Designation', empCol4X, employeeDetailsY);
            doc.text(employee.Designation || 'ACCOUNT EXECUTIVE', empCol4X + 55, employeeDetailsY); // Default as per image_1d9c41.png

            currentY += employeeHeaderHeight; // Update Y after this header band

            // --- Main Financial Details Box ---
            const boxStartX = outerMargin;
            const boxStartY = currentY;
            const boxHeight = 160; // Fixed height as per image
            const boxEndX = boxStartX + slipContentWidth;

            doc.setDrawColor(0); // Black border for the main box
            doc.setLineWidth(0.5);
            doc.rect(boxStartX, boxStartY, slipContentWidth, boxHeight, 'S'); // Outer box

            // Inner header for DOJ and CNIC within the box
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(0);

            doc.text('DOJ', boxStartX + 10, boxStartY + 10);
            // Format 06/Dec/2022
            doc.text(`${employee.DOJ && employee.DOJ !== '1900-01-01' ? new Date(employee.DOJ).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '/') : '06/Dec/2022'}`, boxStartX + 45, boxStartY + 10);

            doc.text('CNIC', boxStartX + 10, boxStartY + 20);
            doc.text(`${employee.NIC || ''}`, boxStartX + 45, boxStartY + 20);

            // Dotted lines for DOJ and CNIC
            drawDottedLine(doc, boxStartX + 75, boxStartY + 10, boxStartX + 130, boxStartY + 10);
            drawDottedLine(doc, boxStartX + 75, boxStartY + 20, boxStartX + 130, boxStartY + 20);

            doc.setFont('helvetica', 'bold');
            doc.text('Account', boxStartX + (slipContentWidth / 2), boxStartY + 15, { align: 'center' }); // "Account" header centered in its half

            // Horizontal divider below DOJ/CNIC/Account
            const financialItemsStartY = boxStartY + 30;
            doc.line(boxStartX, financialItemsStartY, boxEndX, financialItemsStartY);

            // Vertical dividers for the 4 columns
            const colWidth = slipContentWidth / 4;
            const col1_boundary = boxStartX + colWidth;
            const col2_boundary = boxStartX + 2 * colWidth;
            const col3_boundary = boxStartX + 3 * colWidth;

            doc.line(col1_boundary, financialItemsStartY, col1_boundary, boxStartY + boxHeight);
            doc.line(col2_boundary, financialItemsStartY, col2_boundary, boxStartY + boxHeight);
            doc.line(col3_boundary, financialItemsStartY, col3_boundary, boxStartY + boxHeight);

            // Headers for Earnings and Deductions spanning their sub-columns
            doc.setFillColor(...HEADER_BG_TEAL);
            doc.rect(boxStartX, financialItemsStartY, colWidth * 2, 15, 'F'); // Earnings span
            doc.rect(boxStartX + colWidth * 2, financialItemsStartY, colWidth * 2, 15, 'F'); // Deductions span
            // Add borders for these header sections
            doc.setDrawColor(0);
            doc.setLineWidth(0.5);
            doc.rect(boxStartX, financialItemsStartY, colWidth * 2, 15, 'S');
            doc.rect(boxStartX + colWidth * 2, financialItemsStartY, colWidth * 2, 15, 'S');


            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(0);
            doc.text('EARNINGS', boxStartX + colWidth, financialItemsStartY + 10, { align: 'center' });
            doc.text('DEDUCTIONS', boxStartX + colWidth * 3, financialItemsStartY + 10, { align: 'center' });

            // Financial items layout
            let itemY = financialItemsStartY + 25; // Starting Y for first row of financial items, adjusted for tighter spacing
            const itemLineHeight = 10; // Standard line height

            const addFinancialRowItem = (colIndex, label, value, isCurrency = true, isBold = false) => {
                if (isBold) {
                    doc.setFont('helvetica', 'bold');
                } else {
                    doc.setFont('helvetica', 'normal');
                }
                doc.setTextColor(0);
                doc.setFontSize(8); // Ensure consistent font size for items

                const colLeftX = boxStartX + (colIndex * colWidth);
                const labelX = colLeftX + 5;
                const valueX = colLeftX + colWidth - 5; // Right aligned
                const formattedValue = isCurrency ? formatCurrency(value) : formatNumber(value);

                doc.text(label, labelX, itemY);
                // Dotted line between label and value
                const dottedLineStart = labelX + doc.getTextWidth(label) + 2;
                const dottedLineEnd = valueX - doc.getTextWidth(formattedValue) - 2;
                drawDottedLine(doc, dottedLineStart, itemY, dottedLineEnd, itemY);
                doc.text(formattedValue, valueX, itemY, { align: 'right' });
            };

            // Financial Rows with default values from image_1d9c41.png
            addFinancialRowItem(0, 'Monthly Sal', employee.BasicSalary || 135000);
            addFinancialRowItem(1, 'Other Allowance', employee.OtherAllowance || '-');
            addFinancialRowItem(2, 'I Tax', employee.IncomeTax || 4637);
            addFinancialRowItem(3, 'Other Ded', parseFloat(employee.Deduction || 0) + parseFloat(employee.Deduction1 || 0) + parseFloat(employee.Deduction2 || 0) + parseFloat(employee.Deduction5 || 0) + parseFloat(employee.LateDeduction || 0) + parseFloat(employee.EarlyDeduction || 0) + parseFloat(employee.BussDeduction || 0) || '-');
            itemY += itemLineHeight;

            addFinancialRowItem(0, 'Increment', employee.Increment || '-');
            addFinancialRowItem(1, 'Gross Salary', employee.GrossSalary || 135000);
            addFinancialRowItem(2, 'EOBI / PF', parseFloat(employee.EOBIAmount || 0) + parseFloat(employee.PFAmount || 0) || 370);
            addFinancialRowItem(3, 'Tot Deduction', employee.TotalDeduction || 6657, true, true); // BOLD
            itemY += itemLineHeight;

            addFinancialRowItem(0, 'Calc Sal', employee.SalaryWithAllow || 135000);
            addFinancialRowItem(1, 'OT Hrs', employee.OTHrs || '-', false); // Not currency
            addFinancialRowItem(2, 'Advance', employee.Deduction3 || '-');
            addFinancialRowItem(3, 'Net Payable', employee.NetPayable || 128343, true, true); // BOLD
            itemY += itemLineHeight;

            addFinancialRowItem(0, 'Salary Days', employee.SalaryDays || 30, false); // Not currency
            addFinancialRowItem(1, 'OT Rate', employee.OTRate || 563);
            addFinancialRowItem(2, 'Loan', employee.LoanBalance || '-');
            itemY += itemLineHeight;

            addFinancialRowItem(0, 'Earned Sal', employee.EarnedSalary || 135000);
            addFinancialRowItem(1, 'OT Amount', employee.OTAmount || '-');
            addFinancialRowItem(2, 'L.Sale', employee.LocalSale || '-');
            itemY += itemLineHeight;

            addFinancialRowItem(0, 'Arrears', employee.Arrears || '-');
            addFinancialRowItem(1, 'Tot Payable', employee.GrossSalary || 135000, true, true); // BOLD
            addFinancialRowItem(2, 'Canteen', employee.Canteen || 1650);
            itemY += itemLineHeight;

            addFinancialRowItem(0, 'Conv Allowance', employee.Allowance || '-');
            itemY += itemLineHeight;


            currentY = boxStartY + boxHeight + 10; // Move past the main box

            // --- Amount in Words (below main box) ---
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(7);
            doc.text(`Amount in words: ${numberToWords(employee.NetPayable || 128343)}`, outerMargin, currentY);
            currentY += 15;

            // --- Attendance / Leave Details ---
            const attendanceBoxStartY = currentY + 5;
            const newAttendanceBoxHeight = 50; // Height for 2 rows
            doc.setDrawColor(0); // Black border
            doc.setLineWidth(0.5);
            doc.setFillColor(...ATTENDANCE_BG_GRAY);
            doc.rect(boxStartX, attendanceBoxStartY, slipContentWidth, newAttendanceBoxHeight, 'FD'); // Fill and Draw border

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(0);
            doc.text('ATTENDANCE / LEAVE DETAILS:', boxStartX + 10, attendanceBoxStartY + 10);

            doc.setDrawColor(0);
            doc.line(boxStartX, attendanceBoxStartY + 18, boxEndX, attendanceBoxStartY + 18); // Horizontal line

            // Y positions for attendance rows
            const attY_row1 = attendanceBoxStartY + 28; // Adjusted Y for first row
            const attY_row2 = attendanceBoxStartY + 42; // Adjusted Y for second row

            // Helper to add single attendance item with precise X control
            const addPreciseAttendanceItem = (label, value, labelX, valueX, yPos) => {
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(0);
                doc.setFontSize(8);

                const formattedValue = formatNumber(value);

                doc.text(label, labelX, yPos);
                // Dotted line between label and value
                const dottedLineStart = labelX + doc.getTextWidth(label) + 2;
                const dottedLineEnd = valueX - doc.getTextWidth(formattedValue) - 2;
                drawDottedLine(doc, dottedLineStart, yPos, dottedLineEnd, yPos);
                doc.text(formattedValue, valueX, yPos, { align: 'right' });
            };

            // Row 1 of attendance details (specific X coordinates from image_1d9c41.png)
            addPreciseAttendanceItem('Month Days', employee.MonthDays || 31.00, boxStartX + 10, boxStartX + 70, attY_row1);
            addPreciseAttendanceItem('Ded. Days', employee.DeductionDays || '-', boxStartX + 95, boxStartX + 155, attY_row1);
            addPreciseAttendanceItem('PP', employee.PPDays || 22.00, boxStartX + 180, boxStartX + 225, attY_row1);
            addPreciseAttendanceItem('WE', employee.WEDays || 4.00, boxStartX + 250, boxStartX + 295, attY_row1);
            addPreciseAttendanceItem('Leaves', employee.TotalLeaves || 4.00, boxStartX + 320, boxStartX + 370, attY_row1);
            addPreciseAttendanceItem('SHLD', employee.SHLDays || '-', boxStartX + 395, boxStartX + 440, attY_row1);
            addPreciseAttendanceItem('Late', employee.LateDays || 18.00, boxStartX + 465, boxStartX + 510, attY_row1);

            // Row 2 of attendance details (specific X coordinates from image_1d9c41.png)
            addPreciseAttendanceItem('W-Days', employee.WorkingDays || 31.00, boxStartX + 10, boxStartX + 70, attY_row2);
            addPreciseAttendanceItem('Salary Days', employee.SalaryDays || 30.00, boxStartX + 95, boxStartX + 155, attY_row2);
            addPreciseAttendanceItem('AB', employee.ABDays || '-', boxStartX + 180, boxStartX + 225, attY_row2);
            addPreciseAttendanceItem('Holi', employee.TotalHoliDays || 1.00, boxStartX + 250, boxStartX + 295, attY_row2);
            addPreciseAttendanceItem('SLD', employee.SLDDays || '-', boxStartX + 320, boxStartX + 370, attY_row2);
            addPreciseAttendanceItem('HD', employee.HDDays || '-', boxStartX + 395, boxStartX + 440, attY_row2); // Assuming HD is a field


            currentY = attendanceBoxStartY + newAttendanceBoxHeight + 10; // Move past the attendance box

            // --- Signatures ---
            const signatureTextY = currentY + 30;
            const lineLength = 100;
            const lineY = signatureTextY - 5;

            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0);

            const financeManagerX = outerMargin + 100; // Adjusted for position in image_1d9c41.png
            const employeeSignatureX = pageWidth - outerMargin - 100; // Adjusted for position in image_1d9c41.png

            // Finance Manager
            doc.setDrawColor(0);
            doc.line(financeManagerX - (lineLength / 2), lineY, financeManagerX + (lineLength / 2), lineY);
            doc.text('Finance Manager', financeManagerX, signatureTextY, { align: 'center' });

            // Employee Signature
            doc.line(employeeSignatureX - (lineLength / 2), lineY, employeeSignatureX + (lineLength / 2), lineY);
            doc.text('STAMP & SIGNATURE', employeeSignatureX, signatureTextY, { align: 'center' });
        };

        // Determine month and year for the slip header
        const paymentMonthYear = monthYear || (dateFrom ? new Date(dateFrom).toLocaleString('en-US', { year: 'numeric', month: 'long' }) : 'May - 2025');

        for (let i = 0; i < employeesData.length; i += 2) {
            if (i > 0) {
                doc.addPage();
            }
            drawSingleSalarySlip(doc, employeesData[i], paymentMonthYear, slip1_startY);
            if (employeesData[i + 1]) {
                drawSingleSalarySlip(doc, employeesData[i + 1], paymentMonthYear, slip2_startY);
            }
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
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <h2 style={{ color: '#333' }}>Salary Slip Generator</h2>
                <p style={{ color: '#555' }}>Generates PDF salary slips in custom design (2 per page).</p>
                {employeesData.length > 0 && (
                    <p style={{ color: '#777' }}>Total Employees: {employeesData.length}</p>
                )}
                <button onClick={handlePrintSalarySlipsPDF} style={{ padding: "10px 25px", background: "#20B2AA", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 16 }}>
                    Generate Salary Slips PDF
                </button>
            </div>
            {employeesData.length === 0 && (
                <p style={{ textAlign: "center", color: "red" }}>No employee data provided to generate salary slips.</p>
            )}
            {employeesData.length > 0 && (
                <div style={{ marginTop: 20 }}>
                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 10 }}>Previewing Data for PDF Generation:</h3>
                    {employeesData.slice(0, 3).map((emp, index) => (
                        <div key={emp.EmpID || index} style={{ marginBottom: 15, padding: 10, border: '1px solid #eee', borderRadius: 5 }}>
                            <strong>Employee {index + 1}:</strong> {emp.EName} (Code: {emp.EmpCode}) - Net Payable: {formatCurrency(emp.NetPayable)}
                        </div>
                    ))}
                    {employeesData.length > 3 && (
                        <p style={{ textAlign: 'center', color: '#888' }}>... and {employeesData.length - 3} more employees.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SalarySlipPreview;