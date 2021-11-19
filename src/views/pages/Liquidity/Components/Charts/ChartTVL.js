/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import { Line } from 'react-chartjs-2'
import { convertFromWei } from '../../../../../utils/bigNumber'
import { formatDateDay } from '../../../../../utils/math/nonContract'

const ChartTVL = (props) => {
  const getChartData = () => {
    const data1 = []
    const labels = []
    const dataPoints = 30
    const length =
      props.metrics.length >= dataPoints ? dataPoints : props.metrics.length
    for (let i = 0; i < length; i++) {
      data1.push(convertFromWei(props.metrics[i].tvlUSD))
      labels.push(formatDateDay(props.metrics[i].timestamp))
    }
    return [labels.reverse(), data1.reverse()]
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
      <Line data={data} />
    </>
  )
}

export default ChartTVL
