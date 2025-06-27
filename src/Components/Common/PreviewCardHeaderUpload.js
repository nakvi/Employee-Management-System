import React from 'react';
import { CardHeader, Input, Label, Button } from 'reactstrap';

const PreviewCardHeaderUpload = ({ title, onCancel, isEditMode }) => {
    return (
        <React.Fragment>
            <CardHeader className="align-items-center d-flex py-2">
                <h4 className="card-title mb-0 flex-grow-1">{title}</h4>
                <div className="flex-shrink-0">
                    <Button type='submit' color="success" className="add-btn me-1 py-1" id="create-btn"><i className="align-bottom me-1"></i>{isEditMode ? 'Update' : 'Save'}</Button>
                    <Button color="dark" className="add-btn me-1 py-1" onClick={onCancel}  ><i className="align-bottom me-1"></i> Cancel</Button>
                    <div className="d-inline-block position-relative">
                        <Button
                            tag="label"
                            type="button" // <-- Fix here
                            color="primary"
                            className="add-btn me-1 py-1 mb-0"
                            htmlFor="file-upload"
                        >
                            <i className="align-bottom me-1"></i>Upload
                        </Button>
                        <Input
                            type="file"
                            id="file-upload"
                            accept=".xlsx, .xls"
                            // onChange={handleFileUpload}
                            style={{ display: "none" }}
                        />
                    </div>
                    <Button
                        type="button"
                        className="btn btn-soft-danger btn-sm"
                    // onClick={handleExportSample}
                    >
                        Download Sample
                    </Button>
                </div>
            </CardHeader>
        </React.Fragment>
    );
}

export default PreviewCardHeaderUpload;