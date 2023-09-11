const path = require("path")

const { bootstrapApp } = require("../../../helpers/bootstrap-app")
const { initDb, useDb } = require("../../../helpers/use-db")
const { setPort } = require("../../../helpers/use-api")

jest.setTimeout(30000)

describe("Distributed Locking", () => {
  let express
  let appContainer
  let dbConnection

  const doAfterEach = async () => {
    const db = useDb()
    return await db.teardown()
  }

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
    const { container, app, port } = await bootstrapApp({ cwd })
    appContainer = container

    setPort(port)
    express = app.listen(port, (err) => {
      process.send(port)
    })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    express.close()
  })

  afterEach(async () => {
    jest.clearAllMocks()
    const db = useDb()
    return await db.teardown()
  })

  describe("Acquire", () => {
    it("Acquires and release the lock", async () => {
      const distributedLockingService = appContainer.resolve(
        "distributedLockingService"
      )

      await distributedLockingService.acquire("key_name", "user_id_123")

      const userReleased = await distributedLockingService.release(
        "key_name",
        "user_id_456"
      )
      const anotherUserLock = distributedLockingService.acquire(
        "key_name",
        "user_id_456"
      )

      expect(userReleased).toBe(false)
      await expect(anotherUserLock).rejects.toThrowError(
        `"key_name" is already locked.`
      )

      const releasing = await distributedLockingService.release(
        "key_name",
        "user_id_123"
      )

      distributedLockingService.acquire("key_name", "user_id_456")

      expect(releasing).toBe(true)
    })
  })
})
