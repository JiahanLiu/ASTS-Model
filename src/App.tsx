import { useValuationModel } from './hooks/useValuationModel';
import {
  ModelToggle,
  ThroughputModel,
  UserBasedModel,
  RevenueChart,
  StockPriceChart,
  ModelComparisonChart,
  ValuationSummary,
} from './components';

function App() {
  const {
    params,
    throughputResult,
    userBasedResult,
    activeResult,
    yearlyProjections,
    updateThroughputParam,
    updateUserBasedParam,
    updateFinancialParam,
    setActiveModel,
    resetToDefaults,
  } = useValuationModel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 7 9 3 5 7l4 4"/>
                  <path d="m17 11 4 4-4 4-4-4"/>
                  <path d="m8 12 4 4 6-6-4-4Z"/>
                  <path d="m16 8 3-3"/>
                  <path d="M9 21a6 6 0 0 0-6-6"/>
                </svg>
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-slate-800">ASTS Valuation Model</h1>
                <p className="text-xs text-slate-500">AST SpaceMobile Stock Price Calculator</p>
              </div>
            </div>

            <ModelToggle activeModel={params.activeModel} onChange={setActiveModel} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="mb-8 bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100 rounded-2xl p-4 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-1">Interactive Valuation Model</h3>
            <p className="text-sm text-slate-600">
              This model uses two complementary approaches from the Code Red research: <strong>Throughput-Yield</strong> (satellites × capacity × price)
              and <strong>User-Based</strong> (subscribers × attach rate × ARPU). Adjust the sliders to explore different scenarios.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Model Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Model Parameter Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ThroughputModel
                params={params.throughput}
                financial={params.financial}
                result={throughputResult}
                onParamChange={updateThroughputParam}
                onFinancialChange={updateFinancialParam}
              />

              <UserBasedModel
                params={params.userBased}
                financial={params.financial}
                result={userBasedResult}
                onParamChange={updateUserBasedParam}
                onFinancialChange={updateFinancialParam}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6">
              <RevenueChart data={yearlyProjections} activeModel={params.activeModel} />
              <StockPriceChart data={yearlyProjections} activeModel={params.activeModel} />
            </div>

            {/* Model Comparison */}
            {params.activeModel === 'both' && (
              <ModelComparisonChart
                throughputResult={throughputResult}
                userBasedResult={userBasedResult}
              />
            )}
          </div>

          {/* Right Column - Valuation Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ValuationSummary
                throughputResult={throughputResult}
                userBasedResult={userBasedResult}
                activeResult={activeResult}
                activeModel={params.activeModel}
                financial={params.financial}
                onFinancialChange={updateFinancialParam}
                onReset={resetToDefaults}
              />

              {/* Key Assumptions Card */}
              <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-display font-semibold text-slate-800 mb-4">Key Assumptions</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs">1</span>
                    </div>
                    <p className="text-slate-600">
                      <strong className="text-slate-800">50/50 Revenue Share</strong> with MNO partners (AT&T, Verizon, Vodafone, etc.)
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs">2</span>
                    </div>
                    <p className="text-slate-600">
                      <strong className="text-slate-800">85% EBITDA Margin</strong> due to net revenue accounting and low CAC
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs">3</span>
                    </div>
                    <p className="text-slate-600">
                      <strong className="text-slate-800">3B Addressable Users</strong> through existing MNO partnerships
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs">4</span>
                    </div>
                    <p className="text-slate-600">
                      <strong className="text-slate-800">~100 Satellites</strong> for initial continuous coverage constellation
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Source Attribution */}
              <div className="mt-6 text-center text-xs text-slate-400">
                <p>Based on research from Code Red 1 - AST SpaceMobile</p>
                <p className="mt-1">Model for educational purposes only. Not financial advice.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <span>ASTS Stock Price Model</span>
              <span className="text-slate-300">•</span>
              <span>Built with React + Recharts + TailwindCSS</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>Ticker: ASTS (NASDAQ)</span>
              <span className="text-slate-300">•</span>
              <a
                href="https://ast-science.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700"
              >
                ast-science.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

