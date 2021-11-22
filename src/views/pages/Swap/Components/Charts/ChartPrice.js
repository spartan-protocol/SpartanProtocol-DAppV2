import React from 'react'
import { Line } from 'react-chartjs-2'
import { formatDate } from '../../../../../utils/math/nonContract'

const ChartRevenue = (props) => {
  const getChartData = () => {
    const data1 = []
    const labels = []
    const dataPoints = 29
    const length =
      props.metrics.length >= dataPoints ? dataPoints : props.metrics.length
    const metrics = props.metrics
      ? props.metrics.slice(0, length).reverse()
      : []
    for (let i = 0; i < length; i++) {
      // console.log(metrics[0].pool.id)
      data1.push(metrics[i].tokenPrice)
      labels.push(formatDate(metrics[i].timestamp))
    }
    data1.push(props.tokenPrice)
    labels.push('Current')
    return [labels, data1]
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
        text: 'Token Price ($USD)',
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
        label: 'Token Price ($USD)',
        data: getChartData()[1],
        fill: false,
        backgroundColor: '#228b22',
        borderColor: 'rgba(34, 139, 34, 0.2)',
      },
    ],
  }

  return (
    <>
      <Line data={data} options={options} />
    </>
  )
}

export default ChartRevenue
