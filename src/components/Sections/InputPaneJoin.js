import React from "react";
import {PercentSlider} from "../../components/Common/common";

import {withNamespaces} from "react-i18next";

import {
    Col,
    Row,
    FormGroup,
    Input,
    Label,
    InputGroup,
    InputGroupAddon
} from "reactstrap";
import {withRouter} from "react-router-dom";

export const InputPaneJoin = (props) => {

    var slider = document.getElementById("percentSlider-" + props.name)
    let symbol = props.paneData?.symbol
    if (props.name === 'remove') {
        symbol = 'LP Tokens'
    }

    const clearSlider = () => {
        if (slider) {
            slider.value = 0
        }
        //console.log(slider.value)
    }

    return (
        <div>
            <FormGroup>
                <Row>
                    <Col sm="12">
                        <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                <Label className="input-group-text">{props.t("Input")}</Label>
                            </InputGroupAddon>
                            <Input
                                type="text"
                                className="form-control"
                                id={"manualInput-" + props.name}
                                bssize={'large'}
                                placeholder={'Manually input ' + symbol + ' here'}
                                onChange={(e) => {
                                    props.onInputChange(e)
                                    clearSlider()
                                }}
                                //   defaultValue=''
                                //   allowClear={true}
                                // addonAfter={<TokenDropDown default={props.paneData?.address}
                                //   changeToken={props.changeToken}
                                //   tokenList={props.tokenList} />}
                            />
                        </InputGroup>
                    </Col>
                </Row>
            </FormGroup>
            <div className="text-center">
                <PercentSlider changeAmount={props.changeAmount} name={props.name}/>
            </div>
        </div>
    )
};

export default withRouter(withNamespaces()(InputPaneJoin));
