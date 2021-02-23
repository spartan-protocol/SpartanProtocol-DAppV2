import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";
import { getListedBond } from "../../../utils/web3Bond";
import { addLiquidity } from "../../../utils/web3Router";
import { getListedAssets, getListedPools } from "../../../utils/web3Utils";

const Pools = () => {
  return (
    <>
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h1 className="title">Pools</h1>
              </CardHeader>
              <CardBody>
                
              </CardBody>
              <CardFooter>
                <Button className="btn-fill" color="primary" type="submit" onClick={()=> addLiquidity()}>
                  Test Add Liq Sym
                </Button>
                <Button className="btn-fill" color="primary" type="submit">
                  Test Add Liq Asym
                </Button>
                <Button className="btn-fill" color="primary" type="submit">
                  Test Remove Liq Sym
                </Button>
                <Button className="btn-fill" color="primary" type="submit">
                  Test Remove Liq Asym
                </Button>
                <Button className="btn-fill" color="primary" type="submit" onClick={ () => getListedBond() }>
                  Test Get Bond Assets
                </Button>
                <Button className="btn-fill" color="primary" type="submit" onClick={ () => getListedPools() }>
                  Test Get Listed Pools
                </Button>
                <Button className="btn-fill" color="primary" type="submit" onClick={ () => getListedAssets() }>
                  Test Get Listed Tokens
                </Button>
              </CardFooter>
            </Card>
          </Col>
          <Col md="4">
            <Card className="card-user">
              <CardBody>
                <CardText />
                <div className="author">
                  <div className="block block-one" />
                  <div className="block block-two" />
                  <div className="block block-three" />
                  <div className="block block-four" />
                  <div>
                    <img
                      alt="..."
                      className="avatar"
                      src={require("../../../assets/img/spartan_black_small.svg").default}
                    />
                    <h5 className="title">Title</h5>
                  </div>
                  <p className="description"></p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Pools;
