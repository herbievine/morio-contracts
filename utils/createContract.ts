// eslint-disable-next-line node/no-unpublished-import
import { ethers } from 'hardhat'

const createContract = async <ContractType = any>(
  name: string,
  ...args: any[]
): Promise<ContractType> => {
  const Contract = await ethers.getContractFactory(name)
  const contract = await Contract.deploy(...args)
  await contract.deployed()

  return contract as unknown as ContractType
}

export { createContract }
