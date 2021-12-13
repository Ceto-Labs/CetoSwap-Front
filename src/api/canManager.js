/**
 * create http agent
 * **/

import { AuthClient } from '@dfinity/auth-client'
import { Actor, HttpAgent } from '@dfinity/agent'

import { REGISTRY_ID, FACTORY_ID, LEDGER_CID, NNS_UI_CID, CSPT_CID, CYCLES_MINTING_CID } from '@/canister/local/id.js'

import { idlFactory as TokenDIL } from '@/canister/local/candid/token.did.js'
import { idlFactory as RegistryDIL } from '@/canister/local/candid/registry.did.js'
import { idlFactory as PairDIL } from '@/canister/local/candid/pair.did.js'
import { idlFactory as FactoryDIL } from '@/canister/local/candid/factory.did.js'
import { idlFactory as OrderlistDIL } from '@/canister/local/candid/orderlist.did.js'
import { idlFactory as WICPStorage } from '@/canister/local/candid/wicpStorage.did.js'
import { idlFactory as WICPMotokoDIL } from '@/canister/local/candid/WICP_motoko.did.js'

import LedgerDIL from 'canister/local/candid/ledger.did.js'
import NNS_UI_DIL from 'canister/local/candid/nns_ui.js'

import { Storage } from '@/utils'
import { verifyConnectionAndAgent } from './plug'

export default class CanManager {
  canisterMap = new Map()

  canisterTokenMap = new Map()
  canisterpairMap = new Map()
  canisterTokenMapIden = new Map()
  canisterpairMapIden = new Map()

  canisterExchangeMap = new Map()
  canisterExchangeMapIden = new Map()

  authClient = null
  identity = null

  fetchRegistry = null
  fetchFactory = null
  fetchLedger = null
  fetchToken = null
  fetchPair = null
  fetchNNSUI = null

  fetchRegistryIden = null
  fetchFactoryIden = null
  fetchLedgerIden = null
  fetchTokenIden = null
  fetchPairIden = null
  fetchNNSUIIden = null

  identityAgent = null
  noIdentityAgent = null

  constructor() {}

  isNeedIdentity(ltype) {
    return ltype !== 'notNeedIdentity'
  }

  async getAuthClient() {
    if (!this.authClient) {
      this.authClient = await AuthClient.create()
      this.identity = await this.authClient.getIdentity()
    }
    return this.authClient
  }

  async getIdentity() {
    if (!this.identity) {
      await this.getAuthClient()
    }
    return this.identity
  }

  async createCanister(idl, id, ltype) {
    const loginType = ltype || Storage.get('loginType') || ''
    if (this.isNeedIdentity(ltype) && loginType != 'ii' && loginType != 'plug') {
      console.log('[createCanister] please select loginType',loginType)
      return
    }
    if (loginType === 'plug') {
      console.log('plug identity, id:', id)
      await verifyConnectionAndAgent()
      if (window?.ic?.plug?.agent) {
        if (process.env.NODE_ENV === 'development') {
          await window?.ic?.plug?.agent.fetchRootKey()
        }
        return window?.ic?.plug?.createActor({
          canisterId: id,
          interfaceFactory: idl
        })
      }
      console.log('createCanister error')
      return
    }

    let agent = null
    switch (loginType) {
      case 'ii':
        console.log('ii identity')
        agent = await this.getIdentityAgent()
        break
      default:
        console.log('no identity, id:', id)
        agent = await this.getNoIdentityAgent()
        break
    }
    if (process.env.NODE_ENV === 'development') {
      await agent.fetchRootKey()
    }
    return Actor.createActor(idl, {
      agent,
      canisterId: id
    })
  }

  async getRegistryFactory(ltype) {
    if (this.isNeedIdentity(ltype)) {
      if (!this.fetchRegistryIden) this.fetchRegistryIden = await this.createCanister(RegistryDIL, REGISTRY_ID, ltype)
      return this.fetchRegistryIden
    }

    if (!this.fetchRegistry) this.fetchRegistry = await this.createCanister(RegistryDIL, REGISTRY_ID, 'notNeedIdentity')
    return this.fetchRegistry
  }

  async getFactoryFactory(ltype) {
    if (this.isNeedIdentity(ltype)) {
      if (!this.fetchFactoryIden) this.fetchFactoryIden = await this.createCanister(FactoryDIL, FACTORY_ID, ltype)
      return this.fetchFactoryIden
    }

    if (!this.fetchFactory) this.fetchFactory = await this.createCanister(FactoryDIL, FACTORY_ID, 'notNeedIdentity')
    return this.fetchFactory
  }

  async getLedgerFactory(ltype) {
    if (this.isNeedIdentity(ltype)) {
      if (!this.fetchLedgerIden) this.fetchLedgerIden = await this.createCanister(LedgerDIL, LEDGER_CID)
      return this.fetchLedgerIden
    }

    if (!this.fetchLedger) this.fetchLedger = await this.createCanister(LedgerDIL, LEDGER_CID, 'notNeedIdentity')
    return this.fetchLedger
  }

  async getTokenFactory(id, ltype) {
    if (this.isNeedIdentity(ltype)) {
      let canister = this.canisterTokenMapIden.get(id)
      if (!canister) {
        canister = await this.createCanister(TokenDIL, id, ltype)
        this.canisterTokenMapIden.set(id, canister)
      }
      return canister
    }

    let canister = this.canisterTokenMap.get(id)
    if (!canister) {
      canister = await this.createCanister(TokenDIL, id, 'notNeedIdentity')
      this.canisterTokenMap.set(id, canister)
    }
    return canister
  }

  async getPairFactory(id, ltype) {
    if (this.isNeedIdentity(ltype)) {
      let canister = this.canisterpairMapIden.get(id)
      if (!canister) {
        canister = await this.createCanister(PairDIL, id, ltype)
        this.canisterTokenMapIden.set(id, canister)
      }
      return canister
    }

    let canister = this.canisterpairMap.get(id)
    if (!canister) {
      canister = await this.createCanister(PairDIL, id, 'notNeedIdentity')
      this.canisterTokenMap.set(id, canister)
    }
    return canister
  }

  async getExchangeActor(id, ltype) {
    if (this.isNeedIdentity(ltype)) {
      let canister = this.canisterExchangeMapIden.get(id)
      if (!canister) {
        canister = await this.createCanister(OrderlistDIL, id, ltype)
        this.canisterExchangeMapIden.set(id, canister)
      }
      return canister
    }

    let canister = this.canisterExchangeMap.get(id)
    if (!canister) {
      canister = await this.createCanister(OrderlistDIL, id, 'notNeedIdentity')
      this.canisterExchangeMap.set(id, canister)
    }
    return canister
  }

  async getNnsuiFactory() {
    if (!this.fetchNNSUI) this.fetchNNSUI = await this.createCanister(NNS_UI_DIL, NNS_UI_CID)
    return this.fetchNNSUI
  }

  async getIdentityAgent() {
    const identity = await this.getIdentity()
    if (!this.identityAgent) this.identityAgent = new HttpAgent({ identity })
    return this.identityAgent
  }

  async getNoIdentityAgent() {
    if (!this.noIdentityAgent) this.noIdentityAgent = new HttpAgent()
    return this.noIdentityAgent
  }

  updateIdentity() {
    this.canisterMap.clear()

    this.canisterTokenMap.clear()
    this.canisterpairMap.clear()

    this.canisterTokenMapIden.clear()
    this.canisterpairMapIden.clear()

    this.canisterExchangeMap.clear()
    this.canisterExchangeMapIden.clear()

    this.identity = null
    this.authClient = null

    this.fetchRegistryIden = null
    this.fetchFactoryIden = null
    this.fetchLedgerIden = null
    this.fetchTokenIden = null
    this.fetchPairIden = null
    this.fetchNNSUIIden = null

    this.fetchRegistry = null
    this.fetchFactory = null
    this.fetchLedger = null
    this.fetchToken = null
    this.fetchPair = null
    this.fetchNNSUI = null

    this.identityAgent = null
    this.noIdentityAgent = null

    console.log('actor is update')
  }
}
