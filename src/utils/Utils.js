import {
    useWeb3,
    getApproval
} from './web3Store';
import React, {useEffect} from 'react';
import {CardText} from 'reactstrap';
import { useDispatch } from "react-redux";

const Utils = () => {
    const web3 = useWeb3();
    const dispatch = useDispatch();

    useEffect(() => {
       dispatch(getApproval("0x43364696e478E344E95831CE8427623202e5CBFb", "0xd46e8dd67c5d32be8058bb8eb970870f07244567"));
    }, []);

    return (
        <>
            <div className="content">
                <CardText>{web3.error ? JSON.stringify(web3.error) : JSON.stringify(web3.contract)}</CardText>
            </div>
            
        </>
    );


}

export default Utils;