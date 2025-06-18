import React from 'react';
import { CardHeader} from 'reactstrap';

const TableHeader = ({ title }) => {
    return (
        <React.Fragment>
            <CardHeader className="align-items-center d-flex py-2">
                <h4 className="card-title mb-0 flex-grow-1">{title}</h4>          
            </CardHeader>
        </React.Fragment>
    );
}

export default TableHeader;