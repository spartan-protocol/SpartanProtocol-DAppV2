import React, { useEffect, useState } from 'react'

import { Row, Table } from 'reactstrap'
import { getExplorerTxn } from '../../utils/extCalls'
import { formatShortString } from '../../utils/web3'

const RecentTxns = ({ contract }) => {
  const [txnArray, setTxnArray] = useState([])
  useEffect(() => {
    const listen = async () => {
      if (contract) {
        //   const filter = contract.filters
        //   console.log(contract)
        //   const logs = await contract.queryFilter(filter, 0, 'latest')
        //   console.log(logs)
        await contract.on('*', (eventObject) => {
          setTxnArray((oldArray) => [...oldArray, eventObject])
          console.log(txnArray)
        })
      }
    }
    listen()
    return () => {
      contract?.removeAllListeners()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <h4>Recent Txns</h4>
      <Row>
        <Table borderless className="m-3">
          <thead className="text-primary">
            <tr>
              <th>block #</th>
              <th>event</th>
              <th>txnHash</th>
            </tr>
          </thead>
          <tbody>
            {txnArray?.length > 0 &&
              txnArray?.map((txn) => (
                <tr key={txn.transactionHash + txn.event}>
                  <td>{txn.blockNumber}</td>
                  <td>{txn.event}</td>
                  <td>
                    <a
                      href={getExplorerTxn(txn.transactionHash)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {formatShortString(txn.transactionHash)}
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Row>
    </>
  )
}

export default RecentTxns
