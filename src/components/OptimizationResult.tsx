import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ProductData } from '../types';

interface OptimizationResultProps {
  data: ProductData;
}

export function OptimizationResult({ data }: OptimizationResultProps) {
  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-3 text-green-600 mb-6">
        <CheckCircle2 className="w-6 h-6" />
        <h2 className="text-2xl font-semibold">Optimization Complete!</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Original Listing</h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-slate-600 mb-2">Title</h4>
              <p className="text-slate-800">{data.original_title}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-600 mb-2">Bullet Points</h4>
              <ul className="space-y-2">
                {data.original_bullets.map((bullet, index) => (
                  <li key={index} className="text-slate-700 text-sm flex gap-2">
                    <span className="text-slate-400">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-600 mb-2">Description</h4>
              <p className="text-slate-700 text-sm">{data.original_description}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border-2 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">Optimized Listing</h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-blue-600 mb-2">Title</h4>
              <p className="text-slate-800 font-medium">{data.optimized_title}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-blue-600 mb-2">Bullet Points</h4>
              <ul className="space-y-2">
                {data.optimized_bullets.map((bullet, index) => (
                  <li key={index} className="text-slate-700 text-sm flex gap-2">
                    <span className="text-blue-400">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-blue-600 mb-2">Description</h4>
              <p className="text-slate-700 text-sm">{data.optimized_description}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-blue-600 mb-2">Suggested Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {data.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
