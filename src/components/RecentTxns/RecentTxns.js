import React, { useEffect, useState } from 'react'

import { Row, Table } from 'reactstrap'
import { getExplorerTxn } from '../../utils/extCalls'
import { formatShortString, getAddresses } from '../../utils/web3'
import { formatFromWei } from '../../utils/bigNumber'
import { usePoolFactory } from '../../store/poolFactory'

const RecentTxns = ({ contracts }) => {
  const [txnArray, setTxnArray] = useState([])
  const poolFactory = usePoolFactory()
  const addr = getAddresses()

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
              <th>Block #</th>
              <th>Event</th>
              <th>Input</th>
              <th>OutPut</th>
              <th>txHash</th>
            </tr>
          </thead>
          <tbody>
            {txnArray?.length > 0 &&
              txnArray
                ?.filter((e) => e.event !== 'Transfer')
                .map((txn) => (
                  <tr key={txn.transactionHash + txn.event + txn.logIndex}>
                    <td>{txn.blockNumber}</td>
                    <td>{txn.event}</td>
                    <td>
                      {txn.event === 'AddLiquidity' &&
                        `${formatFromWei(
                          txn.args?.inputBase.toString(),
                          2,
                        )} SPARTA : ${formatFromWei(
                          txn.args?.inputToken.toString(),
                          2,
                        )} ${
                          poolFactory.finalLpArray?.filter(
                            (asset) => asset.poolAddress === txn.address,
                          )[0]?.symbol
                        }`}

                      {txn.event === 'RemoveLiquidity' &&
                        `${formatFromWei(
                          txn.args?.unitsClaimed.toString(),
                          2,
                        )} ${
                          poolFactory.finalLpArray?.filter(
                            (asset) => asset.poolAddress === txn.address,
                          )[0]?.symbol
                        }-SPP`}
                      {txn.event === 'Swapped' &&
                        `${formatFromWei(
                          txn.args?.inputAmount.toString(),
                          2,
                        )} ${
                          poolFactory.finalLpArray?.filter((asset) => {
                            let targetToken = txn.args.tokenFrom
                            if (targetToken === addr.wbnb) {
                              targetToken = addr.bnb
                            }
                            return asset.tokenAddress === targetToken
                          })[0]?.symbol
                        }`}
                    </td>
                    <td>
                      {txn.event === 'AddLiquidity' &&
                        `${formatFromWei(
                          txn.args?.unitsIssued.toString(),
                          2,
                        )} ${
                          poolFactory.finalLpArray?.filter(
                            (asset) => asset.poolAddress === txn.address,
                          )[0]?.symbol
                        }-SPP`}
                      {txn.event === 'RemoveLiquidity' &&
                        `${formatFromWei(
                          txn.args?.outputBase.toString(),
                          2,
                        )} SPARTA : ${formatFromWei(
                          txn.args?.outputToken.toString(),
                          2,
                        )} ${
                          poolFactory.finalLpArray?.filter(
                            (asset) => asset.poolAddress === txn.address,
                          )[0]?.symbol
                        }`}
                      {txn.event === 'Swapped' &&
                        `${formatFromWei(
                          txn.args?.outputAmount.toString(),
                          2,
                        )} ${
                          poolFactory.finalLpArray?.filter((asset) => {
                            let targetToken = txn.args.tokenTo
                            if (targetToken === addr.wbnb) {
                              targetToken = addr.bnb
                            }
                            return asset.tokenAddress === targetToken
                          })[0]?.symbol
                        }`}
                    </td>
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
