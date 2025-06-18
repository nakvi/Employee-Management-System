import React from "react";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const MonthlyAttSalarySheetPreview = ({ emp, allEmployees = [], reportHeading, dateFrom, dateTo }) => {
  // Helper
  const formatTime = (val) => {
    if (!val) return "";
    if (val.length > 8) return val.slice(11, 19);
    return val;
  };

  // Dummy salary data (replace with real API if available)
  const salaryInfo = emp?.SalaryInfo || {
    MonthlySalary: emp?.MonthlySalary || "41,815",
    CalcSalary: emp?.CalcSalary || "30,664",
    AdvanceDeduction: emp?.AdvanceDeduction || "0",
    IncomeTax: emp?.IncomeTax || "0",
    Allowances: emp?.Allowances || "0",
    Canteen: emp?.Canteen || "0",
    GrossSalary: emp?.GrossSalary || "30,664",
    EOBI: emp?.EOBI || "-",
    OverTime: emp?.OverTime || "38.00",
    TotDeduction: emp?.TotDeduction || "2,521",
    OTPay: emp?.OTPay || "3,833",
    TotalPayable: emp?.TotalPayable || "34,497",
    NetPayable: emp?.NetPayable || "31,976"
  };

  // Attendance summary (replace with real calculation if available)
  const summary = emp?.Summary || {
    TotalDays: emp?.MonthDays || 22,
    Present: emp?.PPDays || 20,
    LeaveWithPay: emp?.LWDays || 0,
    OffDays: emp?.OFDays || 1,
    WorkingDays: emp?.WorkingDays || 21,
    Absent: emp?.ABDays || 0,
    LeaveWithoutPay: emp?.WODays || 0,
    Weekends: emp?.Sundays || 1,
    OverTime: emp?.OverTime || 0,
    HalfDays: emp?.HDDays || 0,
  };

  // PDF Export
  const handlePrintAllPDF = () => {
    if (!allEmployees.length) return;
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    allEmployees.forEach((emp, idx) => {
      if (idx > 0) doc.addPage();

      // Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('Shafi Lifestyle (Pvt.) Ltd.', 40, 40);
      doc.setFontSize(11);
      doc.text(
        `Attendance Card for the Month ( ${dateFrom?.slice(0, 7)} )`,
        40,
        60
      );
      doc.setFontSize(9);
      doc.text(`Print Date: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 130, 40);
      doc.text(`Print Time: ${new Date().toLocaleTimeString('en-GB')}`, pageWidth - 130, 60);

      // Info Table
      autoTable(doc, {
        startY: 75,
        head: [[
          { content: `Emp Code : ${emp.EmpCode}`, styles: { halign: 'left', fontStyle: 'bold', cellWidth: 80 } },
          { content: `Monthly Salary  ${salaryInfo.MonthlySalary}`, styles: { halign: 'left', cellWidth: 90 } },
          { content: `IncomeTax  ${salaryInfo.IncomeTax}`, styles: { halign: 'left', cellWidth: 70 } },
        ], [
          { content: `Emp Name : ${emp.EName}`, styles: { halign: 'left', fontStyle: 'bold', cellWidth: 120 } },
          { content: `Calc. Salary  ${salaryInfo.CalcSalary}`, styles: { halign: 'left', cellWidth: 90 } },
          { content: `Advance Deduction  ${salaryInfo.AdvanceDeduction}`, styles: { halign: 'left', cellWidth: 90 } },
        ], [
          { content: `D O J : ${emp.DOJ}`, styles: { halign: 'left', cellWidth: 80 } },
          { content: `Allowances  ${salaryInfo.Allowances}`, styles: { halign: 'left', cellWidth: 70 } },
          { content: `Canteen  ${salaryInfo.Canteen}`, styles: { halign: 'left', cellWidth: 70 } },
        ], [
          { content: `Designation : ${emp.Designation}`, styles: { halign: 'left', cellWidth: 120 } },
          { content: `Gross Salary  ${salaryInfo.GrossSalary}`, styles: { halign: 'left', cellWidth: 90 } },
          { content: `EOBI  ${salaryInfo.EOBI}`, styles: { halign: 'left', cellWidth: 70 } },
        ], [
          { content: `Department : ${emp.Department}`, styles: { halign: 'left', cellWidth: 120 } },
          { content: `Over Time  ${salaryInfo.OverTime}`, styles: { halign: 'left', cellWidth: 70 } },
          { content: `Tot Deduction  ${salaryInfo.TotDeduction}`, styles: { halign: 'left', cellWidth: 90 } },
        ], [
          { content: `OT Rs  ${salaryInfo.OTPay}`, styles: { halign: 'left', cellWidth: 80 } },
          { content: `Total Payable  ${salaryInfo.TotalPayable}`, styles: { halign: 'left', cellWidth: 90 } },
          { content: `Net Payable :  ${salaryInfo.NetPayable}`, styles: { halign: 'left', fontStyle: 'bold', textColor: [0, 86, 122], cellWidth: 120 } },
        ]],
        body: [],
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 2,
          fillColor: [224, 242, 241],
          textColor: '#222',
        },
        margin: { left: 40, right: 40 },
        tableLineWidth: 0.7,
        tableLineColor: [90, 130, 140],
      });

      // Attendance Table
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 2,
        head: [[
          "Srl #", "Date", "First In Time", "Last Out Time", "Tot Time", "O / T", "Code", "Remarks"
        ]],
        body: emp.Attendance.map((row, idx) => [
          idx + 1,
          row.VDate,
          formatTime(row.DateIn),
          formatTime(row.DateOut),
          row.TotTime || "",
          row.OverTime || "",
          row.AttCode || "",
          row.Remarks || ""
        ]),
        theme: 'grid',
        headStyles: {
          fillColor: [255, 249, 196],
          textColor: '#222',
          fontStyle: 'bold',
          fontSize: 9,
          font: 'helvetica',
          halign: 'center',
          lineColor: [180, 180, 180],
          lineWidth: 0.5,
        },
        bodyStyles: {
          fontSize: 8,
          font: 'helvetica',
          halign: 'center',
          lineColor: [220, 220, 220],
          lineWidth: 0.3,
        },
        alternateRowStyles: {
          fillColor: [255, 255, 255],
        },
        margin: { left: 40, right: 40 },
        columnStyles: {
          0: { halign: 'center', cellWidth: 32 },    // Srl#
          1: { halign: 'center', cellWidth: 70 },    // Date
          2: { halign: 'center', cellWidth: 60 },    // First In
          3: { halign: 'center', cellWidth: 60 },    // Last Out
          4: { halign: 'center', cellWidth: 55 },    // Tot Time
          5: { halign: 'center', cellWidth: 45 },    // O/T
          6: { halign: 'center', cellWidth: 38 },    // Code
          7: { halign: 'left', cellWidth: 90 },      // Remarks
        },
      });

      // Summary Table
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 6,
        head: [[
          { content: "Total Days :", styles: { fontStyle: 'bold', halign: 'left', cellWidth: 60 } },
          summary.TotalDays,
          { content: "Present (PP) :", styles: { fontStyle: 'bold', halign: 'left', cellWidth: 60 } },
          summary.Present,
          { content: "Leave with pay (LW) :", styles: { fontStyle: 'bold', halign: 'left', cellWidth: 80 } },
          summary.LeaveWithPay,
          { content: "Off Days (OF) :", styles: { fontStyle: 'bold', halign: 'left', cellWidth: 60 } },
          summary.OffDays,
        ], [
          { content: "Working Days :", styles: { fontStyle: 'bold', halign: 'left', cellWidth: 60 } },
          summary.WorkingDays,
          { content: "Absent (AB) :", styles: { fontStyle: 'bold', halign: 'left', cellWidth: 60 } },
          summary.Absent,
          { content: "Leave without pay (WO) :", styles: { fontStyle: 'bold', halign: 'left', cellWidth: 90 } },
          summary.LeaveWithoutPay,
          { content: "Weekends (SN) :", styles: { fontStyle: 'bold', halign: 'left', cellWidth: 60 } },
          summary.Weekends,
        ], [
          { content: "Over Time (Hrs) :", styles: { fontStyle: 'bold', halign: 'left', cellWidth: 60 } },
          summary.OverTime,
          { content: "Half Days (HD) :", styles: { fontStyle: 'bold', halign: 'left', cellWidth: 60 } },
          summary.HalfDays,
        ]],
        body: [],
        theme: 'plain',
        styles: {
          fontSize: 9,
          cellPadding: 2,
        },
        margin: { left: 40, right: 40 },
        tableLineWidth: 0,
      });
    });

    window.open(doc.output("bloburl"), "_blank");
  };

  // Data check
  if (!emp || !emp.Attendance || emp.Attendance.length === 0) {
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
    <div style={{
      margin: "30px auto",
      maxWidth: 900,
      background: "#fff",
      borderRadius: 8,
      boxShadow: "0 2px 12px #0001",
      padding: 24,
      overflow: "auto"
    }}>
      {/* Print All PDF Button (only on first card) */}
      {allEmployees.length >= 1 && emp.EmpID === allEmployees[0].EmpID && (
        <div style={{ textAlign: "right", margin: "10px 0" }}>
          <button onClick={handlePrintAllPDF} style={{ padding: "6px 18px", background: "#5ba4b6", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
            Print All PDF
          </button>
        </div>
      )}
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <div>
          <div style={{ fontWeight: "bold", fontSize: 18 }}>Shafi Lifestyle (Pvt.) Ltd.</div>
          <div style={{ fontWeight: "bold", fontSize: 15 }}>
            Attendance Card for the Month ( {dateFrom?.slice(0, 7)} )
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 13 }}>
          <div>Print Date: {new Date().toLocaleDateString()}</div>
          <div>Print Time: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>
      {/* Employee Info Box */}
      <table style={{
        width: "100%",
        background: "#e0f2f1",
        border: "1.5px solid #5ba4b6",
        marginBottom: 0,
        fontSize: 14
      }}>
        <tbody>
          <tr>
            <td>Emp Code : <b>{emp.EmpCode}</b></td>
            <td>Monthly Salary <b>{salaryInfo.MonthlySalary}</b></td>
            <td>IncomeTax <b>{salaryInfo.IncomeTax}</b></td>
          </tr>
          <tr>
            <td>Emp Name : <b>{emp.EName}</b></td>
            <td>Calc. Salary <b>{salaryInfo.CalcSalary}</b></td>
            <td>Advance Deduction <b>{salaryInfo.AdvanceDeduction}</b></td>
          </tr>
          <tr>
            <td>D O J : <b>{emp.DOJ}</b></td>
            <td>Allowances <b>{salaryInfo.Allowances}</b></td>
            <td>Canteen <b>{salaryInfo.Canteen}</b></td>
          </tr>
          <tr>
            <td>Designation : <b>{emp.Designation}</b></td>
            <td>Gross Salary <b>{salaryInfo.GrossSalary}</b></td>
            <td>EOBI <b>{salaryInfo.EOBI}</b></td>
          </tr>
          <tr>
            <td>Department : <b>{emp.Department}</b></td>
            <td>Over Time <b>{salaryInfo.OverTime}</b></td>
            <td>Tot Deduction <b>{salaryInfo.TotDeduction}</b></td>
          </tr>
          <tr>
            <td>OT Rs <b>{salaryInfo.OTPay}</b></td>
            <td>Total Payable <b>{salaryInfo.TotalPayable}</b></td>
            <td style={{ fontWeight: "bold", color: "#00567a" }}>Net Payable : <b>{salaryInfo.NetPayable}</b></td>
          </tr>
        </tbody>
      </table>
      {/* Attendance Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 0 }}>
        <thead>
          <tr style={{ background: "#fff9c4" }}>
            <th style={{ border: "1px solid #bdbdbd" }}>Srl #</th>
            <th style={{ border: "1px solid #bdbdbd" }}>Date</th>
            <th style={{ border: "1px solid #bdbdbd" }}>First In Time</th>
            <th style={{ border: "1px solid #bdbdbd" }}>Last Out Time</th>
            <th style={{ border: "1px solid #bdbdbd" }}>Tot Time</th>
            <th style={{ border: "1px solid #bdbdbd" }}>O / T</th>
            <th style={{ border: "1px solid #bdbdbd" }}>Code</th>
            <th style={{ border: "1px solid #bdbdbd" }}>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {emp.Attendance.map((row, idx) => (
            <tr key={idx} style={{ background: "#fff" }}>
              <td style={{ border: "1px solid #bdbdbd", textAlign: "center" }}>{idx + 1}</td>
              <td style={{ border: "1px solid #bdbdbd", textAlign: "center" }}>{row.VDate}</td>
              <td style={{ border: "1px solid #bdbdbd", textAlign: "center" }}>{formatTime(row.DateIn)}</td>
              <td style={{ border: "1px solid #bdbdbd", textAlign: "center" }}>{formatTime(row.DateOut)}</td>
              <td style={{ border: "1px solid #bdbdbd", textAlign: "center" }}>{row.TotTime || ""}</td>
              <td style={{ border: "1px solid #bdbdbd", textAlign: "center" }}>{row.OverTime || ""}</td>
              <td style={{ border: "1px solid #bdbdbd", textAlign: "center", fontWeight: "bold" }}>{row.AttCode || ""}</td>
              <td style={{ border: "1px solid #bdbdbd", textAlign: "left" }}>{row.Remarks || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Summary Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 8 }}>
        <tbody>
          <tr>
            <td style={{ border: "1px dotted #888" }}>Total Days : <b>{summary.TotalDays}</b></td>
            <td style={{ border: "1px dotted #888" }}>Present (PP) : <b>{summary.Present}</b></td>
            <td style={{ border: "1px dotted #888" }}>Leave with pay (LW) : <b>{summary.LeaveWithPay}</b></td>
            <td style={{ border: "1px dotted #888" }}>Off Days (OF) : <b>{summary.OffDays}</b></td>
          </tr>
          <tr>
            <td style={{ border: "1px dotted #888" }}>Working Days : <b>{summary.WorkingDays}</b></td>
            <td style={{ border: "1px dotted #888" }}>Absent (AB) : <b>{summary.Absent}</b></td>
            <td style={{ border: "1px dotted #888" }}>Leave without pay (WO) : <b>{summary.LeaveWithoutPay}</b></td>
            <td style={{ border: "1px dotted #888" }}>Weekends (SN) : <b>{summary.Weekends}</b></td>
          </tr>
          <tr>
            <td style={{ border: "1px dotted #888" }}>Over Time (Hrs) : <b>{summary.OverTime}</b></td>
            <td style={{ border: "1px dotted #888" }}>Half Days (HD) : <b>{summary.HalfDays}</b></td>
            <td style={{ border: "border: none" }}></td>
            <td style={{ border: "border: none" }}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyAttSalarySheetPreview;