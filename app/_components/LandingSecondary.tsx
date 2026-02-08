export default function LandingSecondary() {
    return (
        <section className="max-w-7xl mx-auto min-h-screen flex items-center  px-8 lg:px-16">
        <div className="px-6 text-center">
           <h2 className="text-4xl font-extrabold mb-4">Empowering Communities</h2>
           <p className="text-slate-500 max-w-2xl mx-auto text-lg mb-20">We provide the tools for efficient communication between residents and municipal departments.</p>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             <div className="space-y-4">
               <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                 </svg>
               </div>
               <h3 className="text-xl font-bold text-slate-900">Instant Reporting</h3>
               <p className="text-slate-500">Snap a photo, add a location, and submit. No more waiting on phone lines or filling out paper forms.</p>
             </div>
             <div className="space-y-4">
               <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                 </svg>
               </div>
               <h3 className="text-xl font-bold text-slate-900">Transparency</h3>
               <p className="text-slate-500">Track your report status in real-time. See exactly when an officer is assigned and when the job is done.</p>
             </div>
             <div className="space-y-4">
               <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                 </svg>
               </div>
               <h3 className="text-xl font-bold text-slate-900">Accountability</h3>
               <p className="text-slate-500">Public data encourages local governments to act faster and manage resources more effectively.</p>
             </div>
           </div>
        </div>
      </section>
    );
}