import React from 'react'
import { Bar } from 'react-chartjs-2'
import { useWeb3 } from '../../../../store/web3'
import { convertFromWei } from '../../../../utils/bigNumber'
import { formatDate } from '../../../../utils/math/nonContract'

const ChartVol = () => {
  const web3 = useWeb3()

  const getChartData = () => {
    const data = []
    const labels = []
    const dataPoints = 60
    const length =
      web3.metrics.global.length >= dataPoints
        ? dataPoints
        : web3.metrics.global.length
    for (let i = 0; i < length; i++) {
      data.push(convertFromWei(web3.metrics.global[i].volUSD))
      labels.push(formatDate(web3.metrics.global[i].timestamp))
    }
    return [labels.reverse(), data.reverse()]
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
        text: 'Swap Volume ($USD)',
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
        label: 'Swap Volume ($USD)',
        data: getChartData()[1],
        fill: false,
        backgroundColor: '#228b22',
        borderColor: 'rgba(34, 139, 34, 0.2)',
      },
    ],
  }

  return (
    <>
      <Bar data={data} options={options} />
    </>
  )
}

export default ChartVol
