import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
const dummyData = [
  {
    section: "ADMIN GENERAL LTS",
    rows: [
      { ECode: "A00158", Name: "HAZIK SAID", Designation: "MERCHANDISING & PL", TimeIN: "10:01:57", TimeOUT: "17:27:13", Late: "5min", Remarks: "Machine" },
      { ECode: "A01111", Name: "MUHAMMAD IQBAL", Designation: "STORE HELPER", TimeIN: "11:52:53", TimeOUT: "20:26:16", Late: "25min", Remarks: "Machine" },
      { ECode: "A01546", Name: "SHAN IQBAL", Designation: "COSTING & PLANNING", TimeIN: "09:22:43", TimeOUT: "17:38:14", Late: "2min", Remarks: "Machine" },
    ]
  },
  {
    section: "BOTTOM LTS",
    rows: [
      { ECode: "A00749", Name: "REHMAT ALI", Designation: "CUTTING HELPER", TimeIN: "08:25:26", TimeOUT: "16:59:23", Late: "2min", Remarks: "Machine" },
    ]
  },
  {
    section: "LASTING",
    rows: [
      { ECode: "A01909", Name: "MUHAMMAD AHMED", Designation: "ASSISTANT SUPERVISOR", TimeIN: "08:20:57", TimeOUT: "17:24:24", Late: "20min", Remarks: "Machine" },
    ]
  },
  {
    section: "MODEL ROOM LTS",
    rows: [
      { ECode: "A00735", Name: "MUHAMMAD JAVED", Designation: "UPPER MAN", TimeIN: "09:25:00", TimeOUT: "17:18:00", Late: "5min", Remarks: "Machine" },
    ]
  },
  {
    section: "PRODUCTIONS LTS",
    rows: [
      { ECode: "A00651", Name: "MUHAMMAD IRFAN", Designation: "STITCHING SUPERVISOR", TimeIN: "08:40:00", TimeOUT: "16:20:00", Late: "40min", Remarks: "Machine" },
      { ECode: "A00954", Name: "MUHAMMAD IMTIAZ AKBAR", Designation: "PRODUCTION MANAGER", TimeIN: "09:20:00", TimeOUT: "17:14:00", Late: "50min", Remarks: "Machine" },
      { ECode: "A01049", Name: "RASHEED AHMED", Designation: "EXECUTIVE DESIGNER", TimeIN: "08:24:17", TimeOUT: "17:01:50", Late: "2min", Remarks: "Machine" },
      { ECode: "A01109", Name: "MOHSIN ALI", Designation: "LASTING SUPERVISOR", TimeIN: "08:24:11", TimeOUT: "17:01:55", Late: "2min", Remarks: "Machine" },
    ]
  },
  {
    section: "QUALITY & INSPECTION LTS",
    rows: [
      { ECode: "A00953", Name: "MUBASHAR ALI", Designation: "DISPATCH SUPERVISOR", TimeIN: "11:54:30", TimeOUT: "20:29:21", Late: "25min", Remarks: "Machine" },
      { ECode: "A01012", Name: "ZEESHAN", Designation: "PACKER", TimeIN: "11:54:37", TimeOUT: "20:26:32", Late: "2min", Remarks: "Machine" },
    ]
  },
  {
    section: "SOCKS DEP LTS",
    rows: [
      { ECode: "A01316", Name: "SHOAIB", Designation: "SOCKS MAN", TimeIN: "08:36:48", TimeOUT: "17:26:56", Late: "5min", Remarks: "Machine" },
      { ECode: "A01467", Name: "SUNNY HIDAYT", Designation: "PRINTING MAN", TimeIN: "08:25:44", TimeOUT: "17:09:05", Late: "2min", Remarks: "Machine" },
    ]
  },
];

const ReportsPreview = () => {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", fontFamily: "Arial, sans-serif", fontSize: 13, background: "#fff", border: "1px solid #bbb", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <div>
          <b>LECOMPANY NAME</b>
          <br />
          Late Commer for the date 30/05/2025
        </div>
        <div style={{ textAlign: "right", fontSize: 12 }}>
          Print Date : 02-Jun-2025<br />
          Print Time : 19:05:53
        </div>
      </div>
      {dummyData.map((section, idx) => (
        <div key={section.section} style={{ marginBottom: 10 }}>
          <div style={{ background: "#5ba4b6", color: "#fff", padding: "4px 8px", fontWeight: "bold", borderTop: idx === 0 ? "1px solid #bbb" : "none", borderBottom: "1px solid #bbb" }}>
            {section.section}
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#eaf3f7" }}>
                <th style={{ border: "1px solid #bbb", padding: "2px 6px" }}>E-Code</th>
                <th style={{ border: "1px solid #bbb", padding: "2px 6px" }}>Name</th>
                <th style={{ border: "1px solid #bbb", padding: "2px 6px" }}>Designation</th>
                <th style={{ border: "1px solid #bbb", padding: "2px 6px" }}>Time IN</th>
                <th style={{ border: "1px solid #bbb", padding: "2px 6px" }}>Time OUT</th>
                <th style={{ border: "1px solid #bbb", padding: "2px 6px" }}>Late Time</th>
                <th style={{ border: "1px solid #bbb", padding: "2px 6px" }}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, i) => (
                <tr key={row.ECode} style={{ background: i % 2 === 0 ? "#fff" : "#f7fafd" }}>
                  <td style={{ border: "1px solid #bbb", padding: "2px 6px" }}>{row.ECode}</td>
                  <td style={{ border: "1px solid #bbb", padding: "2px 6px" }}>{row.Name}</td>
                  <td style={{ border: "1px solid #bbb", padding: "2px 6px" }}>{row.Designation}</td>
                  <td style={{ border: "1px solid #bbb", padding: "2px 6px" }}>{row.TimeIN}</td>
                  <td style={{ border: "1px solid #bbb", padding: "2px 6px" }}>{row.TimeOUT}</td>
                  <td style={{ border: "1px solid #bbb", padding: "2px 6px" }}>{row.Late}</td>
                  <td style={{ border: "1px solid #bbb", padding: "2px 6px" }}>{row.Remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <div style={{ textAlign: "right", fontSize: 12, marginTop: 16 }}>
        Page 1 of 1
      </div>
    </div>
  );
};

export default ReportsPreview;