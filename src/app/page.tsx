import Header from '@/components/layout/Header/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#03071a] via-[#0f1a2e] to-[#1a2a4a]">
      <Header />
      <main className="pt-32 px-8">
        <div className="container mx-auto text-center">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] bg-clip-text text-transparent mb-8">
            Welcome to HRS Technologies
          </h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto mb-12">
            Global Enterprise Solutions for Human Resources Management
          </p>
          
          {/* Additional content with new color scheme */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            <div className="bg-gradient-to-br from-[#3c959d]/10 to-[#ef7335]/10 border border-[#3c959d]/20 rounded-xl p-6 hover:border-[#3c959d]/40 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-[#3c959d] to-[#4ba5ad] rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#3c959d] mb-2">HR Management</h3>
              <p className="text-slate-300">Comprehensive human resources solutions for modern enterprises.</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#ef7335]/10 to-[#3c959d]/10 border border-[#ef7335]/20 rounded-xl p-6 hover:border-[#ef7335]/40 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-[#ef7335] to-[#f0854a] rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#ef7335] mb-2">Analytics</h3>
              <p className="text-slate-300">Advanced analytics and reporting for data-driven decisions.</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#3c959d]/10 to-[#ef7335]/10 border border-[#3c959d]/20 rounded-xl p-6 hover:border-[#3c959d]/40 transition-all duration-300 md:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-gradient-to-r from-[#3c959d] to-[#ef7335] rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#3c959d] mb-2">Performance</h3>
              <p className="text-slate-300">Optimize performance and productivity across your organization.</p>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="mt-16">
            <button className="bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] hover:from-[#2d7a82] hover:via-[#3c959d] hover:to-[#e05a2b] text-white font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-12 py-4 rounded-lg text-lg">
              Explore Our Solutions
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
