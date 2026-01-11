import { useRef, useState } from 'react';
import { useValuationModel } from './hooks/useValuationModel';
import { useCurrentStockPrice } from './hooks/useCurrentStockPrice';
import { getFullyDilutedShares } from './types';
import {
  ModelToggle,
  ThroughputModel,
  UserBasedModel,
  RevenueChart,
  StockPriceChart,
  ValuationSummary,
} from './components';

function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

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
    exportConfig,
    importConfig,
  } = useValuationModel();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportSuccess(false);

    try {
      await importConfig(file);
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Failed to import configuration');
      setTimeout(() => setImportError(null), 5000);
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Fetch current stock price
  const { currentPrice, isLive: isLivePrice, setManualPrice } = useCurrentStockPrice();

  // Calculate upside percentage
  const upside = currentPrice && currentPrice > 0
    ? ((activeResult.stockPrice - currentPrice) / currentPrice) * 100
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 sm:h-16 sm:py-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20 flex-shrink-0">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 7 9 3 5 7l4 4"/>
                  <path d="m17 11 4 4-4 4-4-4"/>
                  <path d="m8 12 4 4 6-6-4-4Z"/>
                  <path d="m16 8 3-3"/>
                  <path d="M9 21a6 6 0 0 0-6-6"/>
                </svg>
              </div>
              <div className="min-w-0">
                <h1 className="font-display font-bold text-lg sm:text-xl text-slate-800 truncate sm:whitespace-normal">
                  <span className="hidden sm:inline">ASTS Commercial Business Valuation Model</span>
                  <span className="sm:hidden">ASTS Valuation Model</span>
                </h1>
              </div>
            </div>

            <div className="flex-shrink-0">
              <ModelToggle activeModel={params.activeModel} onChange={setActiveModel} />
            </div>
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
          <div className="text-sm text-slate-600">
            This app is based on info from various sources including the notes from{' '}
            <a
              href="https://x.com/thekookreport"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline font-medium"
            >
              @TheKookreport
            </a>
            ,{' '}
            <a
              href="https://x.com/spacanpanman"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline font-medium"
            >
              @spacanpanman
            </a>
            {' '}and space mob community.{' '}
            We built a ASTS interactive model for you to see how various combinations can make the projected valuations.{' '}
            <strong>Throughput-Yield</strong> (satellites × capacity × price) and{' '}
            <strong>User-Based</strong> (subscribers × attach rate × ARPU).{' '}
            This model is developed by{' '}
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
            {' '}for educational purposes; this is not financial advice.{' '}
            Feel free to contact on X to provide feedback.
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
              isLivePrice={isLivePrice}
              onManualPriceChange={setManualPrice}
              fullyDilutedShares={getFullyDilutedShares(params.financial)}
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

        {/* Save/Load Configuration */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-semibold text-slate-800">Save & Load Configuration</h3>
              <p className="text-sm text-slate-500 mt-1">Download your parameters as JSON or upload a previously saved configuration</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Load Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload JSON
              </button>

              {/* Download Button */}
              <button
                onClick={exportConfig}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download JSON
              </button>
            </div>
          </div>

          {/* Success/Error Messages */}
          {importSuccess && (
            <div className="mt-3 px-4 py-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Configuration loaded successfully!
            </div>
          )}
          {importError && (
            <div className="mt-3 px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {importError}
            </div>
          )}
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
                <strong className="text-slate-800">2026 Attachment Rate is 1%</strong> because there will be a beta and retail ramp phase will be the last quarter 2026. Followed by faster ramp in 2027.
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
                <strong className="text-slate-800">~$2B Net Debt</strong> for constellation financing
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
                  <li><strong>Defense contracts</strong> - Government/military satellite communications</li>
                  <li><strong>Non-communications Space Applications</strong> - e.g., PNT</li>
                  <li><strong>Naval & Ship Applications</strong> - Maritime connectivity solutions</li>
                  <li><strong>International First Responder Networks</strong> - e.g., Australia, Japan, and other countries</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </main>

    </div>
  );
}

export default App;

