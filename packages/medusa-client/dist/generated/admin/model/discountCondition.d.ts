/**
 * Generated by orval v6.7.1 🍺
 * Do not edit manually.
 * Medusa Admin API
 * OpenAPI spec version: 1.0.0
 */
import type { DiscountConditionType } from "./discountConditionType";
import type { DiscountConditionMetadata } from "./discountConditionMetadata";
/**
 * Holds rule conditions for when a discount is applicable
 */
export interface DiscountCondition {
    /** The id of the Discount Condition. Will be prefixed by `discon_`. */
    id?: string;
    /** The type of the Condition */
    type?: DiscountConditionType;
    /** The date with timezone at which the resource was created. */
    created_at?: string;
    /** The date with timezone at which the resource was last updated. */
    update_at?: string;
    /** The date with timezone at which the resource was deleted. */
    deleted_at?: string;
    /** An optional key-value map with additional information. */
    metadata?: DiscountConditionMetadata;
}
