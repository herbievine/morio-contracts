import type { Hub } from '../typechain'
import { createContract } from '../utils/createContract'

async function main() {
  const { address } = await createContract<Hub>('Hub')

  console.log(`Hub deployed to: ${address}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
