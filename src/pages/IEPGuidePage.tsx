import { ParentLayout } from "../components/parent/ParentLayout";
import { IEP_OVERVIEW, IEP_STRATEGIES, STRUGGLE_GUIDE, HOME_PRACTICE_IDEAS } from "../data/iepGuide";

export default function IEPGuidePage() {
  return (
    <ParentLayout>
      <div className="mx-auto max-w-3xl p-4">
        <div className="mb-4 flex items-center justify-between print:hidden">
          <h1 className="text-2xl font-bold text-slate-800">Working With Him</h1>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Print / Save as PDF
          </button>
        </div>

        <p className="mb-6 rounded-2xl bg-white p-4 text-sm text-slate-600 shadow">{IEP_OVERVIEW}</p>

        <h2 className="mb-2 text-lg font-bold text-slate-700">Core Strategies</h2>
        <div className="flex flex-col gap-3">
          {IEP_STRATEGIES.map((strategy) => (
            <div key={strategy.id} className="rounded-2xl bg-white p-4 shadow">
              <h3 className="font-semibold text-slate-800">{strategy.title}</h3>
              <p className="mt-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Why: </span>
                {strategy.why}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-700">How: </span>
                {strategy.how}
              </p>
              <p className="mt-2 rounded-xl bg-orange-50 p-2 text-sm text-orange-800">
                <span className="font-semibold">In Kinder Quest: </span>
                {strategy.inApp}
              </p>
            </div>
          ))}
        </div>

        <h2 className="mt-6 mb-2 text-lg font-bold text-slate-700">When He's Struggling</h2>
        <div className="overflow-hidden rounded-2xl bg-white shadow">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-3 font-semibold text-slate-600">If you see…</th>
                <th className="p-3 font-semibold text-slate-600">Try this</th>
              </tr>
            </thead>
            <tbody>
              {STRUGGLE_GUIDE.map((row) => (
                <tr key={row.sign} className="border-t border-slate-100">
                  <td className="p-3 text-slate-700">{row.sign}</td>
                  <td className="p-3 text-slate-600">{row.tryThis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-6 mb-2 text-lg font-bold text-slate-700">Try This Outside the App</h2>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {HOME_PRACTICE_IDEAS.map((idea) => (
            <li key={idea} className="rounded-xl bg-white p-3 text-sm text-slate-700 shadow">
              {idea}
            </li>
          ))}
        </ul>
      </div>
    </ParentLayout>
  );
}
