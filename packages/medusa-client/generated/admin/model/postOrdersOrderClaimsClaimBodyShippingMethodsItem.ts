/**
 * Generated by orval v6.7.1 🍺
 * Do not edit manually.
 * Medusa Admin API
 * OpenAPI spec version: 1.0.0
 */

export type PostOrdersOrderClaimsClaimBodyShippingMethodsItem = {
  /** The id of an existing Shipping Method */
  id?: string
  /** The id of the Shipping Option to create a Shipping Method from */
  option_id?: string
  /** The price to charge for the Shipping Method */
  price?: number
}
