# ASTS Stock Price Valuation Model

An interactive React web application that models AST SpaceMobile (ASTS) stock price using two complementary valuation methodologies from the Code Red research document.

## Features

- **Dual Valuation Models**:
  - **Throughput-Yield Model**: Revenue = Satellites × GB Capacity × Price/GB
  - **User-Based Model**: Revenue = Subscribers × Attachment Rate × ARPU

- **Interactive Parameter Controls**: Adjust all key variables with real-time updates
- **Revenue Projections**: Visualize growth from 2025-2030
- **Stock Price Trajectory**: See implied share price evolution
- **Model Comparison**: Side-by-side analysis of both approaches

## Key Assumptions (from Code Red Document)

- **50/50 Revenue Share** with MNO partners (AT&T, Verizon, Vodafone)
- **85% EBITDA Margin** due to net revenue accounting and low customer acquisition costs
- **3 Billion Addressable Users** through existing MNO partnerships
- **~100 Satellites** for initial continuous coverage constellation
- **$2/GB** baseline wholesale pricing

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
| Number of Satellites | 10-200 | 100 |
| Gross GB per Satellite/Year | 50-150M | 100M |
| Utilization Rate | 10-50% | 20% |
| Price per GB | $1-10 | $2 |

### User-Based Model
| Parameter | Range | Default |
|-----------|-------|---------|
| Total Subscribers | 500M-5B | 3B |
| Attachment Rate | 5-50% | 25% |
| Monthly ARPU | $5-25 | $10 |
| Revenue Share | 40-60% | 50% |

### Financial Parameters
| Parameter | Range | Default |
|-----------|-------|---------|
| EBITDA Margin | 70-95% | 85% |
| EV/EBITDA Multiple | 10-50x | 25x |
| Shares Outstanding (FD) | 350-500M | 402M |

## Price Target Reference (Code Red)

| Scenario | Target Price |
|----------|-------------|
| NAV Floor | $50 |
| 2026 Coverage | $73 |
| 2027 Full Constellation | $257 |
| Multi-Shell Upside | $250-1000 |

## Disclaimer

This model is for educational and informational purposes only. It is not financial advice. Always conduct your own research and consult with financial professionals before making investment decisions.

---

*Based on research from Code Red 1 - AST SpaceMobile*
