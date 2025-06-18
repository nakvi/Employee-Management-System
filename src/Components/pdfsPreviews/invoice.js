import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Invoice({ employee }) {
  const printRef = React.useRef(null);

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: "a4" });
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("salary-slip.pdf");
  };

  if (!employee) return <div>No employee selected.</div>;

  // Example data (replace with real employee data as needed)
  const allowances = [
    { label: "Gross Salary", value: employee.BasicSalary || 0 },
    { label: "Bonus", value: employee.Bonus || 0 },
    { label: "Allowance", value: employee.Allowance || 0 },
    { label: "Eid Bonus", value: employee.EidBonus || 0 },
    { label: "Arrears", value: employee.Arrears || 0 },
  ];
  const totalAllowances = allowances.reduce((sum, a) => sum + Number(a.value || 0), 0);

  const deductions = [
    { label: "Income Tax", value: employee.IncomeTax || 0 },
    { label: "EOBI Deduction", value: employee.EOBI || 0 },
    { label: "Loan Deduction", value: employee.LoanDeduction || 0 },
    { label: "Leave Without Pay", value: employee.LeaveWithoutPay || 0 },
    { label: "Other Deductions", value: employee.OtherDeductions || 0 },
  ];
  const totalDeductions = deductions.reduce((sum, d) => sum + Number(d.value || 0), 0);

  const netSalary = totalAllowances - totalDeductions;

  return (
    <div className="d-flex flex-column align-items-center">
      <div
        ref={printRef}
        style={{
          background: "#fff",
          padding: 24,
          border: "1px solid #222",
          width: 900,
          margin: "24px auto",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", borderBottom: "2px solid #222" }}>
          <img src="/logo.png" alt="Logo" style={{ height: 60, marginRight: 24 }} />
          <div style={{ flex: 1, textAlign: "center" }}>
            <span style={{ fontSize: 32, fontWeight: "bold", letterSpacing: 8, color: "#23336e" }}>
              ZETA
            </span>
            <div style={{ color: "#e74c3c", fontWeight: "bold", fontSize: 18 }}>eCorp</div>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <span
              style={{
                background: "#e5e5e5",
                padding: "8px 24px",
                fontWeight: "bold",
                fontSize: 22,
                borderRadius: 4,
              }}
            >
              Salary Slip
            </span>
          </div>
          <div style={{ flex: 1, textAlign: "right" }}>
            <div style={{ fontSize: 14 }}>For the Month:</div>
            <div
              style={{
                background: "#2563eb",
                color: "#fff",
                padding: "4px 16px",
                borderRadius: 4,
                fontWeight: "bold",
                fontSize: 18,
                display: "inline-block",
              }}
            >
              {employee.Month || "May-2025"}
            </div>
          </div>
        </div>

        {/* Employee Info */}
        <div style={{ display: "flex", marginTop: 12, marginBottom: 8 }}>
          <div style={{ flex: 1, border: "1px solid #222", marginRight: 8, padding: 8 }}>
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td>Emp. Code</td>
                  <td>
                    <span style={{ background: "#ccc", padding: "2px 8px" }}>{employee.EmpCode}</span>
                  </td>
                </tr>
                <tr>
                  <td>Name</td>
                  <td>
                    <span style={{ background: "#ccc", padding: "2px 8px" }}>{employee.EName}</span>
                  </td>
                </tr>
                <tr>
                  <td>Designation</td>
                  <td>
                    <span style={{ background: "#ccc", padding: "2px 8px" }}>{employee.DesignationTitle}</span>
                  </td>
                </tr>
                <tr>
                  <td>Grade</td>
                  <td>
                    <span style={{ background: "#ccc", padding: "2px 8px" }}>{employee.Grade || ""}</span>
                  </td>
                </tr>
                <tr>
                  <td>Department</td>
                  <td>
                    <span style={{ background: "#ccc", padding: "2px 8px" }}>
                      {employee.DepartmentTitle || employee.DeptName || ""}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ flex: 1, border: "1px solid #222", marginRight: 8, padding: 8 }}>
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td>Joining Date</td>
                  <td>
                    <span style={{ background: "#ccc", padding: "2px 8px" }}>{employee.DOJ}</span>
                  </td>
                </tr>
                <tr>
                  <td>Monthly Salary</td>
                  <td>
                    <span style={{ background: "#ccc", padding: "2px 8px" }}>{employee.BasicSalary}</span>
                  </td>
                </tr>
                <tr>
                  <td>Salary Days</td>
                  <td>
                    <span style={{ background: "#ccc", padding: "2px 8px" }}>{employee.SalaryDays || 30}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ flex: 1, border: "1px solid #222", padding: 8 }}>
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td>Payment Mode</td>
                  <td>
                    <span style={{ background: "#ccc", padding: "2px 8px" }}>{employee.PaymentMode || ""}</span>
                  </td>
                </tr>
                <tr>
                  <td>Bank Name</td>
                  <td>
                    <span style={{ background: "#ccc", padding: "2px 8px" }}>{employee.BankName || ""}</span>
                  </td>
                </tr>
                <tr>
                  <td>Branch</td>
                  <td>
                    <span style={{ background: "#ccc", padding: "2px 8px" }}>{employee.Branch || ""}</span>
                  </td>
                </tr>
                <tr>
                  <td>Account No</td>
                  <td>
                    <span style={{ background: "#ccc", padding: "2px 8px" }}>{employee.AccountNo || ""}</span>
                  </td>
                </tr>
                <tr>
                  <td>CNIC No.</td>
                  <td>
                    <span style={{ background: "#ccc", padding: "2px 8px" }}>{employee.NIC}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Allowances & Deductions */}
        <div style={{ display: "flex", border: "1px solid #222", marginBottom: 0 }}>
          {/* Allowances */}
          <div style={{ flex: 1, borderRight: "1px solid #222" }}>
            <div
              style={{
                background: "#e5e5e5",
                fontWeight: "bold",
                textAlign: "center",
                borderBottom: "1px solid #222",
                padding: 4,
              }}
            >
              Allowances
            </div>
            <table style={{ width: "100%" }}>
              <tbody>
                {allowances.map((a, i) => (
                  <tr key={i}>
                    <td style={{ padding: "4px 8px" }}>{a.label}</td>
                    <td style={{ padding: "4px 8px" }}>PKR</td>
                    <td style={{ padding: "4px 8px", textAlign: "right" }}>
                      {a.value ? a.value.toLocaleString() : "-"}
                    </td>
                  </tr>
                ))}
                <tr style={{ fontWeight: "bold", borderTop: "1px solid #222" }}>
                  <td>Total Allowances</td>
                  <td>PKR</td>
                  <td style={{ textAlign: "right" }}>{totalAllowances.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Deductions */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                background: "#e5e5e5",
                fontWeight: "bold",
                textAlign: "center",
                borderBottom: "1px solid #222",
                padding: 4,
              }}
            >
              Deductions
            </div>
            <table style={{ width: "100%" }}>
              <tbody>
                {deductions.map((d, i) => (
                  <tr key={i}>
                    <td style={{ padding: "4px 8px" }}>{d.label}</td>
                    <td style={{ padding: "4px 8px" }}>PKR</td>
                    <td style={{ padding: "4px 8px", textAlign: "right" }}>
                      {d.value ? d.value.toLocaleString() : "-"}
                    </td>
                  </tr>
                ))}
                <tr style={{ fontWeight: "bold", borderTop: "1px solid #222" }}>
                  <td>Total Deductions</td>
                  <td>PKR</td>
                  <td style={{ textAlign: "right" }}>{totalDeductions.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Net Salary */}
        <div style={{ border: "1px solid #222", borderTop: "none", padding: 8 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1, fontSize: 13 }}>
              &lt;&lt; Note:This is a computer generated Salary Slip and does not require any Signatures and Stamp&gt;&gt;
            </div>
            <div style={{ flex: 1, textAlign: "right", fontWeight: "bold", fontSize: 18 }}>
              Net Salary &nbsp; PKR &nbsp; {netSalary.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={handleDownloadPdf}
        className="btn btn-primary mt-3"
      >
        Download PDF
      </button>
    </div>
  );
}