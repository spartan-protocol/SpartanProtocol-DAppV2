import React from 'react'
import { Line } from 'react-chartjs-2'
import { useWeb3 } from '../../../../store/web3'
import { convertFromWei } from '../../../../utils/bigNumber'
import { formatDate } from '../../../../utils/math/nonContract'

const ChartTVL = () => {
  const web3 = useWeb3()

  const getChartData = () => {
    const data1 = []
    const data2 = []
    const labels = []
    const dataPoints = 30
    const length =
      web3.metrics.global.length >= dataPoints
        ? dataPoints
        : web3.metrics.global.length
    for (let i = 0; i < length; i++) {
      data1.push(convertFromWei(web3.metrics.global[i].tvlUSD))
      data2.push(convertFromWei(web3.metrics.global[i].tvlSPARTA))
      labels.push(formatDate(web3.metrics.global[i].timestamp))
    }
    return [labels.reverse(), data1.reverse(), data2.reverse()]
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
        text: 'Protocol TVL ($USD)',
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
