export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
             <div className="col-span-2 space-y-6">
               <div className="flex items-center space-x-3 text-white">
                 <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center font-black">F</div>
                 <span className="text-xl font-bold">FixMyTown</span>
               </div>
               <p className="max-w-xs text-sm leading-relaxed">FixMyTown is a technology platform designed to empower citizens and improve urban management through transparent reporting and digital cooperation.</p>
             </div>
             <div className="space-y-4">
               <h4 className="text-white font-bold">Platform</h4>
               <ul className="space-y-2 text-sm">
                 <li><a href="" className="hover:text-teal-400">For Citizens</a></li>
                 <li><a href="" className="hover:text-teal-400">For Authorities</a></li>
                 <li><a href="" className="hover:text-teal-400">Pricing</a></li>
                 <li><a href="" className="hover:text-teal-400">Case Studies</a></li>
               </ul>
             </div>
             <div className="space-y-4">
               <h4 className="text-white font-bold">Legal</h4>
               <ul className="space-y-2 text-sm">
                 <li><a href="" className="hover:text-teal-400">Privacy Policy</a></li>
                 <li><a href="" className="hover:text-teal-400">Terms of Service</a></li>
                 <li><a href="" className="hover:text-teal-400">Cookie Policy</a></li>
                 <li><a href="" className="hover:text-teal-400">GDPR Compliance</a></li>
               </ul>
             </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex justify-between items-center text-xs">
            <p>© 2026 FixMyTown Inc. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="" className="hover:text-white">Twitter</a>
              <a href="" className="hover:text-white">LinkedIn</a>
              <a href="" className="hover:text-white">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    );
}