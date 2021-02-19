import React from "react"
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import PaginationItem from "reactstrap/es/PaginationItem";
import PaginationLink from "reactstrap/es/PaginationLink";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import {ReactComponent as SpartanLogoRedBig} from "../../../assets/img/spartan_red_big.svg";
import {ReactComponent as SpartanLogoRedMedium} from "../../../assets/img/spartan_red_medium.svg";
import {ReactComponent as SpartanLogoRedSmall} from "../../../assets/img/spartan_red_small.svg";

import {ReactComponent as SpartanLogoWhiteBig} from "../../../assets/img/spartan_white_big.svg";
import {ReactComponent as SpartanLogoWhiteMedium} from "../../../assets/img/spartan_white_medium.svg";
import {ReactComponent as SpartanLogoWhiteSmall} from "../../../assets/img/spartan_white_small.svg";
import {ReactComponent as SpartanLogoBlackSmall} from "../../../assets/img/spartan_black_small.svg";


import {ReactComponent as PictoLendingBig} from "../../../assets/img/picto-lending-big.svg";
import {ReactComponent as PictoLendingSmall} from "../../../assets/img/picto-lending-small.svg";

import {ReactComponent as PictoPoolsBig} from "../../../assets/img/picto-pools-big.svg";
import {ReactComponent as PictoPoolsSmall} from "../../../assets/img/picto-pools-small.svg";

import {ReactComponent as PictoSyntheticsBig} from "../../../assets/img/picto-synthetics-big.svg";
import {ReactComponent as PictoSyntheticsSmall} from "../../../assets/img/picto-synthetics-small.svg";


const Samples = () => {
    return (
        <>
            <div className="content">
                <Card>
                    <Row>
                        <Col md="6">
                            <Card.Body>
                                <h1>Typogragraphy</h1>
                                <h1>Headline 1</h1>
                                <h2>Headline 2</h2>
                                <h3>Headline 3</h3>
                                <h4>Headline 4</h4>
                                <h5>Headline 5</h5>
                                <h6>Headline 6</h6>
                                <p>Body</p>
                            </Card.Body>
                        </Col>
                    </Row>
                </Card>

            </div>
        </>
    )
}

export default Samples
