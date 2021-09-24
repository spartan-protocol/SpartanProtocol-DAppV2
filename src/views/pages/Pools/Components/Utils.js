/**
 * Balance element widths
 */
export const balanceWidths = () => {
  const assetSelect1 = document.getElementById('assetSelect1')
  const assetSelect2 = document.getElementById('assetSelect2')
  const assetSelect3 = document.getElementById('assetSelect3')
  let largest = 103
  if (assetSelect1) {
    assetSelect1.style.width = null
    if (assetSelect1.offsetWidth > largest) {
      largest = assetSelect1.offsetWidth + 2
    }
  }
  if (assetSelect2) {
    assetSelect2.style.width = null
    if (assetSelect2.offsetWidth > largest) {
      largest = assetSelect2.offsetWidth + 2
    }
  }
  if (assetSelect3) {
    assetSelect3.style.width = null
    if (assetSelect3.offsetWidth > largest) {
      largest = assetSelect3.offsetWidth + 2
    }
  }
  if (assetSelect1) {
    assetSelect1.style.width = largest
  }
  if (assetSelect2) {
    assetSelect2.style.width = largest
  }
  if (assetSelect3) {
    assetSelect3.style.width = largest
  }
}
