import { ethers } from "ethers"

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()