import { FlagRouter } from "@medusajs/utils"
import { Router } from "express"
import { ShippingOption } from "../../../.."
import TaxInclusivePricingFeatureFlag from "../../../../loaders/feature-flags/tax-inclusive-pricing"
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares from "../../../middlewares"

const route = Router()

export default (app, featureFlagRouter: FlagRouter) => {
  app.use("/shipping-options", route)

  if (featureFlagRouter.isFeatureEnabled(TaxInclusivePricingFeatureFlag.key)) {
    defaultFields.push("includes_tax")
  }

  route.get("/", middlewares.wrap(require("./list-shipping-options").default))
  route.post("/", middlewares.wrap(require("./create-shipping-option").default))

  route.get(
    "/:option_id",
    middlewares.wrap(require("./get-shipping-option").default)
  )
  route.post(
    "/:option_id",
    middlewares.wrap(require("./update-shipping-option").default)
  )
  route.delete(
    "/:option_id",
    middlewares.wrap(require("./delete-shipping-option").default)
  )

  return app
}

export const defaultFields: (keyof ShippingOption)[] = [
  "id",
  "name",
  "region_id",
  "profile_id",
  "provider_id",
  "price_type",
  "amount",
  "is_return",
  "admin_only",
  "data",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]

export const defaultRelations = ["region", "profile", "requirements"]

/**
 * @schema AdminShippingOptionsListRes
 * type: object
 * x-expanded-relations:
 *   field: shipping_options
 *   relations:
 *     - profile
 *     - region
 *     - requirements
 *   eager:
 *     - region.fulfillment_providers
 *     - region.payment_providers
 * required:
 *   - shipping_options
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   shipping_options:
 *     type: array
 *     description: "An array of shipping options details."
 *     items:
 *       $ref: "#/components/schemas/ShippingOption"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of shipping options skipped when retrieving the shipping options.
 *   limit:
 *     type: integer
 *     description: The number of items per page
 */
export type AdminShippingOptionsListRes = PaginatedResponse & {
  shipping_options: ShippingOption[]
}

/**
 * @schema AdminShippingOptionsRes
 * type: object
 * x-expanded-relations:
 *   field: shipping_option
 *   relations:
 *     - profile
 *     - region
 *     - requirements
 *   eager:
 *     - region.fulfillment_providers
 *     - region.payment_providers
 * required:
 *   - shipping_option
 * properties:
 *   shipping_option:
 *     description: "Shipping option details."
 *     $ref: "#/components/schemas/ShippingOption"
 */
export type AdminShippingOptionsRes = {
  shipping_option: ShippingOption
}

/**
 * @schema AdminShippingOptionsDeleteRes
 * type: object
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted Shipping Option.
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: shipping-option
 *   deleted:
 *     type: boolean
 *     description: Whether or not the items were deleted.
 *     default: true
 */
export type AdminShippingOptionsDeleteRes = DeleteResponse

export * from "./create-shipping-option"
export * from "./delete-shipping-option"
export * from "./get-shipping-option"
export * from "./list-shipping-options"
export * from "./update-shipping-option"

