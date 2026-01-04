# ASTS Stock Price Valuation Model

An interactive React web application that models AST SpaceMobile (ASTS) stock price using two complementary valuation methodologies.

**Live Demo:** https://jiahanliu.github.io/ASTS-Model/

## Features

- **Dual Valuation Models**:
  - **Throughput-Yield Model**: Revenue = Satellites × GB Capacity × Utilization × Price/GB
  - **User-Based Model**: Revenue = Subscribers × Attachment Rate × ARPU × Revenue Share

- **Interactive Parameter Controls**: Adjust all key variables with real-time updates
- **Yearly Schedules**: Customizable satellite deployment, attachment rate, and EV/EBITDA multiple schedules (2026-2030)
- **Revenue Projections**: Visualize growth trajectory with model comparison
- **Stock Price Trajectory**: See implied share price evolution with average calculation
- **Transparent Math**: Collapsible breakdowns showing step-by-step calculations

## Key Assumptions

- **50/50 Revenue Share** with MNO partners (AT&T, Verizon, Vodafone, etc.)
- **85% EBITDA Margin** due to net revenue accounting and low customer acquisition costs
- **3 Billion Addressable Users** through existing MNO partnerships
- **200 Satellites** by 2030 for full constellation
- **~$2B Net Debt** for constellation financing
- **~650M Shares** fully diluted for capital raises

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **Recharts** for interactive charts
- **TailwindCSS** for styling

## Model Parameters

### Throughput-Yield Model
| Parameter | Range | Default |
|-----------|-------|---------|
| Number of Satellites | 10-300 | 200 |
| Gross GB per Satellite/Year | 50-200M | 150M |
| Utilization Rate | 1-99% | 15% |
| Price per GB | $0.10-100 | $5 |

### User-Based Model
| Parameter | Range | Default |
|-----------|-------|---------|
| Total Subscribers | 500M-5B | 3B |
| Attachment Rate | 0.1-50% | 10% |
| Monthly ARPU | $1-50 | $8 |
| Revenue Share | 30-70% | 50% |

### Financial Parameters
| Parameter | Range | Default |
|-----------|-------|---------|
| EBITDA Margin | 0-95% | 85% |
| EV/EBITDA Multiple | 5-50x | 15x (2030) |
| Shares Outstanding (FD) | 400-1000M | 650M |
| Net Debt | $0-5B | $2B |

### Yearly Schedules

**Satellite Deployment:**
| 2026 | 2027 | 2028 | 2029 | 2030 |
|------|------|------|------|------|
| 45 | 90 | 135 | 170 | 200 |

**Attachment Rate:**
| 2026 | 2027 | 2028 | 2029 | 2030 |
|------|------|------|------|------|
| 2% | 4% | 6% | 8% | 10% |

**EV/EBITDA Multiple:**
| 2026 | 2027 | 2028 | 2029 | 2030 |
|------|------|------|------|------|
| 25x | 22x | 19x | 16x | 15x |

## Project Structure

```
src/
├── components/
│   ├── MathBreakdown.tsx    # Transparent calculation displays
│   ├── ModelToggle.tsx      # Model selection toggle
│   ├── ParameterSlider.tsx  # Reusable slider components
│   ├── RevenueChart.tsx     # Revenue and stock price charts
│   ├── ScheduleEditor.tsx   # Yearly schedule editors
│   ├── ThroughputModel.tsx  # Throughput model panel
│   ├── UserBasedModel.tsx   # User-based model panel
│   └── ValuationSummary.tsx # Main valuation display
├── hooks/
│   └── useValuationModel.ts # Core calculation logic and state
├── types/
│   └── index.ts             # TypeScript interfaces and defaults
├── constants/
│   └── defaults.ts          # Formatting utilities and constants
├── App.tsx                  # Main application component
└── main.tsx                 # React entry point
```

## References

- [TheKOOKReport - AST SpaceMobile Analysis](https://www.kookreport.com/post/ast-spacemobile-asts-the-mobile-satellite-cellular-network-monopoly-please-find-my-final-comp)

## Disclaimer

This model is for educational and informational purposes only. It is not financial advice. Always conduct your own research and consult with financial professionals before making investment decisions.

---

*Built with React + Recharts + TailwindCSS*
