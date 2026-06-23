import type { PrintableDoc } from "../../services/printableService";

export function PrintableView({ doc, onBack }: { doc: PrintableDoc; onBack: () => void }) {
  return (
    <div>
      <div className="mb-4 flex gap-2 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white"
        >
          Print / Save as PDF
        </button>
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          Back
        </button>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow print:shadow-none">
        <h2 className="text-xl font-bold text-slate-800">{doc.title}</h2>
        {doc.subtitle && <p className="text-sm text-slate-500">{doc.subtitle}</p>}

        {doc.sections.map((section, index) => (
          <div key={index} className="mt-4">
            {section.heading && <h3 className="font-semibold text-slate-700">{section.heading}</h3>}
            <ul className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {section.items.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
