import * as React from "react"
import { Menu } from "@base-ui/react/menu"
import { cn } from "@/lib/utils"

const DropdownMenu = Menu.Root

const DropdownMenuTrigger = React.forwardRef<
  HTMLElement,
  { render?: React.ReactElement; children?: React.ReactNode }
>(({ render, children, ...props }, ref) => {
  return (
    <Menu.Trigger
      render={render}
      ref={ref}
      {...props}
    >
      {children}
    </Menu.Trigger>
  )
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  { align?: "start" | "center" | "end"; className?: string; children?: React.ReactNode }
>(({ align = "end", className, children, ...props }, ref) => (
  <Menu.Portal>
    <Menu.Positioner align={align} className="z-50 min-w-56 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:scale-95 data-[state=open]:scale-100">
      <Menu.Popup
        ref={ref}
        className={cn(
          "w-full outline-none",
          className
        )}
        {...props}
      >
        {children}
      </Menu.Popup>
    </Menu.Positioner>
  </Menu.Portal>
))
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; onClick?: () => void }
>(({ className, children, onClick, ...props }, ref) => (
  <Menu.Item
    ref={ref}
    onClick={onClick}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    {children}
  </Menu.Item>
))
DropdownMenuItem.displayName = "DropdownMenuItem"

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }
