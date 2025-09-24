"use client";

type NotFoundViewProps = {
  title: string;
  message: string;
  href: string;
  linkText: string;
};

export default function NotFoundView({ title, message, href, linkText }: NotFoundViewProps) {
  return (
    <section className="relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[110%] -translate-x-1/2 rounded-[100%] bg-gradient-to-r from-[#3c959d]/10 via-[#4ba5ad]/10 to-[#ef7335]/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1 text-center md:text-left">
            <p className="mb-3 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">Error 404</p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h1>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              {message}
            </p>

            <div className="mt-8 flex items-center justify-center md:justify-start gap-3">
              <a href={href} className="inline-flex items-center rounded-md bg-[#3c959d] px-5 py-2.5 text-white font-semibold shadow-sm hover:bg-[#35868d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3c959d] transition-colors">
                {linkText}
              </a>
              <a href="#" className="text-[#3c959d] hover:text-[#2e747a] font-medium underline-offset-4 hover:underline transition-colors">
                Contact support
              </a>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="relative mx-auto w-full max-w-md aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 300 160" className="h-40 text-slate-300 dark:text-slate-600">
                  <defs>
                    <linearGradient id="g" x1="0" x2="1">
                      <stop offset="0%" stopColor="#3c959d" />
                      <stop offset="100%" stopColor="#ef7335" />
                    </linearGradient>
                  </defs>
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="96" fontWeight="800" fill="url(#g)">404</text>
                </svg>
              </div>
              <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-[#4ba5ad]/20 blur-2xl" />
              <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-[#ef7335]/20 blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


