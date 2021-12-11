import React from 'react'
import { Line } from 'react-chartjs-2'
import { BN } from '../../../../../utils/bigNumber'
import { formatDate } from '../../../../../utils/math/nonContract'

const ChartSwapDemand = (props) => {
  const getChartData = () => {
    const data = []
    const labels = []
    const dataPoints = 30
    const length =
      props.metrics.length >= dataPoints ? dataPoints : props.metrics.length
    const metrics = props.metrics
      ? props.metrics.slice(0, length).reverse()
      : []
    for (let i = 0; i < length; i++) {
      const revenue = BN(metrics[i].volUSD)
      const tvl = metrics[i].tvlUSD
      const swapDemand = revenue.div(tvl).times(100)
      data.push(swapDemand.toString())
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
        text: 'TVL Weighted Swap Demand in %',
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
        label: 'Swap Demand (%)',
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

export default ChartSwapDemand
