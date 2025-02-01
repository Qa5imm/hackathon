import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "~/lib/utils";

const Tabs = TabsPrimitive.Root;
const tabsListVariants = {
  default:
    "grid w-full grid-cols-2 p-1 border-4 border-black bg-white font-mono",
  subtle: "grid w-full grid-cols-2 border-b-2 border-black font-mono mb-6",
};

const tabsTriggerVariants = {
  default:
    "inline-flex items-center justify-center whitespace-nowrap border-2 border-black m-1 px-4 py-2 font-bold transition-transform hover:-translate-y-[2px] data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:[box-shadow:4px_4px_0_0_#000] data-[state=active]:translate-y-[-2px]",
  subtle:
    "inline-flex items-center justify-center whitespace-nowrap px-4 py-2 font-bold transition-all hover:text-gray-600 data-[state=active]:border-b-2 data-[state=active]:border-black",
};
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    variant?: keyof typeof tabsListVariants;
  }
>(({ className, variant = "default", ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants[variant], className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    variant?: keyof typeof tabsTriggerVariants;
  }
>(({ className, variant = "default", ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants[variant], className)}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 border-4 border-black bg-white p-6 [box-shadow:8px_8px_0_0_#000]",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
