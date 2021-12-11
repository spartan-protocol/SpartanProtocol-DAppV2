import React from 'react'
import { Line } from 'react-chartjs-2'
import { BN, convertFromWei } from '../../../../../utils/bigNumber'
import { formatDate } from '../../../../../utils/math/nonContract'

const ChartRevenue = (props) => {
  const getChartData = () => {
    const data1 = []
    const labels = []
    const dataPoints = 30
    const length =
      props.metrics.length >= dataPoints ? dataPoints : props.metrics.length
    let accumulative = BN(0)
    const metrics = props.metrics
      ? props.metrics.slice(0, length).reverse()
      : []
    for (let i = 0; i < length; i++) {
      const revenue = BN(metrics[i].incentivesUSD).plus(metrics[i].feesUSD)
      accumulative = accumulative.plus(revenue)
      data1.push(convertFromWei(accumulative))
      labels.push(formatDate(metrics[i].timestamp))
    }
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
        text: 'Pool Revenue in $USD',
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
        label: 'Revenue ($USD)',
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

export default ChartRevenue
