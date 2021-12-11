import React from 'react'
import { Bar } from 'react-chartjs-2'
import { convertFromWei } from '../../../../../utils/bigNumber'
import { formatDate } from '../../../../../utils/math/nonContract'

const ChartVolume = (props) => {
  const getChartData = () => {
    const data = []
    const labels = []
    const dataPoints = 60
    const length =
      props.metrics.length >= dataPoints ? dataPoints : props.metrics.length
    const metrics = props.metrics
      ? props.metrics.slice(0, length).reverse()
      : []
    for (let i = 0; i < length; i++) {
      data.push(convertFromWei(metrics[i].volUSD))
      labels.push(formatDate(metrics[i].timestamp))
    }
    return [labels, data]
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
        text: 'Swap Volume in $USD',
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
        label: 'Volume ($USD)',
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

export default ChartVolume
