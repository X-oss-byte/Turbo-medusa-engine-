/**
 * Generated by orval v6.7.1 🍺
 * Do not edit manually.
 * Medusa Admin API
 * OpenAPI spec version: 1.0.0
 */
import { rest } from "msw"
import { faker } from "@faker-js/faker"

export const getPostOrdersClaimFulfillmentsCancelMock = () => ({
  fulfillment: faker.helpers.randomize([{}, undefined]),
})

export const getPostOrdersSwapFulfillmentsCancelMock = () => ({
  fulfillment: faker.helpers.randomize([{}, undefined]),
})

export const getPostOrdersOrderFulfillmentsCancelMock = () => ({
  fulfillment: faker.helpers.randomize([{}, undefined]),
})

export const getFulfillmentMSW = () => [
  rest.post(
    "*/admin/orders/:id/claims/:claimid/fulfillments/:fulfillmentid/cancel",
    (_req, res, ctx) => {
      return res(
        ctx.delay(1000),
        ctx.status(200, "Mocked status"),
        ctx.json(getPostOrdersClaimFulfillmentsCancelMock())
      )
    }
  ),
  rest.post(
    "*/admin/orders/:id/swaps/:swapid/fulfillments/:fulfillmentid/cancel",
    (_req, res, ctx) => {
      return res(
        ctx.delay(1000),
        ctx.status(200, "Mocked status"),
        ctx.json(getPostOrdersSwapFulfillmentsCancelMock())
      )
    }
  ),
  rest.post(
    "*/admin/orders/:id/fulfillments/:fulfillmentid/cancel",
    (_req, res, ctx) => {
      return res(
        ctx.delay(1000),
        ctx.status(200, "Mocked status"),
        ctx.json(getPostOrdersOrderFulfillmentsCancelMock())
      )
    }
  ),
]
