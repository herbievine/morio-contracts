import * as dotenv from 'dotenv'
import { create as createClient, IPFSHTTPClient } from 'ipfs-http-client'

dotenv.config()

const ipfsBaseUrl = 'https://polygon-mumbai.infura.io/v3/'

const createIpfsClient = async (): Promise<IPFSHTTPClient> => {
  const auth =
    'Basic ' +
    Buffer.from(process.env.IPFS_ID + ':' + process.env.IPFS_SECRET).toString(
      'base64'
    )

  return createClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth
    }
  })
}

export { createIpfsClient, ipfsBaseUrl }
