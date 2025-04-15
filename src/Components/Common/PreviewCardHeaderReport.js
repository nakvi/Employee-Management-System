import React from "react";
import { CardHeader, Input, Label, Button } from "reactstrap";

const PreviewCardHeaderReport = ({ title, onFetch, onGeneratePDF, onCancel  }) => {
  return (
    <React.Fragment>
      <CardHeader className="align-items-center d-flex py-2">
        <h4 className="card-title mb-0 flex-grow-1">{title}</h4>
        <div className="flex-shrink-0">
          <Button
            type="button"
            color="success"
            className="add-btn me-1 py-1"
            id="fetch-btn"
            onClick={onFetch}
          >
            <i className="bi bi-search me-1"></i> Fetch
          </Button>

          <Button
            type="button"
            color="danger"
            className="add-btn me-1 py-1"
            id="pdf-btn"
            onClick={onGeneratePDF}
          >
            <i className="bi bi-file-earmark-pdf me-1"></i> PDF
          </Button>

          <Button
            type="button"
            color="dark"
            className="add-btn me-1 py-1"
            id="cancel-btn"
            onClick={onCancel}
          >
            <i className="bi bi-x-circle me-1"></i> Cancel
          </Button>
        </div>
      </CardHeader>
    </React.Fragment>
  );
};

export default PreviewCardHeaderReport;
