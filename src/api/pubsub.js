import PubSub from 'pubsub-js'
import hash from 'object-hash'
import { Storage } from '@/utils'

export const TOPIC_USER_INFO = 'TOPIC-USER-INFO'
export const TOPIC_USER_ASSETS = 'TOPIC-USER-ASSETS'
export const TOPIC_USER_ORDERS = 'TOPIC-USER-ORDERS'
export const TOPIC_ORDER_LISTING = 'TOPIC-ORDER-LISTING'
export const TOPIC_BEST_PRICE = 'TOPIC-BEST-PRICE'
export const TOPIC_QUOTATION = 'TOPIC-QUOTATION'

class PubsubManager {
  constructor() {
    console.log('PubsubManager ... begin ...')
    PubSub.clearAllSubscriptions()
    this.pubsubTopicMap = new Map()
    this.TopicUserInfo = TOPIC_USER_INFO
    this.TopicUserAssets = TOPIC_USER_ASSETS
    this.TopicUserOrders = TOPIC_USER_ORDERS
    this.TopicOrderListing = TOPIC_ORDER_LISTING
    this.TopicBestPrice = TOPIC_BEST_PRICE
    this.TopicQuotation = TOPIC_QUOTATION
    this.subscribe = (topic, callback) => {
      // 重复订阅处理
      let callbackHashCode = hash(callback.toString())
      let tmpTopicMap = this.pubsubTopicMap.get(topic) || new Map()
      if (!tmpTopicMap.get(callbackHashCode)) {
        PubSub.subscribe(topic, callback)
        this.pubsubTopicMap.set(topic, tmpTopicMap.set(callbackHashCode, topic))
      }
    }
    this.publish = (topic, data) => {
      PubSub.publish(topic, data)
    }

    this.userinfoCallback = (msgTopic, data) => {
      switch (msgTopic) {
        case this.TopicUserInfo:
          console.log('[pubsub][userinfoCallback]:', msgTopic, data)
          if (data && data.asstes) {
            this.publishUserAssets(data.asstes)
          }
          if (data && data.pricelisting) {
            this.publishOrderListing(data.pricelisting)
          }
          if (data && data.orders) {
            this.publishUserOrders({ orders: data.orders, ordersDone: data.ordersDone })
          }
          break
        default:
          console.log('[pubsub][userinfoCallback] unknow topic:', msgTopic, data)
      }
    }
    this.subscribe(this.TopicUserInfo, this.userinfoCallback)
  }

  publishUserInfo(data) {
    this.publish(this.TopicUserInfo, data)
  }

  subscribeUserAssets(callback) {
    this.subscribe(this.TopicUserAssets, callback)
  }
  publishUserAssets(data) {
    this.publish(this.TopicUserAssets, data)
  }

  subscribeUserOrders(callback) {
    this.subscribe(this.TopicUserOrders, callback)
  }
  publishUserOrders(data) {
    this.publish(this.TopicUserOrders, data)
  }

  subscribeOrderListing(callback) {
    this.subscribe(this.TopicOrderListing, callback)
  }
  publishOrderListing(data) {
    this.publish(this.TopicOrderListing, data)
    if (data && data.bestPrice) {
      this.publishBestPrice(data.bestPrice)
    }
  }

  subscribeBestPrice(callback) {
    this.subscribe(this.TopicBestPrice, callback)
  }
  publishBestPrice(data) {
    this.publish(this.TopicBestPrice, data)
  }

  subscribeQuotation(callback) {
    this.subscribe(this.TopicQuotation, callback)
  }
  publishQuotation(data) {
    this.publish(this.TopicQuotation, data)
  }

  clear() {
    this.pubsubTopicMap.clear()
    PubSub.clearAllSubscriptions()
  }
}
export const PSManage = new PubsubManager()
