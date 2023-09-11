import { NextFunction, Request, Response } from "express"
import { isDefined } from "medusa-core-utils"
import { IEventBusService } from "../../interfaces/services/event-bus"

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cacheKey = req.request_context.cache_key
  const eventBusService: IEventBusService = req.scope.resolve("eventBusService")

  if (isDefined(cacheKey)) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    eventBusService.destroyCachedEvents(cacheKey)
  }

  next(err)
}
