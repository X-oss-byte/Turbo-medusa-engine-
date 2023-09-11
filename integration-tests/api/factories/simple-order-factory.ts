import { Connection } from "typeorm"
import faker from "faker"
import { Customer, Order } from "@medusajs/medusa"

import { RegionFactoryData, simpleRegionFactory } from "./simple-region-factory"
import {
  LineItemFactoryData,
  simpleLineItemFactory,
} from "./simple-line-item-factory"
import {
  AddressFactoryData,
  simpleAddressFactory,
} from "./simple-address-factory"
import {
  ShippingMethodFactoryData,
  simpleShippingMethodFactory,
} from "./simple-shipping-method-factory"

export type OrderFactoryData = {
  id?: string
  region?: RegionFactoryData | string
  email?: string | null
  currency_code?: string
  tax_rate?: number | null
  line_items?: LineItemFactoryData[]
  shipping_address?: AddressFactoryData
  shipping_methods?: ShippingMethodFactoryData[]
}

export const simpleOrderFactory = async (
  connection: Connection,
  data: OrderFactoryData = {},
  seed: number
): Promise<Order> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = connection.manager

  let currencyCode: string
  let regionId: string
  let taxRate: number
  if (typeof data.region === "string") {
    currencyCode = data.currency_code
    regionId = data.region
    taxRate = data.tax_rate
  } else {
    const region = await simpleRegionFactory(connection, data.region)
    taxRate =
      typeof data.tax_rate !== "undefined" ? data.tax_rate : region.tax_rate
    currencyCode = region.currency_code
    regionId = region.id
  }
  const address = await simpleAddressFactory(connection, data.shipping_address)

  const customerToSave = manager.create(Customer, {
    email:
      typeof data.email !== "undefined" ? data.email : faker.internet.email(),
  })
  const customer = await manager.save(customerToSave)

  const id = data.id || `simple-order-${Math.random() * 1000}`
  const toSave = manager.create(Order, {
    id,
    customer_id: customer.id,
    email: customer.email,
    region_id: regionId,
    currency_code: currencyCode,
    tax_rate: taxRate,
    shipping_address_id: address.id,
  })

  const order = await manager.save(toSave)

  const shippingMethods = data.shipping_methods || []
  for (const sm of shippingMethods) {
    await simpleShippingMethodFactory(connection, { ...sm, order_id: order.id })
  }

  const items = data.line_items
  for (const item of items) {
    await simpleLineItemFactory(connection, { ...item, order_id: id })
  }

  return order
}
