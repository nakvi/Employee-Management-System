import React from "react";
import { styles } from "./style.ts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Invoice({ employee }) {
  const printRef = React.useRef(null);

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice.pdf");
  };

  if (!employee) return <div>No employee selected.</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <div ref={printRef} className="p-8 bg-white border border-gray-200">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
              <p className="text-sm text-gray-600">Invoice #{employee.EmpCode || "N/A"}</p>
            </div>
            <div className="text-right">
              <h2 className="font-semibold">{employee.CompanyName || "Company Name"}</h2>
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Bill To:</h3>
            <p className="text-gray-700">
              {employee.EName} <br />
              {employee.FName && <>Father: {employee.FName}<br /></>}
              CNIC: {employee.NIC} <br />
              Designation: {employee.DesignationTitle} <br />
              Department: {employee.DepartmentTitle || employee.DeptName || ""}
            </p>
          </div>
          <table className="w-full mb-8 border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Description</th>
                <th className="border p-2 text-right">Quantity</th>
                <th className="border p-2 text-right">Unit Price</th>
                <th className="border p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Basic Salary</td>
                <td className="border p-2 text-right">1</td>
                <td className="border p-2 text-right">
                  {employee.BasicSalary ? `$${employee.BasicSalary}` : "$0.00"}
                </td>
                <td className="border p-2 text-right">
                  {employee.BasicSalary ? `$${employee.BasicSalary}` : "$0.00"}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>
                  {employee.BasicSalary ? `$${employee.BasicSalary}` : "$0.00"}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax (10%):</span>
                <span>
                  {employee.BasicSalary
                    ? `$${(employee.BasicSalary * 0.1).toFixed(2)}`
                    : "$0.00"}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>
                  {employee.BasicSalary
                    ? `$${(employee.BasicSalary * 1.1).toFixed(2)}`
                    : "$0.00"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}