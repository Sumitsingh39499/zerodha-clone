import {useEffect, useRef} from "react"
import { createChart, CandlestickSeries } from "lightweight-charts"


const StockChart = ({ symbol }) => {
  const chartRef = useRef(null)

  useEffect(() => {
    if (!symbol || !chartRef.current) return

  // 1. Create chart
  const chart = createChart(chartRef.current, {
    width: chartRef.current.clientWidth,
    height: 400,
    layout: { background: { color: "#1a1a1a" }, textColor: "#ccc" },
    grid: { vertLines: { color: "#2a2a2a" }, horzLines: { color: "#2a2a2a" } },
  })

  // 2. Add candlestick series
  const candleSeries = chart.addSeries(CandlestickSeries, {
    upColor: "#00d09c",
    downColor: "#e94560",
    borderUpColor: "#00d09c",
    borderDownColor: "#e94560",
    wickUpColor: "#00d09c",
    wickDownColor: "#e94560",
})

const fetchData = () => {
    const candles = []
    let basePrice = 100

    // set base price based on symbol
    if (symbol === "TCS") basePrice = 3940
    else if (symbol === "RELIANCE") basePrice = 2850
    else if (symbol === "HDFCBANK") basePrice = 1650
    else if (symbol === "INFY") basePrice = 1820
    else basePrice = 1000

    // generate 90 days of fake candlestick data
    const now = Math.floor(Date.now() / 1000)
    for (let i = 89; i >= 0; i--) {
        const time = now - i * 24 * 60 * 60
        const open = basePrice + (Math.random() - 0.5) * 100
        const close = open + (Math.random() - 0.5) * 80
        const high = Math.max(open, close) + Math.random() * 40
        const low = Math.min(open, close) - Math.random() * 40
        basePrice = close
        candles.push({
            time,
            open: +open.toFixed(2),
            high: +high.toFixed(2),
            low: +low.toFixed(2),
            close: +close.toFixed(2)
        })
    }
    candleSeries.setData(candles)
}

fetchData()

  // 3. Fetch data from Finnhub
//   const fetchData = async () => {
//     const to = Math.floor(Date.now() / 1000)
//     const from = to - 90 * 24 * 60 * 60
//     const fSymbol = `${symbol}.NS`
//     const url = `https://finnhub.io/api/v1/stock/candle?symbol=${fSymbol}&resolution=D&from=${from}&to=${to}&token=${import.meta.env.VITE_FINNHUB_KEY}`

//     const res = await fetch(url)
//     const data = await res.json()
// console.log("Finnhub response:", data)

//     if (data.s === "ok") {
//       const candles = data.t.map((time, i) => ({
//         time,
//         open: data.o[i],
//         high: data.h[i],
//         low: data.l[i],
//         close: data.c[i],
//       }))
//       candleSeries.setData(candles)
//     }
//   }


  // 4. Cleanup
  return () => chart.remove()

  }, [symbol])

  return (
    <div>
      <h3>{symbol} — Price Chart</h3>
      <div ref={chartRef} style={{ width: "100%", height: "400px" }} />
    </div>
  )
}
export default StockChart