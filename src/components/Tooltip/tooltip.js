import React from 'react'
import { Popover } from 'react-bootstrap'

/**
 * Get the custom tooltip from imported list.
 * @param {string} tooltip id of the icon requested (required)
 * @param {string} variable value of a custom variable if included (optional)
 * @returns {Component} Custom Tooltip
 */
export const Tooltip = (t, tooltipId, variable) => {
  const allTooltips = [
    {
      id: 'apy',
      title: 'APY',
      body: 'apyInfo',
    },
    {
      id: 'apySynth',
      title: 'synthVaultApy',
      body: 'vaultApyInfo',
    },
    {
      id: 'bond',
      title: 'bond',
      body: 'bondInfo',
    },
    {
      id: 'dividendRevenue',
      title: 'dividendRevenueTitle',
      body: 'dividendRevenue',
      variable: { days: variable },
    },
    {
      id: 'newPool',
      title: 'poolInitializing',
      body: 'newPoolInfo',
      variable: { pool: variable },
    },
    {
      id: 'newPoolRatio',
      title: 'newPoolRatioTitle',
      body: 'newPoolRatio',
    },
    {
      id: 'newPoolFee',
      title: 'newPoolFeeTitle',
      body: 'newPoolFee',
    },
    {
      id: 'poolCap',
      title: 'poolCap',
      body: 'poolCapInfo',
    },
    {
      id: 'poolCurated',
      title: 'poolCurated',
      body: 'poolCuratedInfo',
      variable: { pool: variable },
    },
    {
      id: 'poolFrozen',
      title: 'poolFrozen',
      body: 'poolFrozenInfo',
      variable: { pool: variable },
    },
    {
      id: 'poolNormal',
      title: 'poolNormal',
      body: 'poolNormalInfo',
      variable: { pool: variable },
    },
    {
      id: 'poolSafe',
      title: 'poolSafe',
      body: 'poolSafeInfo',
      variable: { pool: variable },
    },
    {
      id: 'rank',
      title: 'rank',
      body: 'rankInfo',
    },
    {
      id: 'revenue',
      title: 'revenue',
      body: 'revenueInfo',
      variable: { days: variable },
    },
    {
      id: 'swapRevenue',
      title: 'swapRevenueTitle',
      body: 'swapRevenue',
      variable: { days: variable },
    },
  ]

  const tooltip = allTooltips.filter((i) => i.id === tooltipId)[0]
  const { title } = tooltip
  const body = t(tooltip.body, tooltip.variable)

  return (
    <Popover>
      <Popover.Header as="h3">{t(title)}</Popover.Header>
      <Popover.Body>{body}</Popover.Body>
    </Popover>
  )
}
