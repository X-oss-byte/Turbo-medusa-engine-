import React, { useContext, useMemo } from "react"
import { Order } from "@medusajs/medusa"
import OrderLine from "../order-line"
import { DisplayTotal, PaymentDetails } from "../templates"
import CopyToClipboard from "../../../../components/atoms/copy-to-clipboard"
import Badge from "../../../../components/fundamentals/badge"
import { FeatureFlagContext } from "../../../../context/feature-flag"
import { OrderEditContext } from "../../edit/context"
import BodyCard from "../../../../components/organisms/body-card"
import { sum } from "lodash"
import { useAdminReservations } from "medusa-react"
import StatusIndicator from "../../../../components/fundamentals/status-indicator"
import { ActionType } from "../../../../components/molecules/actionables"
import useToggleState from "../../../../hooks/use-toggle-state"
import AllocateItemsModal from "../allocations/allocate-items-modal"

type SummaryCardProps = {
  order: Order
}
const SummaryCard: React.FC<SummaryCardProps> = ({
  order,
}: {
  order: Order
}) => {
  const {
    state: allocationModalIsOpen,
    open: showAllocationModal,
    close: closeAllocationModal,
  } = useToggleState()

  const { isFeatureEnabled } = useContext(FeatureFlagContext)
  const { showModal } = useContext(OrderEditContext)
  const { reservations, isLoading } = useAdminReservations({
    line_item_id: order.items.map((item) => item.id),
  })

  const reservationItemsMap = useMemo(() => {
    if (!reservations?.length || isLoading) {
      return {}
    }

    return reservations.reduce((acc, item) => {
      if (!item.line_item_id) {
        return acc
      }
      acc[item.line_item_id] = acc[item.line_item_id]
        ? [...acc[item.line_item_id], item]
        : [item]
      return acc
    }, {})
  }, [reservations, isLoading])

  const allItemsReserved = useMemo(() => {
    return order.items.every((item) => {
      const reservations = reservationItemsMap[item.id]
      if (!reservations) {
        return false
      }
      return sum(reservations.map((r) => r.quantity)) === item.quantity
    })
  }, [reservationItemsMap, order])

  const { hasMovements, swapAmount, manualRefund, swapRefund, returnRefund } =
    useMemo(() => {
      let manualRefund = 0
      let swapRefund = 0
      let returnRefund = 0

      const swapAmount = sum(order?.swaps.map((s) => s.difference_due) || [0])

      if (order?.refunds?.length) {
        order.refunds.forEach((ref) => {
          if (ref.reason === "other" || ref.reason === "discount") {
            manualRefund += ref.amount
          }
          if (ref.reason === "return") {
            returnRefund += ref.amount
          }
          if (ref.reason === "swap") {
            swapRefund += ref.amount
          }
        })
      }
      return {
        hasMovements:
          swapAmount + manualRefund + swapRefund + returnRefund !== 0,
        swapAmount,
        manualRefund,
        swapRefund,
        returnRefund,
      }
    }, [order])

  const actionables = useMemo(() => {
    const actionables: ActionType[] = []
    if (isFeatureEnabled("order_editing")) {
      actionables.push({
        label: "Edit Order",
        onClick: showModal,
      })
    }
    if (isFeatureEnabled("inventoryService")) {
      actionables.push({
        label: "Allocate",
        onClick: showAllocationModal,
      })
    }
    return actionables
  }, [showModal, isFeatureEnabled, showAllocationModal])

  return (
    <BodyCard
      className={"mb-4 h-auto min-h-0 w-full"}
      title="Summary"
      status={
        isFeatureEnabled("inventoryService") && (
          <StatusIndicator
            variant={allItemsReserved ? "success" : "danger"}
            title={allItemsReserved ? "Allocated" : "Awaits allocation"}
            className="rounded-rounded border px-3 py-1.5"
          />
        )
      }
      actionables={actionables}
    >
      <div className="mt-6">
        {order.items?.map((item, i) => (
          <OrderLine
            key={i}
            item={item}
            currencyCode={order.currency_code}
            reservations={reservationItemsMap[item.id]}
          />
        ))}
        <DisplayTotal
          currency={order.currency_code}
          totalAmount={order.subtotal}
          totalTitle={"Subtotal"}
        />
        {order?.discounts?.map((discount, index) => (
          <DisplayTotal
            key={index}
            currency={order.currency_code}
            totalAmount={-1 * order.discount_total}
            totalTitle={
              <div className="inter-small-regular flex items-center text-grey-90">
                Discount:{" "}
                <Badge className="ml-3" variant="default">
                  {discount.code}
                </Badge>
              </div>
            }
          />
        ))}
        {order?.gift_cards?.map((giftCard, index) => (
          <DisplayTotal
            key={index}
            currency={order.currency_code}
            totalAmount={-1 * order.gift_card_total}
            totalTitle={
              <div className="inter-small-regular flex items-center text-grey-90">
                Gift card:
                <Badge className="ml-3" variant="default">
                  {giftCard.code}
                </Badge>
                <div className="ml-2">
                  <CopyToClipboard
                    value={giftCard.code}
                    showValue={false}
                    iconSize={16}
                  />
                </div>
              </div>
            }
          />
        ))}
        <DisplayTotal
          currency={order.currency_code}
          totalAmount={order.shipping_total}
          totalTitle={"Shipping"}
        />
        <DisplayTotal
          currency={order.currency_code}
          totalAmount={order.tax_total}
          totalTitle={`Tax`}
        />
        <DisplayTotal
          variant={"large"}
          currency={order.currency_code}
          totalAmount={order.total}
          totalTitle={hasMovements ? "Original Total" : "Total"}
        />
        <PaymentDetails
          manualRefund={manualRefund}
          swapAmount={swapAmount}
          swapRefund={swapRefund}
          returnRefund={returnRefund}
          paidTotal={order.paid_total}
          refundedTotal={order.refunded_total}
          currency={order.currency_code}
        />
      </div>
      {allocationModalIsOpen && (
        <AllocateItemsModal
          reservationItemsMap={reservationItemsMap}
          order={order}
          close={closeAllocationModal}
        />
      )}
    </BodyCard>
  )
}

export default SummaryCard
