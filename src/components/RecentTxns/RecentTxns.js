import React from 'react'

import { Row, Col, Table } from 'reactstrap'
import { getExplorerTxn } from '../../utils/extCalls'
import { formatShortString, getAddresses } from '../../utils/web3'
import { formatFromWei } from '../../utils/bigNumber'
import { usePoolFactory } from '../../store/poolFactory'
import { useWeb3 } from '../../store/web3'

const RecentTxns = () => {
  const web3 = useWeb3()
  const poolFactory = usePoolFactory()
  const addr = getAddresses()
  // const [selectedFilter, setselectedFilter] = useState(false)

  // const handleFilter = (formFilter) => {
  //   setselectedFilter(formFilter)
  // }

  return (
    <>
      <Row>
        {/* <Col>
          <FormGroup>
            <Input
              type="select"
              name="select"
              id="exampleSelect"
              onChange={(event) => handleFilter(event.target.value)}
            >
              <option>User</option>
              <option>Router</option>
              <option>Dao</option>
            </Input>
          </FormGroup>
        </Col> */}
        <Col>
          <h4>Recent Txns</h4>
        </Col>
      </Row>
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
            {web3.eventArray?.length > 0 &&
              web3.eventArray
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
