import { Router } from "express"
import { ReturnReason } from "../../../.."
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/return-reasons", route)

  /**
   * List reasons
   */
  route.get("/", middlewares.wrap(require("./list-reasons").default))

  /**
   * Retrieve reason
   */
  route.get("/:id", middlewares.wrap(require("./get-reason").default))

  /**
   * Create a reason
   */
  route.post("/", middlewares.wrap(require("./create-reason").default))

  /**
   * Update a reason
   */
  route.post("/:id", middlewares.wrap(require("./update-reason").default))

  /**
   * Delete a reason
   */
  route.delete("/:id", middlewares.wrap(require("./delete-reason").default))

  return app
}

export const defaultAdminReturnReasonsFields = [
  "id",
  "value",
  "label",
  "parent_return_reason_id",
  "description",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const defaultAdminReturnReasonsRelations = [
  "parent_return_reason",
  "return_reason_children",
]

export type AdminReturnReasonRes = {
  return_reasons: ReturnReason
}

export type AdminReturnReasonsListRes = {
  return_reasons: ReturnReason[]
}

export * from "./create-reason"
