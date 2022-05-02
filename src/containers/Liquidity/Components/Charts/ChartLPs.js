import React from 'react'
import { Line } from 'react-chartjs-2'
import { BN, convertFromWei } from '../../../../utils/bigNumber'
import { formatDate } from '../../../../utils/math/nonContract'

const ChartLPs = (props) => {
  const getLPs = () => {
    let liqUnits = BN(0)
    if (props.poolItem) {
      liqUnits = liqUnits.plus(props.poolItem.poolUnits)
    }
    if (liqUnits > 0) {
      return liqUnits
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
      data1.push(convertFromWei(getLPs(), 0))
      labels.push('Current')
    }
    for (let i = 0; i < length; i++) {
      data1.push(convertFromWei(props.metrics[i].lpUnits))
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
        text: 'Total supply of LP units',
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
        label: 'LP Units',
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

export default ChartLPs
