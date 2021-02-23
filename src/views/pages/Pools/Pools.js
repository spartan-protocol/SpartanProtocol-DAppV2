import React from "react";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { ethers } from "ethers";

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
import { getListedAssets, getListedPools, getTokenDetails, calcAsymmetricShare, calcValueInBase, calcValueInToken, calcBasePPinToken, calcTokenPPinBase, calcPart } from "../../../utils/web3Utils";
import { BNB_ADDR, WBNB_ADDR, SPARTA_ADDR } from "../../../utils/web3";

const BN = ethers.BigNumber.from

const Pools = () => {

  const wallet = useWallet()

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
                <Button className="btn-fill" color="primary" type="submit" onClick={()=> getTokenDetails(SPARTA_ADDR)}>
                  Get sparta token details
                </Button>
                <Button className="btn-fill" color="primary" type="submit" onClick={()=> getTokenDetails(BNB_ADDR)}>
                  Get BNB token details
                </Button>
                <Button className="btn-fill" color="primary" type="submit" onClick={()=> calcAsymmetricShare('1000000000000000000', '2000000000000000000', '3000000000000000000')}>
                  Calc asym share
                </Button>
                <Button className="btn-fill" color="primary" type="submit" onClick={()=> calcValueInBase(BNB_ADDR, '10000000000')}>
                  Get value in SPARTA
                </Button>
                <Button className="btn-fill" color="primary" type="submit" onClick={()=> calcValueInToken(BNB_ADDR, '10000000000')}>
                  Get value in TOKEN
                </Button>
                <Button className="btn-fill" color="primary" type="submit" onClick={()=> calcBasePPinToken(BNB_ADDR, '10000000000')}>
                  Get SPARTA purchasing power in TOKEN
                </Button>
                <Button className="btn-fill" color="primary" type="submit" onClick={()=> calcTokenPPinBase(BNB_ADDR, '10000000000')}>
                  Get TOKEN purchasing power in SPARTA
                </Button>
                <Button className="btn-fill" color="primary" type="submit" onClick={()=> calcPart(10000, '10000000000')}>
                  Calc part (100%)
                </Button>
                <Button className="btn-fill" color="primary" type="submit" onClick={()=> calcPart(10000, '10000000000')}>
                  GasfasfA
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
