// import React from 'react';
// import ReactDragListView from 'react-drag-listview/lib/index.js';
// import { Card, CardBody, CardHeader, Col, ListGroup, ListGroupItem } from 'reactstrap';

// // Import Images
// // import avatar1 from "../../../assets/images/users/avatar-1.jpg";
// // import avatar2 from "../../../assets/images/users/avatar-2.jpg";
// // import avatar3 from "../../../assets/images/users/avatar-3.jpg";
// // import avatar4 from "../../../assets/images/users/avatar-4.jpg";
// // import avatar5 from "../../../assets/images/users/avatar-5.jpg";
// // import avatar6 from "../../../assets/images/users/avatar-6.jpg";
// // import avatar7 from "../../../assets/images/users/avatar-7.jpg";

// const avatar1 = "../../../assets/images/users/avatar-1.jpg";
// const avatar2 = "../../../assets/images/users/avatar-2.jpg";
// const avatar3 = "../../../assets/images/users/avatar-3.jpg";
// const avatar4 = "../../../assets/images/users/avatar-4.jpg";
// const avatar5 = "../../../assets/images/users/avatar-5.jpg";
// const avatar6 = "../../../assets/images/users/avatar-6.jpg";
// const avatar7 = "../../../assets/images/users/avatar-7.jpg";
// class Uinestable5 extends React.Component {
//     constructor(props) {
//         super(props);
//         const data = [
//             {
//                 id: 1, name: "David Houser", designation: "Lead Designer", img: avatar3, set1: [
//                     { id: 1, name: "Jame Baker", designation: "UI/UX Designer" }
//                 ]
//             },
//             {
//                 id: 2, name: "Mickie Reyes", designation: "Frontend Developer", img: avatar4, set1: [
//                     { id: 1, name: "Thomas Perez", designation: "Developer" },
//                     { id: 2, name: "Kim Wilson", designation: "Developer", img: avatar5 }
//                 ]
//             },
//             {
//                 id: 3, name: "Galen Coble", designation: "Backend Developer", img: avatar6, set1: [
//                     { id: 1, name: "Jean Wood", designation: "Developer", img: avatar7 }
//                 ]
//             },
//         ];

//         this.state = {
//             data
//         };
//     }

//     render() {
//         const that = this;
//         const dragProps = {
//             onDragEnd(fromIndex, toIndex) {
//                 const data = [...that.state.data];
//                 const item = data.splice(fromIndex, 1)[0];
//                 data.splice(toIndex, 0, item);
//                 that.setState({ data });
//             },
//             nodeSelector: 'li',
//             handleSelector: 'li'
//         };

//         return (
//             <React.Fragment>
//                 <Col lg={6}>
//                     <Card>
//                         <CardHeader>
//                             <h4 className="card-title mb-0">Team Nested List</h4>
//                         </CardHeader>
//                         <CardBody>
//                             <p className="text-muted">Use <code>nested-list nested-sortable</code> class to list-group class to set a nested list with sortable items where images are attached within a list-group-item div element.</p>
//                             <ListGroup className="nested-list nested-sortable">
//                                 <ListGroupItem className="nested-1">
//                                     <div className="d-flex align-items-center">
//                                         <div className="avatar-xs flex-shrink-0 me-3">
//                                             <img src={avatar1} alt="" className="img-fluid rounded-circle" />
//                                         </div>
//                                         <div className="flex-grow-1">
//                                             <h5 className="fs-14 mb-0">Daryl Wolcott</h5>
//                                             <p className="text-muted mb-0">CEO</p>
//                                         </div>
//                                     </div>
//                                     <ListGroup className="nested-list nested-sortable">
//                                         <ListGroupItem className="nested-2">
//                                             <div className="d-flex align-items-center">
//                                                 <div className="avatar-xs flex-shrink-0 me-3">
//                                                     <img src={avatar2} alt="" className="img-fluid rounded-circle" />
//                                                 </div>
//                                                 <div className="flex-grow-1">
//                                                     <h5 className="fs-14 mb-0">Jacob Stanfield</h5>
//                                                     <p className="text-muted mb-0">Project Manager</p>
//                                                 </div>
//                                             </div>
//                                             <ReactDragListView {...dragProps}>
//                                                 {this.state.data.map((item, key) => (
//                                                     <React.Fragment key={key}>
//                                                         <ListGroup className="nested-list nested-sortable" key={key}>
//                                                             <ListGroupItem className="nested-3">
//                                                                 <div className="d-flex align-items-center">
//                                                                     <div className="avatar-xs flex-shrink-0 me-3">
//                                                                         <img src={item.img} alt="" className="img-fluid rounded-circle" />
//                                                                     </div>
//                                                                     <div className="flex-grow-1">
//                                                                         <h5 className="fs-14 mb-0">{item.name}</h5>
//                                                                         <p className="text-muted mb-0">{item.designation}</p>
//                                                                     </div>
//                                                                 </div>
//                                                                 <ListGroup className="nested-list nested-sortable">
//                                                                     {item.set1.map((item, key) => (<ListGroupItem className="nested-4" key={key}>
//                                                                         <div className="d-flex align-items-center">
//                                                                             <div className="avatar-xs flex-shrink-0 me-3">
//                                                                                 <div className="avatar-title rounded-circle">
//                                                                                     {item.img ? <img src={item.img} alt="" className="img-fluid rounded-circle" /> : <i className="ri-user-2-fill"></i>}
//                                                                                 </div>
//                                                                             </div>
//                                                                             <div className="flex-grow-1">
//                                                                                 <h5 className="fs-14 mb-0">{item.name}</h5>
//                                                                                 <p className="text-muted mb-0">{item.designation}</p>
//                                                                             </div>
//                                                                         </div>
//                                                                     </ListGroupItem>))}
//                                                                 </ListGroup>
//                                                             </ListGroupItem>
//                                                         </ListGroup>
//                                                     </React.Fragment>
//                                                 ))}
//                                             </ReactDragListView>
//                                         </ListGroupItem>
//                                     </ListGroup>
//                                 </ListGroupItem>
//                             </ListGroup>
//                         </CardBody>
//                     </Card>
//                 </Col>
//             </React.Fragment>

//         );
//     }
// }

// export default Uinestable5;

// import React, { useState } from 'react';
// import { Card, CardBody, CardHeader, Col, ListGroup, ListGroupItem } from 'reactstrap';

// const Uinestable5 = () => {
//   const [hierarchy, setHierarchy] = useState([
//     {
//       id: 1,
//       name: "Ayyaz Khan",
//       designation: "Head of Department",
//       visible: true,
//       children: [
//         {
//           id: 2,
//           name: "Muhammad Abubakar",
//           designation: "Manager",
//           visible: true,
//           children: [
//             {
//               id: 3,
//               name: "Umair Akhtar",
//               designation: "Senior Officer",
//               visible: true,
//               children: [
//                 {
//                   id: 4,
//                   name: "Fahad Saleem",
//                   designation: "Junior Officer"
//                 }
//               ]
//             }
//           ]
//         },
//         {
//           id: 5,
//           name: "Ibrar Ahmad Khan",
//           designation: "Team Lead",
//           visible: true,
//           children: [
//             {
//               id: 6,
//               name: "Ahmer Armaghan",
//               designation: "Officer"
//             }
//           ]
//         },
//         {
//           id: 7,
//           name: "Zeeshan Khalid",
//           designation: "Developer"
//         }
//       ]
//     }
//   ]);

//   const toggleVisibility = (id) => {
//     const update = (nodes) =>
//       nodes.map(node => {
//         if (node.id === id) {
//           return { ...node, visible: !node.visible };
//         } else if (node.children) {
//           return { ...node, children: update(node.children) };
//         }
//         return node;
//       });

//     setHierarchy(update(hierarchy));
//   };

//   const renderNode = (node, level = 1) => {
//     return (
//       <ListGroupItem key={node.id} className={`nested-${level}`}>
//         <div className="d-flex align-items-center">
//           {node.children ? (
//             <div
//               onClick={() => toggleVisibility(node.id)}
//               style={{
//                 cursor: "pointer",
//                 fontSize: "16px",
//                 marginRight: '8px',
//                 width: '20px',
//                 textAlign: 'center'
//               }}
//             >
//               <i className={`ri-arrow-${node.visible ? "down" : "right"}-s-line`}></i>
//             </div>
//           ) : (
//             <div style={{ width: '20px', marginRight: '8px' }}></div>
//           )}

//           <div>
//             <h5 className="fs-14 mb-0">{node.name}</h5>
//             {/* <p className="text-muted mb-0">{node.designation}</p> */}
//           </div>
//         </div>

//         {node.children && node.visible && (
//           <ListGroup className="nested-list nested-sortable mt-2 ms-4">
//             {node.children.map(child => renderNode(child, level + 1))}
//           </ListGroup>
//         )}
//       </ListGroupItem>
//     );
//   };

//   return (
//     <React.Fragment>
//       <Col lg={6}>
//         <Card>
//           <CardHeader>
//             <h4 className="card-title mb-0">Employee Hierarchy</h4>
//           </CardHeader>
//           <CardBody>
//             <ListGroup className="nested-list nested-sortable">
//               {hierarchy.map(root => renderNode(root))}
//             </ListGroup>
//           </CardBody>
//         </Card>
//       </Col>
//     </React.Fragment>
//   );
// };

// export default Uinestable5;

// import React, { useState } from 'react';
// import { Card, CardBody, CardHeader, Col, ListGroup, ListGroupItem } from 'reactstrap';
// const employees = [
//   {
//     id: "05-001",
//     name: "Ayyaz Khan",
//     email: "ayyaz.khan@zetacorp.com",
//     designation: "CEO",
//     children: [
//       {
//         id: "05-002",
//         name: "Muhammad Abubakar",
//         email: "george@kijero.com",
//         designation: "Regional Head",
//         children: [
//           {
//             id: "05-007",
//             name: "Hafiz Kabir Ali Ansari",
//             email: "issac@kijero.com",
//             designation: "Sales Executive"
//           },
//           {
//             id: "05-044",
//             name: "Wahab Akram Awan",
//             email: "brad@kijero.com",
//             designation: "Manager Procurement & Operations"
//           },
//           {
//             id: "05-081",
//             name: "Hamad Rauf",
//             email: "tom@kijero.com",
//             designation: "Sales Executive"
//           }
//         ]
//       },
//       {
//         id: "05-004",
//         name: "Ibrar Ahmad Khan",
//         email: "steve.omar@kijero.com",
//         designation: "Regional Head",
//         children: [
//           {
//             id: "05-056",
//             name: "Nashit Zahid",
//             email: "joseph@kijero.com",
//             designation: "Sales Executive"
//           }
//         ]
//       }
//     ]
//   }
// ];

// const TreeNode = ({ node, initiallyOpen = false }) => {
//   const [open, setOpen] = useState(initiallyOpen);
//   const hasChildren = node.children && node.children.length > 0;

//   return (
//     <div style={{ marginLeft: '20px' }}>
//       <div
//         onClick={() => hasChildren && setOpen(!open)}
//         style={{ cursor: hasChildren ? 'pointer' : 'default' }}
//       >
//         <span style={{ marginRight: '6px' }}>
//           {hasChildren ? (open ? '▾' : '▸') : '•'}
//         </span>
//         <strong>{node.id}</strong> – {node.name} ({node.email}){' '}
//         <span style={{ color: 'gray' }}>({node.designation})</span>
//       </div>

//       {hasChildren && open && (
//         <div style={{ marginLeft: '20px', marginTop: '5px' }}>
//           {node.children.map((child, index) => (
//             <TreeNode node={child} key={index} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const EmployeeTree = () => {
//   return (
//      <React.Fragment>
//        <Col lg={6}>
//          <Card>
//            <CardHeader>
//              <h4 className="card-title mb-0">Employee Hierarchy</h4>
//            </CardHeader>
//            <CardBody>
//              <ListGroup className="nested-list nested-sortable">
//                 {employees.map((emp, i) => (
//                         <TreeNode node={emp} key={i} initiallyOpen={true} />
//                     ))}
//                    </ListGroup>
//            </CardBody>
//          </Card>
//        </Col>
//      </React.Fragment>
//   );
// };

// export default EmployeeTree;


import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Col, ListGroup } from 'reactstrap';

const EmployeeTree = () => {
  // Flat response (mocked API data)
  const flatData = [
    {
      HeadID: "2",
      HeadEmpCode: "05-001",
      HeadName: "Ayyaz Khan (Ayyaz Khan)--(ayyaz.khan@zetaecorp.com) -(CEO)",
      EmployeeID: "11",
      EmpCode: "05-013",
      EmployeeName: "Umair Akhtar (UMAIR)--(umair@miatlantic.com) -(Manager Sales)"
    },
    {
      HeadID: "2",
      HeadEmpCode: "05-001",
      HeadName: "Ayyaz Khan (Ayyaz Khan)--(ayyaz.khan@zetaecorp.com) -(CEO)",
      EmployeeID: "3",
      EmpCode: "05-002",
      EmployeeName: "Muhammad Abubakar (George Ben - Andy)--(george@kijero.com) -(Regional Head)"
    }
  ];

  // Convert flat data to tree structure
  const buildEmployeeTree = (data) => {
    const headMap = {};

    data.forEach(item => {
      const headID = item.HeadID;

      // If this head not already added
      if (!headMap[headID]) {
        headMap[headID] = {
          id: item.HeadEmpCode,
          name: item.HeadName.split('(')[0].trim(),
          email: item.HeadName.match(/\(([^)]+@[^)]+)\)/)?.[1] || '',
          designation: item.HeadName.match(/\- *\(([^)]+)\)/)?.[1] || '',
          children: []
        };
      }

      // Add subordinate under the head
      headMap[headID].children.push({
        id: item.EmpCode,
        name: item.EmployeeName.split('(')[0].trim(),
        email: item.EmployeeName.match(/\(([^)]+@[^)]+)\)/)?.[1] || '',
        designation: item.EmployeeName.match(/\- *\(([^)]+)\)/)?.[1] || '',
      });
    });

    return Object.values(headMap);
  };

  const employees = buildEmployeeTree(flatData);

  // TreeNode component
  const TreeNode = ({ node, initiallyOpen = false }) => {
    const [open, setOpen] = useState(initiallyOpen);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div style={{ marginLeft: '20px' }}>
        <div
          onClick={() => hasChildren && setOpen(!open)}
          style={{ cursor: hasChildren ? 'pointer' : 'default' }}
        >
          <span style={{ marginRight: '6px' }}>
            {hasChildren ? (open ? '▾' : '▸') : ''}
          </span>
          <strong>{node.id}</strong> – {node.name} ({node.email}){' '}
          <span style={{ color: 'gray' }}>({node.designation})</span>
        </div>

        {hasChildren && open && (
          <div style={{ marginLeft: '20px', marginTop: '5px' }}>
            {node.children.map((child, index) => (
              <TreeNode node={child} key={index} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render the tree inside a card
  return (
    <React.Fragment>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <h4 className="card-title mb-0">Employee Hierarchy</h4>
          </CardHeader>
          <CardBody>
            <ListGroup className="nested-list nested-sortable">
              {employees.map((emp, i) => (
                <TreeNode node={emp} key={i} initiallyOpen={true} />
              ))}
            </ListGroup>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default EmployeeTree;
