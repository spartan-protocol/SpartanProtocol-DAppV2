import React from 'react'
import { Line } from 'react-chartjs-2'
import { useWeb3 } from '../../../../../store/web3'
import { BN, convertFromWei } from '../../../../../utils/bigNumber'
import { formatDate } from '../../../../../utils/math/nonContract'

const ChartTVL = (props) => {
  const web3 = useWeb3()

  const getTVL = () => {
    let tvl = BN(0)
    if (props.poolItem) {
      tvl = tvl.plus(props.poolItem.baseAmount).times(2)
    }
    if (tvl > 0) {
      return tvl.times(web3.spartaPrice)
    }
    return '0.00'
  }

  const getChartData = () => {
    const data1 = []
    const labels = []
    const dataPoints = props.period
    const length =
      props.metrics.length >= dataPoints ? dataPoints : props.metrics.length
    if (props.poolItem) {
      data1.push(convertFromWei(getTVL(), 0))
      labels.push('Current')
    }
    for (let i = 0; i < length; i++) {
      data1.push(convertFromWei(props.metrics[i].tvlUSD))
      labels.push(formatDate(props.metrics[i].timestamp))
    }
    return [labels.reverse(), data1.reverse()]
  }

  const options = {
    scales: {
      x: {
        display: false,
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Total Value Locked in $USD',
      },
      legend: {
        display: false,
      },
    },
  }

  const data = {
    labels: getChartData()[0],
    datasets: [
      {
        label: 'TVL ($USD)',
        data: getChartData()[1],
        fill: false,
        backgroundColor: '#228b22',
        borderColor: 'rgba(34, 139, 34, 0.2)',
      },
      // {
      //   label: 'TVL (SPARTA)',
      //   data: getChartData()[2],
      //   fill: false,
      //   backgroundColor: 'rgb(255, 99, 132)',
      //   borderColor: 'rgba(255, 99, 132, 0.2)',
      // },
    ],
  }

  return (
    <>
      <Line data={data} options={options} />
    </>
  )
}

export default ChartTVL
