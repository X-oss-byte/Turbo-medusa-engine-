const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const adminSeeder = require("../../helpers/admin-seeder")
const userSeeder = require("../../helpers/user-seeder")
const { simpleBatchJobFactory } = require("../../factories")

jest.setTimeout(50000)

const adminReqConfig = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

const tryToCreateSomeJobs = async (dbConnection) => {
  try {
    await adminSeeder(dbConnection)
    await userSeeder(dbConnection)

    await simpleBatchJobFactory(dbConnection, {
      id: "job_1",
      type: "batch_1",
      created_by: "admin_user",
    })
    await simpleBatchJobFactory(dbConnection, {
      id: "job_2",
      type: "batch_2",
      awaiting_confirmation_at: new Date(),
      created_by: "admin_user",
    })
    await simpleBatchJobFactory(dbConnection, {
      id: "job_3",
      type: "batch_2",
      awaiting_confirmation_at: new Date(),
      created_by: "admin_user",
    })
    await simpleBatchJobFactory(dbConnection, {
      id: "job_4",
      type: "batch_1",
      status: "awaiting_confirmation",
      created_by: "member-user",
    })
  } catch (err) {
    console.log(err)
    throw err
  }
}

describe("/admin/batch", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
    medusaProcess = await setupServer({ cwd, verbose: false })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("GET /admin/batch", () => {
    beforeEach(async () => {
      await tryToCreateSomeJobs(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("lists batch jobs created by the user", async () => {
      const api = useApi()
      const response = await api.get("/admin/batch", adminReqConfig)

      expect(response.status).toEqual(200)
      expect(response.data.batch_jobs.length).toEqual(3)
      expect(response.data).toMatchSnapshot({
        batch_jobs: [
          {
            created_at: expect.any(String),
            updated_at: expect.any(String),
            created_by: "admin_user"
          },
          {
            created_at: expect.any(String),
            updated_at: expect.any(String),
            created_by: "admin_user"
          },
          {
            created_at: expect.any(String),
            updated_at: expect.any(String),
            created_by: "admin_user"
          },
        ],
      })
    })
  })

  /*describe("POST /admin/batch/:id/confirm", () => {
    beforeEach(async() => {
      await tryToCreateSomeJobs(dbConnection)
    })

    afterEach(async() => {
      const db = useDb()
      await db.teardown()
    })

    it("Requests completion of batch job created by the user", async() => {
      const api = useApi()

      const jobId = "job_2"

      const response = await api.post(
        `/admin/batch/${jobId}/confirm`,
        {},
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.batch_job).toMatchSnapshot({
        awaiting_confirmation_at: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        status: "awaiting_confirmation",
      })
    })

    it("Fails to confirm a batch job created by a different user", async() => {
      const api = useApi()

      const jobId = "job_4"

      await api
        .post(`/admin/batch/${jobId}/confirm`, {}, adminReqConfig)
        .catch((err) => {
          expect(err.response.status).toEqual(400)
          expect(err.response.data.type).toEqual("not_allowed")
          expect(err.response.data.message).toEqual(
            "Cannot access a batch job that does not belong to the logged in user"
          )
        })
    })
  })*/
})
