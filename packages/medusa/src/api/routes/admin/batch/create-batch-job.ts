import { IsBoolean, IsObject, IsOptional, IsString } from "class-validator"
import BatchJobService from "../../../../services/batch-job"
import FeatureFlagStrategy from "../../../../strategies/feature-flag"
import { validator } from "../../../../utils/validator"
import { BatchJob } from "../../../../models"

/**
 * @oas [post] /batch-jobs
 * operationId: "PostBatchJobs"
 * summary: "Create a Batch Job"
 * description: "Creates a Batch Job."
 * x-authenticated: true
 * parameters:
 *   - (body) type=* {string} The type of batch job to start.
 *   - (body) context=* {string} Additional infomration regarding the batch to be used for processing.
 *   - (body) dry_run=* {boolean} Set a batch job in dry_run mode to get some information on what will be done without applying any modifications.
 * tags:
 *   - Customer
 * responses:
 *   201:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *            batch_job:
 *              $ref: "#/components/schemas/batch_job"
 */
export default async (req, res) => {
  const validated = await validator(AdminPostBatchesReq, req.body)

  const featureFlagService: FeatureFlagStrategy = req.scope.resolve(
    "featureFlagStrategy"
  )

  const batchJobService: BatchJobService = req.scope.resolve("batchJobService")
  const toCreate = await batchJobService.prepareBatchJobForProcessing(
    validated,
    req
  )

  const userId = req.user.id ?? req.user.userId

  const batch_job = await batchJobService.create({
    ...toCreate,
    created_by: userId,
  })

  if (featureFlagService.isSet("medusa:batchJob")) {
    const batch_job = await batchJobService.create({
      ...validated,
      created_by: userId,
    })

    res.status(201).json({ batch_job })
  }
}

export class AdminPostBatchesReq {
  @IsString()
  type: string

  @IsObject()
  context: BatchJob["context"]

  @IsBoolean()
  @IsOptional()
  dry_run = false
}
