import React from 'react';
import { CardHeader, Button } from 'reactstrap';

const PreviewCardHeader2 = ({ title, onFetch }) => {
  return (
    <React.Fragment>
      <CardHeader className="align-items-center d-flex py-2">
        <h4 className="card-title mb-0 flex-grow-1">{title}</h4>
        <div className="flex-shrink-0">
          <Button
            color="success"
            className="add-btn me-1 py-1"
            id="create-btn"
            onClick={onFetch} // Call the passed onFetch function
          >
            <i className="align-bottom me-1"></i>Fetch
          </Button>
          <Button
            type="submit"
            color="success"
            className="add-btn me-1 py-1"
            id="create-btn"
          >
            <i className="align-bottom me-1"></i>Save
          </Button>
          <Button
            color="dark"
            className="add-btn me-1 py-1"
          >
            <i className="align-bottom me-1"></i>Cancel
          </Button>
        </div>
      </CardHeader>
    </React.Fragment>
  );
};

export default PreviewCardHeader2;