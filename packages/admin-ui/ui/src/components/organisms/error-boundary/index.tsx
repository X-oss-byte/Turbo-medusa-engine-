import { AxiosError } from "axios"
import React, { ErrorInfo } from "react"
import { analyticsOptIn } from "../../../services/analytics"
import Button from "../../fundamentals/button"
import { WRITE_KEY } from "../../../constants/analytics"
import { AnalyticsBrowser } from "@segment/analytics-next"

type State = {
  hasError: boolean
  status?: number
  message?: string
}

type Props = {
  children?: React.ReactNode
}

// Analytics instance used for tracking errors
let analyticsInstance: ReturnType<typeof AnalyticsBrowser.load> | undefined;

const analytics = () => {
  if (!analyticsInstance) {
    analyticsInstance = AnalyticsBrowser.load({
      writeKey: WRITE_KEY,
    })
  }
  return analyticsInstance
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  static getDerivedStateFromError(error: Error) {
    const state: State = {
      hasError: true,
      status: undefined,
      message: error.message,
    }

    if (isNetworkError(error)) {
      state.status = error.response?.status
    }

    return state
  }

  public async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const shouldTrack = await shouldTrackEvent(error)

    if (!shouldTrack) {
      return
    }

    const properties = getTrackingInfo(error, errorInfo)
    analytics().track("error", properties)
  }

  public dismissError = () => {
    history.back()
    this.setState({ hasError: false })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="px-large flex h-screen items-center justify-center">
          <div className="max-w-[600px]">
            <div>
              <div>
                {this.state.status && (
                  <p className="text-grey-60 inter-small-semibold opacity-75">
                    {this.state.status}
                  </p>
                )}
                <h1 className="inter-xlarge-semibold mb-xsmall">
                  {errorMessage(this.state.status)}
                </h1>
                <p className="inter-base-regular text-grey-50">
                  {errorDescription(this.state.status)}
                </p>
              </div>

              <div className="mt-xlarge flex w-full  items-center">
                <Button
                  size="small"
                  variant="primary"
                  onClick={this.dismissError}
                >
                  Back to dashboard
                </Button>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      )
    }

    return this.props.children
  }
}

const isNetworkError = (error: Error): error is AxiosError => {
  return error["response"] !== undefined && error["response"] !== null
}

const shouldTrackEvent = async (error: Error) => {
  // Don't track 404s
  if (isNetworkError(error) && error.response?.status === 404) {
    return false
  }

  return await analyticsOptIn();
}

const errorMessage = (status?: number) => {
  const defaultMessage = "An unknown error occured"

  if (!status) {
    return defaultMessage
  }

  const message = {
    400: "Bad request",
    401: "You are not logged in",
    403: "You do not have permission perform this action",
    404: "Page was not found",
    500: "An unknown server error occured",
    503: "Server is currently unavailable",
  }[status]

  return message || defaultMessage
}

const errorDescription = (status?: number) => {
  const defaultDescription =
    "An error occurred with unspecified causes, this is most likely due to a techinical issue on our end. Please try refreshing the page. If the issue keeps happening, contact your administrator."

  if (!status) {
    return defaultDescription
  }

  const description = {
    400: "The request was malformed, fix your request and please try again.",
    401: "You are not logged in, please log in to proceed.",
    403: "You do not have permission perform this action, if you think this is a mistake, contact your administrator.",
    404: "The page you have requested was not found, please check the URL and try again.",
    500: "The server was not able to handle your request, this is mostly likely due to a techinical issue on our end. Please try again. If the issue keeps happening, contact your administrator.",
    503: "The server is temporarily unavailable, and your request could not be processed. Please try again later. If the issue keeps happening, contact your administrator.",
  }[status]

  return description || defaultDescription
}

const getTrackingInfo = (error: Error, errorInfo: ErrorInfo) => {
  return {
    error: error.message,
    componentStack: errorInfo.componentStack,
  }
}

export default ErrorBoundary
