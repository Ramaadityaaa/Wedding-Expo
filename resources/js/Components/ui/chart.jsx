"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  Rectangle,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Sector,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"

// Hapus: type ChartConfig

const CHART_COLORS = {
  "chart-1": "var(--color-chart-1)",
  "chart-2": "var(--color-chart-2)",
  "chart-3": "var(--color-chart-3)",
  "chart-4": "var(--color-chart-4)",
  "chart-5": "var(--color-chart-5)",
}

// Hapus: type ChartContextProps
const ChartContext = React.createContext(null)

function ChartProvider({ config, children }) {
  const chartConfig = React.useMemo(() => {
    if (!config) {
      return {
        ...CHART_COLORS,
        ...Object.keys(CHART_COLORS).reduce((prev, curr) => {
          prev[curr] = CHART_COLORS[curr]
          return prev
        }, {}),
      }
    }

    const colorKeys = Object.keys(CHART_COLORS)
    const configColors = Object.keys(config).filter((key) =>
      colorKeys.includes(key)
    )

    return {
      ...CHART_COLORS,
      ...configColors.reduce((prev, curr) => {
        prev[curr] = config[curr]
        return prev
      }, {}),
    }
  }, [config])

  return (
    <ChartContext.Provider value={{ chartConfig }}>
      {children}
    </ChartContext.Provider>
  )
}

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartProvider />")
  }

  return context
}

// Hapus: interface ChartContainerProps
const ChartContainer = React.forwardRef(({
  config,
  className,
  children,
  ...props
}, ref) => {
  return (
    <ChartProvider config={config}>
      <ResponsiveContainer ref={ref} className={cn("aspect-video", className)} {...props}>
        {children}
      </ResponsiveContainer>
    </ChartProvider>
  )
})
ChartContainer.displayName = "Chart"

const ChartTooltip = Tooltip

const ChartTooltipContent = React.forwardRef(({
  className,
  indicator = "dot",
  hideLabel,
  hideIndicator,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  name,
  item,
  ...props
}, ref) => {
  const { chartConfig } = useChart()

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !label) {
      return null
    }

    if (labelFormatter) {
      return labelFormatter(label, chartConfig)
    }

    return String(label)
  }, [label, labelFormatter, hideLabel, chartConfig])

  if (!item?.payload?.length) {
    return null
  }

  const [itemConfig] = Object.entries(chartConfig).filter(
    ([key, value]) =>
      item.dataKey === key && typeof value === "object"
  )

  const indicatorColor = color || item.color || itemConfig?.[1].color

  return (
    <div
      ref={ref}
      className={cn(
        "grid min-w-32 items-stretch gap-1.5 rounded-lg border bg-popover px-3 py-2.5 text-sm shadow-xl",
        className
      )}
      {...props}
    >
      {!hideLabel && tooltipLabel ? (
        <div className={cn("font-medium", labelClassName)}>{tooltipLabel}</div>
      ) : null}
      <ul className="grid gap-1.5">
        {item.payload.map((item, i) => {
          const [itemConfig] = Object.entries(chartConfig).filter(
            ([key, value]) =>
              item.dataKey === key && typeof value === "object"
          )
          
          const name =
            formatter?.(item.value, item.name, item.payload, i, chartConfig)
              ? null
              : item.name
          const value =
            formatter?.(item.value, item.name, item.payload, i, chartConfig) ||
            item.value

          return (
            <li
              key={item.dataKey}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                {!hideIndicator ? (
                  <span
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-[2px]",
                      indicator === "dot" && "rounded-full",
                      indicator === "line" && "h-0.5 w-3",
                      indicator === "dashed" && "h-0.5 w-3 border-[1px] border-dashed"
                    )}
                    style={{
                      backgroundColor: indicatorColor
                    }}
                  />
                ) : null}
                <span
                  className="font-medium"
                >
                  {itemConfig?.[1].label || name}
                </span>
              </div>
              <span className="font-medium">
                {value}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
})
ChartTooltipContent.displayName = Tooltip.displayName

const ChartLegend = Legend

const ChartLegendContent = React.forwardRef(({
  className,
  hideIcon,
  payload,
  ...props
}, ref) => {
  const { chartConfig } = useChart()

  if (!payload || !payload.length) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-center gap-4", className)}
      {...props}
    >
      {payload.map((item) => {
        const [itemConfig] = Object.entries(chartConfig).filter(
          ([key, value]) =>
            item.dataKey === key && typeof value === "object"
        )
        const color = item.color || itemConfig?.[1].color

        return (
          <div
            key={item.value}
            className={cn(
              "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3"
            )}
          >
            {!hideIcon ? (
              <div
                className="h-2 w-2 shrink-0 rounded-full"
                style={{
                  backgroundColor: color
                }}
              />
            ) : null}
            {itemConfig?.[1].label || item.value}
          </div>
        )
      })}
    </div>
  )
})
ChartLegendContent.displayName = Legend.displayName

// Hapus: type ChartBaseProps
const ChartBase = React.forwardRef(({
  data,
  className,
  children,
  ...props
}, ref) => {
  const { chartConfig } = useChart()

  return (
    <div ref={ref} className={cn("h-full w-full", className)} {...props}>
      {React.cloneElement(
        children,
        {
          data: data,
          ...Object.keys(chartConfig)
            .filter((key) => typeof chartConfig[key] === "object")
            .reduce((prev, key) => {
              prev[key] = {
                fill: chartConfig[key].color,
                ...chartConfig[key],
              }
              return prev
            }, {}),
          ...props[children.type.displayName || ""],
        }
      )}
    </div>
  )
})
ChartBase.displayName = "ChartBase"

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartBase,
  ChartProvider,
  useChart,
  // Re-export recharts components
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  RadialBarChart,
  ScatterChart,
  Treemap,
  Bar,
  Line,
  Pie,
  Radar,
  RadialBar,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Rectangle,
  Sector,
  Label,
  LabelList,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
}