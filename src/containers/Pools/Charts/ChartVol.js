import React from 'react'
import { Bar } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import { useWeb3 } from '../../../store/web3'
import { convertFromWei } from '../../../utils/bigNumber'
import { getUnixStartOfDay } from '../../../utils/helpers'
import { formatDate } from '../../../utils/math/nonContract'

const ChartVol = () => {
  const web3 = useWeb3()
  const { t } = useTranslation()

  const getChartData = () => {
    const data = []
    const labels = []
    const colors = []
    const dataPoints = 30
    const length =
      web3.metrics.global.length >= dataPoints
        ? dataPoints
        : web3.metrics.global.length
    for (let i = 0; i < length; i++) {
      data.push(convertFromWei(web3.metrics.global[i].volUSD))
      if (web3.metrics.global[i].timestamp < getUnixStartOfDay()) {
        labels.push(formatDate(web3.metrics.global[i].timestamp))
        colors.push('#228b22')
      } else {
        labels.push('Today (Incomplete)')
        colors.push('#228b2273')
      }
    }
    return [labels.reverse(), data.reverse(), colors.reverse()]
  }

  const options = {
    scales: {
      x: {
        display: false,
      },
    },
    plugins: {
      // title: {
      //   display: true,
      //   text: `${t('swapVolume')} ($USD)`,
      // },
      legend: {
        display: false,
      },
    },
  }

  const data = {
    labels: getChartData()[0],
    datasets: [
      {
        label: `${t('swapVolume')} ($USD)`,
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

export default ChartVol
