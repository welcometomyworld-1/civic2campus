import React from 'react';
import {
  Users,
  MapPin,
  GraduationCap,
  Building,
  CheckCircle2,
  HeartHandshake,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ImpactSection: React.FC = () => {
  const { setCurrentView } = useApp();

  const metrics = [
    {
      value: '2,840',
      label: 'Citizens with reliable water access',
      subtext: 'Toto Panchayat, Gumla Cluster',
      icon: Users,
    },
    {
      value: '18',
      label: 'Villages reached with IoT pilots',
      subtext: 'Across 6 rural districts',
      icon: MapPin,
    },
    {
      value: '47',
      label: 'Student teams solving real problems',
      subtext: '42 universities participating',
      icon: GraduationCap,
    },
    {
      value: '23',
      label: 'Industry partners funding hardware',
      subtext: '₹18.4 Cr committed CSR',
      icon: Building,
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#F9F8F6] border-b border-stone-200/80 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-px w-8 bg-blue-600 inline-block"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Section 13 • Measurable Impact
            </span>
            <span className="h-px w-8 bg-blue-600 inline-block"></span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-stone-900 leading-[1.05]">
            Technology is only useful <br />
            <span className="font-bold italic text-blue-600">when people feel the difference.</span>
          </h2>

          <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto mt-4 font-normal leading-relaxed">
            Every metric represents families who no longer walk 4 kilometers for clean water, farmers with preserved harvests, and students building their careers around purpose.
          </p>
        </div>

        {/* 4 Impact Stat Cards with Semantic H3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-4xl sm:text-5xl font-light text-stone-900 tracking-tight mb-2">
                    {m.value}
                  </div>
                  {/* Semantic H3 Heading fixing H2->H4 skip */}
                  <h3 className="text-sm font-bold text-stone-900 tracking-tight">
                    {m.label}
                  </h3>
                </div>

                <div className="mt-6 pt-3 border-t border-stone-100 text-xs text-stone-500">
                  {m.subtext}
                </div>
              </div>
            );
          })}
        </div>

        {/* Community Testimonial & Case Study Feature */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 shadow-lg max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 relative rounded-xl overflow-hidden shadow-md">
            <img
              src="https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80"
              alt="Community Water Solution"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-xs font-bold uppercase tracking-wider">
                Toto Village, Gumla • Solar Hydro Pilot
              </span>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              <span>Community Ground Truth</span>
            </div>
            
            <blockquote className="text-lg sm:text-xl font-serif-display italic text-stone-900 leading-relaxed">
              "For three months, our women and children walked through muddy trails twice a day for dirty pond water. When the BIT Mesra team arrived with the solar sensors, they fixed the pump in 48 hours. Now we have clean water at our doorstep."
            </blockquote>

            <div className="pt-2 text-xs font-bold text-stone-900">
              — Sunita Oraon, Panchayat Head, Toto Ward 4, Gumla District
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
