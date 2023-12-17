import React from 'react'
import { Bar } from 'react-chartjs-2'
import { getUnixStartOfDay } from '../../../../utils/helpers.ts'
import { formatDate } from '../../../../utils/math/nonContract'

/*
 * @param {array} metrics - array of objects for metrics
 * @param {number} period - number of periods to show
 *
 */
const ChartTxnCount = (props) => {
  const getChartData = () => {
    const data = []
    const labels = []
    const colors = []
    const dataPoints = props.period
    const length =
      props.metrics.length >= dataPoints ? dataPoints : props.metrics.length
    const metrics = props.metrics
      ? props.metrics.slice(0, length).reverse()
      : []
    for (let i = 0; i < length; i++) {
      data.push(metrics[i].txCount)
      if (metrics[i].timestamp < getUnixStartOfDay()) {
        labels.push(formatDate(metrics[i].timestamp))
        colors.push('#228b22')
      } else {
        labels.push('Today (Incomplete)')
        colors.push('#228b2273')
      }
    }
    return [labels, data, colors]
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
        text: 'Transaction Count',
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
        label: 'Transactions',
        data: getChartData()[1],
        fill: false,
        backgroundColor: getChartData()[2],
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

export default ChartTxnCount
