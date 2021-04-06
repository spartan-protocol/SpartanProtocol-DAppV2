import React, { useEffect, useState } from 'react'

import { Row, Table } from 'reactstrap'
import { getExplorerTxn } from '../../utils/extCalls'
import { formatShortString } from '../../utils/web3'

const RecentTxns = ({ contracts }) => {
  const [txnArray, setTxnArray] = useState([])
  useEffect(() => {
    const listen = async (contract) => {
      await contract.on('*', (eventObject) => {
        setTxnArray((oldArray) => [...oldArray, eventObject])
        console.log(eventObject)
      })
    }

    const mapOut = () => {
      if (contracts) {
        //   const filter = contract.filters
        //   console.log(contract)
        //   const logs = await contract.queryFilter(filter, 0, 'latest')
        //   console.log(logs)
        for (let i = 0; i < contracts.length; i++) {
          listen(contracts[i])
        }
      }
    }
    mapOut()
    return () => {
      if (contracts) {
        for (let i = 0; i < contracts.length; i++) {
          contracts[i]?.removeAllListeners()
        }
      }
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
                <tr key={txn.transactionHash + txn.event + txn.logIndex}>
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
