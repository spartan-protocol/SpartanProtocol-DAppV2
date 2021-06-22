import React from 'react'
import { Popover } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

/**
 * Get the custom tooltip from imported list.
 * @param {string} tooltip id of the icon requested (required)
 * @param {string} variable value of a custom variable if included (optional)
 * @returns {Component} Custom Tooltip
 */
export const Tooltip = (tooltipId, variable) => {
  const { t } = useTranslation()
  const allTooltips = [
    {
      id: 'apy',
      title: 'APY',
      body: 'apyInfo',
    },
    {
      id: 'revenue',
      title: 'revenue',
      body: 'revenueInfo',
      variable: { days: variable },
    },
    {
      id: 'swapRevenue',
      title: 'swapRevenue',
      body: 'swapRevenue',
      variable: { days: variable },
    },
    {
      id: 'dividendRevenue',
      title: 'dividendRevenue',
      body: 'dividendRevenue',
      variable: { days: variable },
    },
  ]

  const tooltip = allTooltips.filter((i) => i.id === tooltipId)[0]
  const { title } = tooltip
  const body = t(tooltip.body, tooltip.variable)

  return (
    <Popover>
      <Popover.Header as="h3">{title}</Popover.Header>
      <Popover.Body>{body}</Popover.Body>
    </Popover>
  )
}
