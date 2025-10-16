import React from 'react';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { OptimizationHistory } from '../types';

interface HistoryViewProps {
  history: OptimizationHistory[];
}

export function HistoryView({ history }: HistoryViewProps) {
  const [expandedId, setExpandedId] = React.useState<number | null>(null);

  if (history.length === 0) {
    return (
      <div className="mt-8 bg-slate-50 rounded-lg p-8 text-center">
        <Clock className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-600">No optimization history for this ASIN yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Optimization History
      </h3>

      <div className="space-y-3">
        {history.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <button
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-slate-800">{item.optimized_title}</p>
                <p className="text-sm text-slate-500 mt-1">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
              {expandedId === item.id ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {expandedId === item.id && (
              <div className="px-6 pb-6 border-t border-slate-100">
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Original</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-slate-600">Title:</span>
                        <p className="text-slate-700 mt-1">{item.original_title}</p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-600">Bullets:</span>
                        <ul className="mt-1 space-y-1">
                          {item.original_bullets.map((bullet, i) => (
                            <li key={i} className="text-slate-700">• {bullet}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-blue-700 mb-3">Optimized</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-blue-600">Title:</span>
                        <p className="text-slate-700 mt-1">{item.optimized_title}</p>
                      </div>
                      <div>
                        <span className="font-medium text-blue-600">Bullets:</span>
                        <ul className="mt-1 space-y-1">
                          {item.optimized_bullets.map((bullet, i) => (
                            <li key={i} className="text-slate-700">• {bullet}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium text-blue-600">Keywords:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {item.keywords.map((keyword, i) => (
                            <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
