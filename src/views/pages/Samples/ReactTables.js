
import React from "react";
import classNames from "classnames";
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Row,
    Col,
    Button,
} from "reactstrap";

import ReactTable from "../../../components/ReactTable/ReactTable";

const dataTable = [
    ["BTC", "$33.20", "$17,570,442", "$17,570,442"],
    ["BNB", "$33.20", "$17,570,442", "$17,570,442"],
    ["RAVEN", "$33.20", "$17,570,442", "$17,570,442"],
    ["DOT", "$33.20", "$17,570,442", "$17,570,442"],
    ["USTD", "$33.20", "$17,570,442", "$17,570,442"],
    ["CREAM", "$33.20", "$17,570,442", "$17,570,442"],
    ["BTC", "$33.20", "$17,570,442", "$17,570,442"],
    ["BNB", "$33.20", "$17,570,442", "$17,570,442"],
    ["RAVEN", "$33.20", "$17,570,442", "$17,570,442"],
    ["DOT", "$33.20", "$17,570,442", "$17,570,442"],
    ["USTD", "$33.20", "$17,570,442", "$17,570,442"],
    ["CREAM", "$33.20", "$17,570,442", "$17,570,442"],
    ["BTC", "$33.20", "$17,570,442", "$17,570,442"],
    ["BNB", "$33.20", "$17,570,442", "$17,570,442"],
    ["RAVEN", "$33.20", "$17,570,442", "$17,570,442"],
    ["DOT", "$33.20", "$17,570,442", "$17,570,442"],
    ["USTD", "$33.20", "$17,570,442", "$17,570,442"],
    ["CREAM", "$33.20", "$17,570,442", "$17,570,442"],

];

const ReactTables = () => {
    const [data, setData] = React.useState(
        dataTable.map((prop, key) => {
            return {
                id: key,
                name: prop[0],
                position: prop[1],
                office: prop[2],
                age: prop[3],
                actions: (
                    // we've added some custom button actions
                    <div className="actions-right">
                        {/* use this button to add a like kind of action */}
                        <Button
                            onClick={() => {
                                let obj = data.find((o) => o.id === key);
                                alert(
                                    "You've clicked this button on \n{ \nName: " +
                                    obj.name +
                                    ", \nToken: " +
                                    obj.position +
                                    ", \noffice: " +
                                    obj.office +
                                    ", \nage: " +
                                    obj.age +
                                    "\n}."
                                );
                            }}
                            color="info"
                            size="sm"
                            className={classNames("btn btn-primary", {
                                "btn-neutral": key < 5,
                            })}
                        >
                            <i className="bd-icons icon-heart-2" />
                        </Button>{" "}
                        {/* use this button to add a edit kind of action */}
                        <Button
                            onClick={() => {
                                let obj = data.find((o) => o.id === key);
                                alert(
                                    "You've clicked EDIT button on \n{ \nName: " +
                                    obj.name +
                                    ", \nposition: " +
                                    obj.position +
                                    ", \noffice: " +
                                    obj.office +
                                    ", \nage: " +
                                    obj.age +
                                    "\n}."
                                );
                            }}
                            color="primary"
                            size="sm"
                            className={classNames("btn btn-primary", {
                                "btn-primary": key < 5,
                            })}
                        >
                            <i className="btn btn-primary" />
                        </Button>{" "}
                        {/* use this button to remove the data row */}
                        <Button
                            onClick={() => {
                                var newdata = data;
                                newdata.find((o, i) => {
                                    if (o.id === key) {
                                        // here you should add some custom code so you can delete the data
                                        // from this component and from your server as well
                                        data.splice(i, 1);
                                        console.log(data);
                                        return true;
                                    }
                                    return false;
                                });
                                setData(newdata);
                            }}
                            color="primary"
                            size="sm"
                            className={classNames("btn btn-primary", {
                                "btn-neutral": key < 5,
                            })}
                        >
                            <i className="btn btn-primary" />
                        </Button>{" "}
                    </div>
                ),
            };
        })
    );
    return (
        <>
            <div className="content">
                <Col md={8} className="ml-auto mr-auto">
                    <h2 className="text-center">React Table</h2>
                    <p className="text-center">React table with filtering lets create some filers maybe ?!!
                    </p>
                </Col>
                <Row className="mt-5">
                    <Col xs={12} md={12}>
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">React Table</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <ReactTable
                                    data={data}
                                    filterable
                                    resizable={false}
                                    columns={[
                                        {
                                            Header: "Name",
                                            accessor: "name",
                                        },
                                        {
                                            Header: "Position",
                                            accessor: "position",
                                        },
                                        {
                                            Header: "Office",
                                            accessor: "office",
                                        },
                                        {
                                            Header: "Age",
                                            accessor: "age",
                                        },
                                        {
                                            Header: "Actions",
                                            accessor: "actions",
                                            sortable: false,
                                            filterable: false,
                                        },
                                    ]}
                                    defaultPageSize={10}
                                    showPaginationTop
                                    showPaginationBottom={false}
                                    className="-striped -highlight"
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default ReactTables;
