import { Link } from 'react-router-dom'
import { ShieldCheck, Search, UserCheck, FileCheck, TrendingUp, Lock, Clock } from 'lucide-react'

function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-navy-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-saffron-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <ShieldCheck size={14} /> Trusted Government Scheme Discovery
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-5">
            Find Government Schemes<br className="hidden sm:block" /> You're Eligible For
          </h1>
          <p className="text-navy-100/80 text-base sm:text-lg max-w-xl mx-auto mb-9">
            Discover government benefits and schemes tailored to your profile — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/signup"
              className="w-full sm:w-auto text-center bg-saffron-500 hover:bg-saffron-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-saffron-500/20 transition-colors"
            >
              Check Your Eligibility
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto text-center bg-white/10 hover:bg-white/15 text-white font-medium px-6 py-3 rounded-lg border border-white/20 transition-colors"
            >
              Explore Schemes
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 text-center mb-3">How It Works</h2>
        <p className="text-gray-500 text-center mb-12 max-w-md mx-auto">
          Four simple steps between you and the benefits you qualify for.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: UserCheck, title: 'Your Profile', desc: 'Tell us about your age, income, and background.' },
            { icon: Search, title: 'Eligibility Check', desc: 'We match your profile against every scheme.' },
            { icon: FileCheck, title: 'Matching Schemes', desc: 'See exactly which schemes you qualify for.' },
            { icon: TrendingUp, title: 'Apply & Benefit', desc: 'Follow document checklists and apply with confidence.' },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="relative">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 h-full shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-navy-50 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-navy-700" />
                </div>
                <h3 className="font-semibold text-navy-950 mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
              {i < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Why Scheme Saathi */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 text-center mb-12">Why Scheme Saathi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: Lock, title: 'Secure & Private', desc: 'Your profile data is protected and never shared without consent.' },
              { icon: Clock, title: 'Saves Time', desc: 'No more digging through dozens of scheme websites manually.' },
              { icon: ShieldCheck, title: 'Rule-Based Accuracy', desc: 'Every match is checked against real eligibility criteria.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center sm:text-left">
                <div className="w-10 h-10 rounded-lg bg-navy-900 flex items-center justify-center mb-4 mx-auto sm:mx-0">
                  <Icon size={18} className="text-saffron-400" />
                </div>
                <h3 className="font-semibold text-navy-950 mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16 sm:py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 mb-3">Ready to find your schemes?</h2>
        <p className="text-gray-500 mb-8">Create a free account and check your eligibility in minutes.</p>
        <Link
          to="/signup"
          className="inline-block bg-navy-900 hover:bg-navy-800 text-white font-semibold px-7 py-3 rounded-lg transition-colors"
        >
          Get Started
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-semibold text-navy-900">
            <ShieldCheck size={16} className="text-saffron-500" /> Scheme Saathi
          </div>
          <p className="text-xs text-gray-400">© 2026 Scheme Saathi. Built as a learning project.</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing