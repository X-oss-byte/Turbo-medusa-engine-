import { AuthService } from "../../../../services"
import { Request, Response } from "express"

/**
 * @oas [delete] /auth
 * operationId: "DeleteAuth"
 * summary: "Log out"
 * description: "Destroys a Customer's authenticated session."
 * x-authenticated: true
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'https://medusa-url.com/store/auth' \
 *       --header 'Cookie: connect.sid={sid}'
 * security:
 *   - cookie_auth: []
 * tags:
 *   - Auth
 * responses:
 *  "200":
 *    description: OK
 *  "400":
 *    $ref: "#/components/responses/400_error"
 *  "401":
 *    $ref: "#/components/responses/unauthorized"
 *  "404":
 *    $ref: "#/components/responses/not_found_error"
 *  "409":
 *    $ref: "#/components/responses/invalid_state_error"
 *  "422":
 *    $ref: "#/components/responses/invalid_request_error"
 *  "500":
 *    $ref: "#/components/responses/500_error"
 */
export default async (req: Request, res: Response) => {
  const authService = req.scope.resolve("authService") as AuthService
  const authStrategy = await authService.retrieveAuthenticationStrategy(
    req,
    "store"
  )
  await authStrategy.unAuthenticate(req, res)
}
