"use client";

import * as React from "react";
import { motion, type Transition, type HTMLMotionProps } from "motion/react";

import {
  Highlight,
  HighlightItem,
  type HighlightItemProps,
  type HighlightProps,
} from "@/shared/components/animate-ui/primitives/effects/highlight";
import { getStrictContext } from "@/shared/lib/utils/get-strict-context";
import {
  Slot,
  type WithAsChild,
} from "@/shared/components/animate-ui/primitives/animate/slot";
import { cn } from "@/shared/lib/utils/core.util";

type TabsContextType = {
  activeValue: string;
  handleValueChange: (value: string) => void;
  registerTrigger: (value: string, node: HTMLElement | null) => void;
};

const [TabsProvider, useTabs] =
  getStrictContext<TabsContextType>("TabsContext");

type BaseTabsProps = React.ComponentProps<"div"> & {
  children: React.ReactNode;
};

type UnControlledTabsProps = BaseTabsProps & {
  defaultValue?: string;
  value?: never;
  onValueChange?: never;
};

type ControlledTabsProps = BaseTabsProps & {
  value: string;
  onValueChange?: (value: string) => void;
  defaultValue?: never;
};

type TabsProps = UnControlledTabsProps | ControlledTabsProps;

function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  ...props
}: TabsProps) {
  const [activeValue, setActiveValue] = React.useState<string | undefined>(
    defaultValue,
  );
  const triggersRef = React.useRef(new Map<string, HTMLElement>());
  const initialSet = React.useRef(false);
  const isControlled = value !== undefined;

  React.useEffect(() => {
    if (
      !isControlled &&
      activeValue === undefined &&
      triggersRef.current.size > 0 &&
      !initialSet.current
    ) {
      const firstTab = triggersRef.current.keys().next().value as
        string | undefined;
      if (firstTab !== undefined) {
        setActiveValue(firstTab);
        initialSet.current = true;
      }
    }
  }, [activeValue, isControlled]);

  const registerTrigger = React.useCallback(
    (val: string, node: HTMLElement | null) => {
      if (node) {
        triggersRef.current.set(val, node);
        if (!isControlled && activeValue === undefined && !initialSet.current) {
          setActiveValue(val);
          initialSet.current = true;
        }
      } else {
        triggersRef.current.delete(val);
      }
    },
    [activeValue, isControlled],
  );

  const handleValueChange = React.useCallback(
    (val: string) => {
      if (!isControlled) setActiveValue(val);
      else onValueChange?.(val);
    },
    [isControlled, onValueChange],
  );

  return (
    <TabsProvider
      value={{
        activeValue: (value ?? activeValue) as string,
        handleValueChange,
        registerTrigger,
      }}
    >
      <div data-slot="tabs" {...props}>
        {children}
      </div>
    </TabsProvider>
  );
}

type TabsHighlightProps = Omit<HighlightProps, "controlledItems" | "value">;

function TabsHighlight({
  transition = { type: "spring", stiffness: 200, damping: 25 },
  ...props
}: TabsHighlightProps) {
  const { activeValue } = useTabs();

  return (
    <Highlight
      data-slot="tabs-highlight"
      controlledItems
      value={activeValue}
      transition={transition}
      click={false}
      {...props}
    />
  );
}

type TabsListProps = React.ComponentProps<"div"> & {
  children: React.ReactNode;
};

function TabsList(props: TabsListProps) {
  return <div role="tablist" data-slot="tabs-list" {...props} />;
}

type TabsHighlightItemProps = HighlightItemProps & {
  value: string;
};

function TabsHighlightItem(props: TabsHighlightItemProps) {
  return <HighlightItem data-slot="tabs-highlight-item" {...props} />;
}

type TabsTriggerProps = WithAsChild<
  {
    value: string;
    children: React.ReactNode;
  } & HTMLMotionProps<"button">
>;

function TabsTrigger({
  ref,
  value,
  asChild = false,
  ...props
}: TabsTriggerProps) {
  const { activeValue, handleValueChange, registerTrigger } = useTabs();

  const localRef = React.useRef<HTMLButtonElement | null>(null);
  React.useImperativeHandle(ref, () => localRef.current as HTMLButtonElement);

  React.useEffect(() => {
    registerTrigger(value, localRef.current);
    return () => registerTrigger(value, null);
  }, [value, registerTrigger]);

  const Component = (asChild ? Slot : motion.button) as React.ElementType;

  return (
    <Component
      type="button"
      ref={localRef}
      data-slot="tabs-trigger"
      role="tab"
      onClick={() => handleValueChange(value)}
      data-state={activeValue === value ? "active" : "inactive"}
      {...props}
    />
  );
}

type TabsContentsProps = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
  transition?: Transition;
};

function TabsContents({
  children,
  className,
  transition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    bounce: 0,
    restDelta: 0.01,
  },
  ...props
}: TabsContentsProps) {
  const { activeValue } = useTabs();
  const childrenArray = React.Children.toArray(children);
  const activeIndex = childrenArray.findIndex(
    (child): child is React.ReactElement<{ value: string }> =>
      React.isValidElement(child) &&
      typeof child.props === "object" &&
      child.props !== null &&
      "value" in child.props &&
      child.props.value === activeValue,
  );

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const itemRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const [height, setHeight] = React.useState(0);
  const roRef = React.useRef<ResizeObserver | null>(null);

  const measure = React.useCallback((index: number) => {
    const pane = itemRefs.current[index];
    const container = containerRef.current;
    if (!pane || !container) return 0;

    const base = Math.max(
      pane.scrollHeight || 0,
      pane.offsetHeight || 0,
      pane.getBoundingClientRect().height || 0,
      (pane.firstElementChild as HTMLElement)?.scrollHeight || 0,
    );

    const cs = getComputedStyle(container);
    const isBorderBox = cs.boxSizing === "border-box";
    const paddingY =
      (Number.parseFloat(cs.paddingTop || "0") || 0) +
      (Number.parseFloat(cs.paddingBottom || "0") || 0);
    const borderY =
      (Number.parseFloat(cs.borderTopWidth || "0") || 0) +
      (Number.parseFloat(cs.borderBottomWidth || "0") || 0);

    let total = base + (isBorderBox ? paddingY + borderY : 0);

    const dpr =
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    total = Math.ceil(total * dpr) / dpr;

    return total;
  }, []);

  React.useLayoutEffect(() => {
    if (roRef.current) {
      roRef.current.disconnect();
      roRef.current = null;
    }

    const pane = itemRefs.current[activeIndex];
    const container = containerRef.current;
    if (!pane || !container) return;

    const next = measure(activeIndex);
    if (next !== 0) {
      requestAnimationFrame(() => setHeight(next));
    }

    const ro = new ResizeObserver(() => {
      const nextHeight = measure(activeIndex);
      requestAnimationFrame(() => setHeight(nextHeight));
    });

    ro.observe(pane);
    ro.observe(container);

    roRef.current = ro;
    return () => {
      ro.disconnect();
      roRef.current = null;
    };
  }, [activeIndex, childrenArray.length, measure]);

  const isHFull = className?.includes("h-full");

  return (
    <motion.div
      ref={containerRef}
      data-slot="tabs-contents"
      style={{ overflow: "hidden" }}
      animate={isHFull ? undefined : { height: height > 0 ? height : "100%" }}
      transition={transition}
      className={cn("w-full", className)}
      {...props}
    >
      <motion.div
        className={cn("flex items-start -mx-2", isHFull && "h-full")}
        animate={{ x: activeIndex * -100 + "%" }}
        transition={transition}
      >
        {childrenArray.map((child, index) => {
          const itemKey =
            React.isValidElement(child) &&
            (child.key || (child.props as { value?: string })?.value)
              ? child.key || (child.props as { value?: string }).value
              : undefined;

          return (
            <div
              key={itemKey}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className={cn("w-full shrink-0 px-2", isHFull && "h-full")}
            >
              {child}
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

type TabsContentProps = WithAsChild<
  {
    value: string;
    children: React.ReactNode;
  } & HTMLMotionProps<"div">
>;

function TabsContent({
  value,
  style,
  asChild = false,
  className,
  ...props
}: TabsContentProps) {
  const { activeValue } = useTabs();
  const isActive = activeValue === value;

  const Component = (asChild ? Slot : motion.div) as React.ElementType;

  return (
    <Component
      role="tabpanel"
      data-slot="tabs-content"
      inert={!isActive}
      style={{ overflow: "hidden", ...style }}
      initial={{ filter: "blur(0px)" }}
      animate={{ filter: isActive ? "blur(0px)" : "blur(4px)" }}
      exit={{ filter: "blur(0px)" }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className={cn("w-full", className)}
      {...props}
    />
  );
}

export {
  Tabs,
  TabsList,
  TabsHighlight,
  TabsHighlightItem,
  TabsTrigger,
  TabsContents,
  TabsContent,
  useTabs,
  type TabsProps,
  type TabsListProps,
  type TabsHighlightProps,
  type TabsHighlightItemProps,
  type TabsTriggerProps,
  type TabsContentsProps,
  type TabsContentProps,
  type TabsContextType,
};
