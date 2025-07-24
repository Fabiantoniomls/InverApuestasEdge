"use client"

import * as React from "react"
import { ChevronsLeft, ChevronsRight } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { Button, type ButtonProps } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

const SidebarContext = React.createContext<{
  isCollapsed: boolean
  isMobile: boolean
  setCollapsed: (collapsed: boolean) => void
}>({
  isCollapsed: false,
  isMobile: false,
  setCollapsed: () => undefined,
})

function SidebarProvider({
  children,
  defaultCollapsed,
}: {
  children: React.ReactNode
  defaultCollapsed?: boolean
}) {
  const isMobile = useIsMobile()
  const [isCollapsed, setCollapsed] = React.useState(
    (defaultCollapsed || isMobile) ?? false
  )

  React.useEffect(() => {
    setCollapsed(isMobile)
  }, [isMobile])

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isMobile,
        setCollapsed,
      }}
    >
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </SidebarContext.Provider>
  )
}

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

const sidebarVariants = cva(
  "flex h-full flex-col data-[collapsible=true]:transition-[width]",
  {
    variants: {
      collapsed: {
        true: "w-14",
        false: "w-56",
      },
    },
  }
)

function Sidebar({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
}) {
  const { isCollapsed } = useSidebar()
  return (
    <div
      data-collapsible={!isCollapsed}
      className={cn(
        sidebarVariants({ collapsed: isCollapsed }),
        "group",
        className
      )}
    >
      {children}
    </div>
  )
}

function SidebarHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)} {...props} />
}

function SidebarContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex h-full flex-col overflow-y-auto", className)}
      {...props}
    />
  )
}

function SidebarMenu({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex h-full flex-col justify-center", className)}
      {...props}
    />
  )
}

function SidebarMenuItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-2", className)} {...props} />
}

const itemVariants = cva(
  "flex w-full cursor-pointer items-center justify-start gap-2 rounded-md p-2 text-sm text-muted-foreground",
  {
    variants: {
      isActive: {
        true: "bg-primary/10 text-primary",
        false: "hover:bg-accent",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }
)

interface ItemProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof itemVariants> {
  tooltip: string
}

function SidebarMenuButton({
  className,
  isActive,
  tooltip,
  children,
  ...props
}: ItemProps) {
  const { isCollapsed } = useSidebar()
  const child = <span className="truncate">{children}</span>

  return isCollapsed ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className={cn(itemVariants({ isActive }), className)} {...props}>
          {child}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" align="center">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  ) : (
    <button className={cn(itemVariants({ isActive }), className)} {...props}>
      {child}
    </button>
  )
}

function SidebarFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-auto p-2", className)} {...props} />
}

function SidebarInset({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-3", className)} {...props} />
}

function SidebarTrigger({ className, ...props }: ButtonProps) {
  const { isCollapsed, setCollapsed } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("size-8", className)}
      onClick={() => setCollapsed(!isCollapsed)}
      {...props}
    >
      {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
    </Button>
  )
}

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarProvider,
  useSidebar,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
}
