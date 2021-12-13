import { HOST_URL, REGISTRY_ID, FACTORY_ID, LEDGER_CID, NNS_UI_CID, CSPT_CID, CYCLES_MINTING_CID, IC_CANISTER_ID } from '@/server/local/id'
import { Storage } from '@/utils'

// check plug connect status
export const isConnected = async () => {
  return await window?.ic?.plug?.isConnected()
}

// Make the request
export const reqConnect = async (whitelist) => {
  return await window?.ic?.plug?.requestConnect({ whitelist, host: HOST_URL })
}

// Get the user principal id
export const getPrincipalId = async () => {
  return await window?.ic?.plug?.agent?.getPrincipal()
}

// create plug agent
export const verifyConnectionAndAgent = async (host = HOST_URL) => {
  const wlist = [REGISTRY_ID, FACTORY_ID, LEDGER_CID, NNS_UI_CID, CSPT_CID, CYCLES_MINTING_CID, IC_CANISTER_ID]
  const plugWhitelist = Storage.get('plugWhitelist') || []
  let whitelist = [...new Set([...wlist, ...plugWhitelist])]
  console.log('verifyConnectionAndAgent whitelist:', whitelist.length)
  Storage.set('plugWhitelist', whitelist)

  try {
    const connected = await isConnected()
    // console.log('verifyConnectionAndAgent isConnected:', connected)
    if (!connected) await reqConnect(whitelist)
    // if (connected) {
    //   await window.ic.plug.createAgent({ whitelist, host })
    // }
  } catch (err) {
    Storage.clear()
  }
}
