import { Router } from "express"
import { TaxRate } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"

const route = Router()

export default (app) => {
  app.use("/tax-rates", route)

  /**
   * List tax rates
   */
  route.get("/", require("./list-tax-rates").default)

  /**
   * Get a tax rate
   */
  route.get("/:id", require("./get-tax-rate").default)

  /**
   * Create a tax rate
   */
  route.post("/", require("./create-tax-rate").default)

  /**
   * Update a tax rate
   */
  route.post("/:id", require("./update-tax-rate").default)

  /**
   * Remove products from tax rate
   */
  route.delete("/:id/products/batch", require("./remove-from-products").default)

  /**
   * Remove product types from tax rate
   */
  route.delete(
    "/:id/product-types/batch",
    require("./remove-from-product-types").default
  )

  /**
   * Remove shipping options from tax rate
   */
  route.delete(
    "/:id/shipping-options/batch",
    require("./remove-from-shipping-options").default
  )

  /**
   * Add products to tax rate
   */
  route.post("/:id/products/batch", require("./add-to-products").default)

  /**
   * Add product types to tax rate
   */
  route.post(
    "/:id/product-types/batch",
    require("./add-to-product-types").default
  )

  /**
   * Add to shipping options
   */
  route.post(
    "/:id/shipping-options/batch",
    require("./add-to-shipping-options").default
  )

  /**
   * Delete a tax rate
   */
  route.delete("/:id", require("./delete-tax-rate").default)

  return app
}

export const defaultAdminTaxRatesRelations = []

export const defaultAdminTaxRatesFields: (keyof TaxRate)[] = [
  "id",
  "rate",
  "code",
  "name",
  "region_id",
  "created_at",
  "updated_at",
]

export type AdminTaxRatesDeleteRes = DeleteResponse

export type AdminTaxRatesListRes = PaginatedResponse & {
  tax_rates: TaxRate[]
}

export type AdminTaxRatesRes = {
  tax_rate: TaxRate
}

export * from "./list-tax-rates"
export * from "./get-tax-rate"
export * from "./remove-from-product-types"
export * from "./remove-from-products"
export * from "./remove-from-shipping-options"
export * from "./add-to-product-types"
export * from "./add-to-products"
export * from "./add-to-shipping-options"
export * from "./create-tax-rate"
export * from "./delete-tax-rate"
export * from "./update-tax-rate"
