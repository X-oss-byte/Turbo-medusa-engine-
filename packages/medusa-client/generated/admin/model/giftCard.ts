/**
 * Generated by orval v6.7.1 🍺
 * Do not edit manually.
 * Medusa Admin API
 * OpenAPI spec version: 1.0.0
 */
import type { Region } from "./region"
import type { GiftCardMetadata } from "./giftCardMetadata"

/**
 * Gift Cards are redeemable and represent a value that can be used towards the payment of an Order.
 */
export interface GiftCard {
  /** The id of the Gift Card. This value will be prefixed by `gift_`. */
  id?: string
  /** The unique code that identifies the Gift Card. This is used by the Customer to redeem the value of the Gift Card. */
  code?: string
  /** The value that the Gift Card represents. */
  value?: number
  /** The remaining value on the Gift Card. */
  balance?: number
  /** The id of the Region in which the Gift Card is available. */
  region_id?: string
  /** The Region in which the Gift Card is available. */
  region?: Region
  /** The id of the Order that the Gift Card was purchased in. */
  order_id?: string
  /** Whether the Gift Card has been disabled. Disabled Gift Cards cannot be applied to carts. */
  is_disabled?: boolean
  /** The time at which the Gift Card can no longer be used. */
  ends_at?: string
  /** The date with timezone at which the resource was created. */
  created_at?: string
  /** The date with timezone at which the resource was last updated. */
  updated_at?: string
  /** The date with timezone at which the resource was deleted. */
  deleted_at?: string
  /** An optional key-value map with additional information. */
  metadata?: GiftCardMetadata
}
