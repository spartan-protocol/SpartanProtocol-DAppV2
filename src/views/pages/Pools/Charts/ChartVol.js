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
    const dataPoints = 30
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

  const dataColorArray = () => {
    const array = []
    const { length } = getChartData()[1]
    for (let i = 0; i < length; i++) {
      if (i < length - 1) {
        array.push('#228b22')
      } else {
        array.push('#228b2273')
      }
    }
    return array
  }

  const data = {
    labels: getChartData()[0],
    datasets: [
      {
        label: 'Swap Volume ($USD)',
        data: getChartData()[1],
        fill: false,
        backgroundColor: dataColorArray(),
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
