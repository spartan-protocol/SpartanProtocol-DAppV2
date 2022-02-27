/*
Extracted label, desc and longDesc texts to translation.json file.
*/

export const proposalTypes = [
  {
    value: 'GET_SPARTA',
    label: 'bondNewAllocationLabel',
    desc: 'bondNewAllocationDesc',
    longDesc: 'bondNewAllocationLongDesc',
    type: 'Action',
    docsLink:
      'https://docs.spartanprotocol.org/#/dao?id=bond-related-proposals-deprecated',
  },
  {
    value: 'LIST_BOND',
    label: 'bondListAssetLabel',
    desc: 'bondListAssetDesc',
    longDesc: 'bondListAssetLongDesc',
    type: 'Address',
    docsLink:
      'https://docs.spartanprotocol.org/#/dao?id=bond-related-proposals-deprecated',
  },
  {
    value: 'DELIST_BOND',
    label: 'bondDelistAssetLabel',
    desc: 'bondDelistAssetDesc',
    longDesc: 'bondDelistAssetLongDesc',
    type: 'Address',
    docsLink:
      'https://docs.spartanprotocol.org/#/dao?id=bond-related-proposals-deprecated',
  },
  {
    value: 'FLIP_EMISSIONS',
    label: 'baseEmissionsLabel',
    desc: 'baseEmissionsDesc',
    longDesc: 'baseEmissionsLongDesc',
    type: 'Action',
    docsLink: 'https://docs.spartanprotocol.org/#/dao?id=turn-on-off-emissions',
  },
  {
    value: 'REALISE',
    label: 'poolsBurnSynthPremiumLabel',
    desc: 'poolsBurnSynthPremiumDesc',
    longDesc: 'poolsBurnSynthPremiumLongDesc',
    type: 'Address',
    docsLink: 'https://docs.spartanprotocol.org/#/dao?id=burn-synth-premium',
  },
  {
    value: 'ADD_CURATED_POOL',
    label: 'poolsAddCuratedLabel',
    desc: 'poolsAddCuratedDesc',
    longDesc: 'poolsAddCuratedLongDesc',
    type: 'Address',
    docsLink: 'https://docs.spartanprotocol.org/#/dao?id=add-pool-to-curated',
  },
  {
    value: 'REMOVE_CURATED_POOL',
    label: 'poolsRemoveCuratedLabel',
    desc: 'poolsRemoveCuratedDesc',
    longDesc: 'poolsRemoveCuratedLongDesc',
    type: 'Address',
    docsLink:
      'https://docs.spartanprotocol.org/#/dao?id=remove-pool-from-curated',
  },
  {
    value: 'SYNTH_CLAIM',
    label: 'synthVaultClaimLabel',
    desc: 'synthVaultClaimDesc',
    longDesc: 'synthVaultClaimLongDesc',
    units: 'basis points',
    type: 'Param',
    docsLink:
      'https://docs.spartanprotocol.org/#/dao?id=adjust-synthvault-claim-',
  },
  {
    value: 'DAO_CLAIM',
    label: 'daoVaultClaimLabel',
    desc: 'daoVaultClaimDesc',
    longDesc: 'daoVaultClaimLongDesc',
    units: 'basis points',
    type: 'Param',
    docsLink:
      'https://docs.spartanprotocol.org/#/dao?id=adjust-daovault-claim-',
  },
  {
    value: 'COOL_OFF',
    label: 'daoCoolOffLabel',
    desc: 'daoCoolOffDesc',
    longDesc: 'daoCoolOffLongDesc',
    units: 'seconds',
    type: 'Param',
    docsLink:
      'https://docs.spartanprotocol.org/#/dao?id=change-dao-proposal-cooloff',
  },
  {
    value: 'GRANT',
    label: 'daoGrantLabel',
    desc: 'daoGrantDesc',
    longDesc: 'daoGrantLongDesc',
    units: 'SPARTA',
    type: 'Grant',
    docsLink:
      'https://docs.spartanprotocol.org/#/dao?id=send-a-sparta-grant-to-a-wallet',
  },
  {
    value: 'DAO',
    label: 'daoChangeContractLabel',
    desc: 'daoChangeContractDesc',
    longDesc: 'daoChangeContractLongDesc',
    type: 'Address',
    docsLink: 'https://docs.spartanprotocol.org/#/dao?id=upgrade-dao-contract',
  },
  {
    value: 'ROUTER',
    label: 'routerChangeContractLabel',
    desc: 'routerChangeContractDesc',
    longDesc: 'routerChangeContractLongDesc',
    type: 'Address',
    docsLink:
      'https://docs.spartanprotocol.org/#/dao?id=upgrade-router-contract',
  },
  {
    value: 'UTILS',
    label: 'utilsChangeContractLabel',
    desc: 'utilsChangeContractDesc',
    longDesc: 'utilsChangeContractLongDesc',
    type: 'Address',
    docsLink:
      'https://docs.spartanprotocol.org/#/dao?id=upgrade-utils-contract',
  },
  {
    value: 'RESERVE',
    label: 'reserveChangeContractLabel',
    desc: 'reserveChangeContractDesc',
    longDesc: 'reserveChangeContractLongDesc',
    type: 'Address',
    docsLink:
      'https://docs.spartanprotocol.org/#/dao?id=upgrade-reserve-contract',
  },
]
