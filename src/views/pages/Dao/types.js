export const proposalTypes = [
  {
    value: 'GET_SPARTA',
    label: 'Bond: New Allocation',
    desc: 'Release a Bond Allocation',
    longDesc:
      'This function will release a 2M SPARTA allocation to the Bond program. This will instantly allow anyone to perform Bonds, whereby they provide *only* the TOKEN half of the TOKEN:SPARTA liquidity-add and have their resulting LP tokens locked up in the BondVault and vested back to the user linearly over 6 months.',
    type: 'Action',
    docsLink:
      'https://docs.spartanprotocol.org/#/dao?id=bond-related-proposals-deprecated',
  },
  {
    value: 'LIST_BOND',
    label: 'Bond: List Asset',
    desc: 'Enable a new bond asset',
    longDesc:
      'Listing an asset for Bond enables it for use in the Bond program. This will allow users to Bond the listed token with protocol-supplied SPARTA to mint LP tokens into the BondVault claimable linearly over 6 months.',
    type: 'Address',
    docsLink:
      'https://docs.spartanprotocol.org/#/dao?id=bond-related-proposals-deprecated',
  },
  {
    value: 'DELIST_BOND',
    label: 'Bond: Delist Asset',
    desc: 'Disable a bond asset:',
    longDesc:
      'De-listing an asset from Bond disables it for use in the Bond program. Users will no longer be able to Bond the listed token with protocol-supplied SPARTA. Existing Bond positions will still be claimable for the remainder of their bond-period.',
    type: 'Address',
    docsLink:
      'https://docs.spartanprotocol.org/#/dao?id=bond-related-proposals-deprecated',
  },
  {
    value: 'FLIP_EMISSIONS',
    label: 'Base: Emissions On/Off',
    desc: 'Switch the BASE emissions',
    longDesc:
      'Having a switch to regulate the emissions offers several advantages within the ecosystem. Turning off base emissions would cause Spartan Protocol to have its incentives fade away. This means that there would be less incentive for liquidity providers, potentially leading to reduced total value locked (TVL). One would expect them to be turned off when the protocol is mature & self sufficient in terms of incentives or in a situation where maybe its safer to have them off temporarily (like during a contract upgrade)',
    type: 'Action',
    docsLink: 'https://docs.spartanprotocol.org/#/dao?id=turn-on-off-emissions',
  },
  {
    value: 'REALISE',
    label: 'Pools: Burn synth-premium',
    desc: 'Increase liquidity provider pool-ownership',
    longDesc:
      'Realising the premium of a pool involves working out how much the existing synths are worth and how much the LP tokens held on the Synth contract are worth. If there is a premium; it can be burned and therefore attributed to the existing liquidity providers.',
    type: 'Address',
    docsLink: 'https://docs.spartanprotocol.org/#/dao?id=burn-synth-premium',
  },
  {
    value: 'ADD_CURATED_POOL',
    label: 'Pools: Add Curated',
    desc: 'Add to the curated list',
    longDesc:
      'A curated pool is a special type of pool that enables Synthetic assets to be minted on top of it & its LP tokens to be used as weight in the DAOVault for harvest rewards & DAO proposals',
    type: 'Address',
    docsLink: 'https://docs.spartanprotocol.org/#/dao?id=add-pool-to-curated',
  },
  {
    value: 'REMOVE_CURATED_POOL',
    label: 'Pools: Remove Curated',
    desc: 'Remove from the curated list',
    longDesc:
      'A curated pool is a special type of pool that enables Synthetic assets to be minted on top of it & its LP tokens to be used as weight in the DAOVault for harvest rewards & DAO proposals',
    type: 'Address',
    docsLink:
      'https://docs.spartanprotocol.org/#/dao?id=remove-pool-from-curated',
  },
  {
    value: 'SYNTH_CLAIM',
    label: 'SynthVault: Claim %',
    desc: 'Change SynthVault claim % to',
    longDesc:
      'Regulate the claim percentage of the Reserve that the SynthVault can begin harvest calculations off. If increased; the harvest rewards will be larger. If decreased they will be lower.',
    units: 'basis points',
    type: 'Param',
    docsLink:
      'https://docs.spartanprotocol.org/#/dao?id=adjust-synthvault-claim-',
  },
  {
    value: 'DAO_CLAIM',
    label: 'DAOVault: Claim %',
    desc: 'Change DaoVault claim % to',
    longDesc:
      'Regulate the claim percentage of the Reserve that the DaoVault can begin harvest calculations off. If increased; the harvest rewards will be larger. If decreased they will be lower.',
    units: 'basis points',
    type: 'Param',
    docsLink:
      'https://docs.spartanprotocol.org/#/dao?id=adjust-daovault-claim-',
  },
  {
    value: 'COOL_OFF',
    label: 'DAO: Change Cooloff',
    desc: 'Change DAO CoolOff period to',
    longDesc:
      'When somebody pushes a proposal, the community will come and vote on whether or not they agree with it. Once a majority has been attained and the proposal reaches enough weight to switch to finalizing status, there is a mandatory window where it needs to stay above a required weight otherwise it wont be finalize-able.',
    units: 'seconds',
    type: 'Param',
    docsLink:
      'https://docs.spartanprotocol.org/#/dao?id=change-dao-proposal-cooloff',
  },
  {
    value: 'GRANT',
    label: 'DAO: Grant SPARTA',
    desc: 'Grant funds to a Spartan',
    longDesc:
      'The DAO can propose to grant SPARTA from the RESERVE to any wallet address. This could be for any reason, pay contributors, fund a project / activity or anything that benefits the protocol as a whole. Be very careful to enusre you trust the receiving wallet before supporting a grant proposal.',
    units: 'SPARTA',
    type: 'Grant',
    docsLink:
      'https://docs.spartanprotocol.org/#/dao?id=send-a-sparta-grant-to-a-wallet',
  },
  {
    value: 'DAO',
    label: 'DAO: Change Contract',
    desc: 'Change the DAO contract:',
    longDesc:
      'Changing the DAO contract is a concept that may be of not much use at the moment. However, in order to future proof the Spartan Protocol, there may come a day where a modification or upgrade will need to take place within the DAO itself.',
    type: 'Address',
    docsLink: 'https://docs.spartanprotocol.org/#/dao?id=upgrade-dao-contract',
  },
  {
    value: 'ROUTER',
    label: 'Router: Change Contract',
    desc: 'Change Router contract',
    longDesc:
      'This contract is permissioned to interact with the pools and perform swaps & liquidity management. If features are added or logic is changed, alot of the time it will take place here in this contract.',
    type: 'Address',
    docsLink:
      'https://docs.spartanprotocol.org/#/dao?id=upgrade-router-contract',
  },
  {
    value: 'UTILS',
    label: 'Utils: Change Contract',
    desc: 'Change Utils contract',
    longDesc:
      'This contract is where the community can choose to modify or completely remove the fee burn. As mentioned in the tokenomics section, the fee burn sits between 0% and 1% depending on the circulating supply.',
    type: 'Address',
    docsLink:
      'https://docs.spartanprotocol.org/#/dao?id=upgrade-utils-contract',
  },
  {
    value: 'RESERVE',
    label: 'Reserve: Change Contract',
    desc: 'Change Reserve contract',
    longDesc:
      'The reserve contract is where the emissions are sent before being distributed to the end users.',
    type: 'Address',
    docsLink:
      'https://docs.spartanprotocol.org/#/dao?id=upgrade-reserve-contract',
  },
]
