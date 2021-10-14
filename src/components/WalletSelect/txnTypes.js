// import { Tooltip } from '../Tooltip/tooltip'
// import { Icon } from '../Icons/icons'

// const size = '30'

const txnTypes = [
  {
    id: 'bondDeposit',
    title: 'New Bond',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'bondClaim',
    title: 'Claim Bond',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'daoDeposit',
    title: 'DaoVault Deposit',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'daoWithdraw',
    title: 'DaoVault Withdraw',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'daoHarvest',
    title: 'DaoVault Harvest',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'newProposal',
    title: 'New DAO Proposal',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'voteProposal',
    title: 'Proposal Vote',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'removeVoteProposal',
    title: 'Proposal Un-Vote',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'pollVotes',
    title: 'Proposal Poll Votes',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'cancelProposal',
    title: 'Cancel Proposal',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'finaliseProposal',
    title: 'Finalise Proposal',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'createPool',
    title: 'Deploy New Pool',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'addLiq',
    title: 'Add Liquidity',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'addLiqSingle',
    title: 'Swap + Add Liquidity',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'zapLiq',
    title: 'Move Liquidity',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'remLiq',
    title: 'Remove Liquidity',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'remLiqSingle',
    title: 'Remove Liquidity + Swap',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'swapped',
    title: 'Swap',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'mintSynth',
    title: 'Forge Synth',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'burnSynth',
    title: 'Melt Synth',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'upgrade',
    title: 'Upgrade V1 -> V2',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'fsClaim',
    title: 'Claim from V1',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'synthDeposit',
    title: 'SynthVault Deposit',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'synthHarvest',
    title: 'SynthVault Harvest',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'synthWithdraw',
    title: 'SynthVault Withdraw',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'createSynth',
    title: 'Deploy New Synth',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: 'From:',
    outLabel: 'To:',
    simple: false,
  },
  {
    id: 'approval',
    title: 'Contract Approval',
    // tooltip: Tooltip('id')
    // icon: <Icon size={size} icon="binanceChain" />,
    inLabel: '',
    outLabel: '',
    simple: true,
  },
]

export default txnTypes
