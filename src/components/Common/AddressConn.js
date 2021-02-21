import React, {useEffect, useContext} from 'react'


const AddressConn = (props) => {

    return (
        <>
            <>
                <div className="btn ml-1" onClick={() => (props)}>
                    <i className="icon-medium icon-wallet icon-dark"/>
                </div>
                <div className="btn mr-1" onClick={() => (props)}>
                    <i className="icon-medium icon-cycle icon-dark"/>
                </div>
            </>
            <>
                <div className="btn ml-1" onClick={""}>
                    <i className="icon-medium icon-wallet icon-dark"/>
                </div>
                <div className="btn mr-1" onClick={""}>
                    <i className="icon-medium icon-cycle icon-dark"/>
                </div>
            </>
            <>
                <div className="btn ml-1" onClick={""}>
                    <i className="icon-medium icon-wallet icon-dark"/>
                </div>
                <div className="btn mr-1" onClick={""}>
                    <i className="icon-medium icon-cycle icon-dark"/>
                </div>
            </>
        </>
    )
}
export default AddressConn
