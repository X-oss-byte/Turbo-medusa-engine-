import React from "react"
import Tooltip from "@site/src/components/Tooltip"
import { NavbarAction } from "@medusajs/docs"
import Icon from "@site/src/theme/Icon"
import clsx from "clsx"

type NavbarActionsProps = {
  items: NavbarAction[]
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

const NavbarActions: React.FC<NavbarActionsProps> = ({
  items = [],
  className = "",
}) => {
  return (
    <div className={clsx("lg:block hidden", className)}>
      {items.map((item, index) => {
        // eslint-disable-next-line no-case-declarations
        const ItemIconElm = item.Icon
        const ItemIcon = item.icon ? Icon[item.icon] : null
        switch (item.type) {
          case "link":
            return (
              <Tooltip
                text={item.title}
                html={item.html}
                key={index}
                tooltipClassName="!text-compact-x-small-plus"
              >
                <a
                  href={item.href}
                  title={item.title}
                  className={clsx(
                    (ItemIcon || ItemIconElm) && "navbar-action-icon-item",
                    item.className
                  )}
                >
                  {item.label}
                  {ItemIconElm}
                  {ItemIcon && <ItemIcon />}
                </a>
              </Tooltip>
            )
          case "button":
            return (
              <Tooltip
                text={item.title}
                html={item.html}
                key={index}
                tooltipClassName="!text-compact-x-small-plus"
              >
                <button
                  className={clsx(
                    (ItemIcon || ItemIconElm) && "navbar-action-icon-item",
                    item.className
                  )}
                  {...item.events}
                >
                  {item.label}
                  {ItemIconElm}
                  {ItemIcon && <ItemIcon />}
                </button>
              </Tooltip>
            )
          default:
            return <></>
        }
      })}
    </div>
  )
}

export default NavbarActions
