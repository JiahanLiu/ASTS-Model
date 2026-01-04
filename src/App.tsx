import { useValuationModel } from './hooks/useValuationModel';
import { useCurrentStockPrice } from './hooks/useCurrentStockPrice';
import {
  ModelToggle,
  ThroughputModel,
  UserBasedModel,
  RevenueChart,
  StockPriceChart,
  ValuationSummary,
} from './components';

function App() {
  const {
    params,
    throughputResult,
    userBasedResult,
    activeResult,
    yearlyProjections,
    constellationSchedule,
    attachmentSchedule,
    evEbitdaSchedule,
    updateThroughputParam,
    updateUserBasedParam,
    updateFinancialParam,
    updateConstellationSchedule,
    updateAttachmentSchedule,
    updateEvEbitdaSchedule,
    setActiveModel,
    resetToDefaults,
  } = useValuationModel();

  // Fetch current stock price
  const { currentPrice, isLive: isLivePrice, setManualPrice } = useCurrentStockPrice();

  // Calculate upside percentage
  const upside = currentPrice && currentPrice > 0
    ? ((activeResult.stockPrice - currentPrice) / currentPrice) * 100
    : null;

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
              This app is based on{' '}
              <a
                href="https://www.kookreport.com/post/ast-spacemobile-asts-the-mobile-satellite-cellular-network-monopoly-please-find-my-final-comp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 underline font-medium"
              >
                TheKOOKReport
              </a>{' '}
              models: <strong>Throughput-Yield</strong> (satellites × capacity × price)
              and <strong>User-Based</strong> (subscribers × attach rate × ARPU). Adjust the sliders to explore different scenarios.
            </p>
            <p className="text-xs text-slate-400 mt-2 italic">
              Developed by{' '}
              <a
                href="https://x.com/Jiahanjimliu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-600 hover:underline"
              >
                @Jiahanjimliu
              </a>
              ,{' '}
              <a
                href="https://x.com/StockMeetUps"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-600 hover:underline"
              >
                @StockMeetUps
              </a>
              , and Aarush; contact for feedback
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Financial modeling and research by{' '}
              <a
                href="https://x.com/spacanpanman"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-600 hover:underline"
              >
                @spacanpanman
              </a>
              {' '}and{' '}
              <a
                href="https://x.com/thekookreport"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-600 hover:underline"
              >
                @thekookreport
              </a>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Model for educational purposes only. Not financial advice.
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column - Charts & Valuation Display */}
          <div className="space-y-6">
            {/* Stock Price Trajectory - First */}
            <StockPriceChart
              data={yearlyProjections}
              activeModel={params.activeModel}
              currentPrice={currentPrice}
              impliedPrice={activeResult.stockPrice}
              isLivePrice={isLivePrice}
              onManualPriceChange={setManualPrice}
            />

            {/* Revenue Projections - Second */}
            <RevenueChart data={yearlyProjections} activeModel={params.activeModel} />

            {/* Valuation Summary - Third */}
            <ValuationSummary
              throughputResult={throughputResult}
              userBasedResult={userBasedResult}
              activeResult={activeResult}
              activeModel={params.activeModel}
              financial={params.financial}
              evEbitdaSchedule={evEbitdaSchedule}
              currentPrice={currentPrice}
              upside={upside}
              onFinancialChange={updateFinancialParam}
              onEvEbitdaScheduleChange={updateEvEbitdaSchedule}
              onReset={resetToDefaults}
            />
          </div>

          {/* Right Column - All Adjustable Parameters */}
          <div className="space-y-6">
            {/* Throughput-Yield Model */}
            <ThroughputModel
              params={params.throughput}
              financial={params.financial}
              result={throughputResult}
              constellationSchedule={constellationSchedule}
              onParamChange={updateThroughputParam}
              onScheduleChange={updateConstellationSchedule}
            />

            {/* User-Based Model */}
            <UserBasedModel
              params={params.userBased}
              financial={params.financial}
              result={userBasedResult}
              attachmentSchedule={attachmentSchedule}
              onParamChange={updateUserBasedParam}
              onScheduleChange={updateAttachmentSchedule}
            />
          </div>
        </div>

        {/* Key Assumptions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <h3 className="font-display font-semibold text-slate-800 mb-4">Key Assumptions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">1</span>
              </div>
              <p className="text-slate-600">
                <strong className="text-slate-800">50/50 Revenue Share</strong> with MNO partners
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">2</span>
              </div>
              <p className="text-slate-600">
                <strong className="text-slate-800">85% EBITDA Margin</strong> due to low CAC
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">3</span>
              </div>
              <p className="text-slate-600">
                <strong className="text-slate-800">3B Addressable Users</strong> via MNO partnerships
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">4</span>
              </div>
              <p className="text-slate-600">
                <strong className="text-slate-800">200 Satellites</strong> by 2030 full constellation
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">5</span>
              </div>
              <p className="text-slate-600">
                <strong className="text-slate-800">~$2B Net Debt</strong> for constellation financing
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">6</span>
              </div>
              <p className="text-slate-600">
                <strong className="text-slate-800">~273M Current Shares</strong> + expected dilution
              </p>
            </div>
          </div>

          {/* Additional Revenue Opportunities Not Yet Modeled */}
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">📈</span>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Additional Upside Not Yet Modeled</h4>
                <p className="text-sm text-green-700 mb-2">
                  This model does not yet account for potential revenue from:
                </p>
                <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                  <li><strong>Golden Dome</strong> - Defense/government contracts</li>
                  <li><strong>Space Applications</strong> - Satellite-to-satellite connectivity</li>
                  <li><strong>Naval & Ship Applications</strong> - Maritime connectivity solutions</li>
                  <li><strong>International FirstNet</strong> - First responder networks in Australia, Japan, and other countries</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Data Source Attribution */}
        <div className="text-center text-xs text-slate-400 mb-6">
          <p>Based on research from Code Red 1 - AST SpaceMobile</p>
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

