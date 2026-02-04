import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

/**
 * Switch component.
 *
 * Note: when providing `checkedIcon` / `uncheckedIcon`, this component expects
 * a controlled `checked` prop. Using it in uncontrolled mode (with
 * `defaultChecked` only) may result in icons not reflecting the actual state.
 */
type SwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
  /**
   * Optional icon to render inside the thumb when the switch is checked.
   */
  checkedIcon?: React.ReactNode
  /**
   * Optional icon to render inside the thumb when the switch is unchecked.
   */
  uncheckedIcon?: React.ReactNode
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, checkedIcon, uncheckedIcon, ...props }, ref) => {
  const isChecked = !!props.checked

  return (
    <SwitchPrimitives.Root
      ref={ref}
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        className
      )}
      {...props}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[15px] data-[state=unchecked]:-translate-x-[5px]"
        )}
      >
        {isChecked ? checkedIcon : uncheckedIcon}
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  )
})
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
