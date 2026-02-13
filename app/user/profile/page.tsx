"use client"
import Image from "next/image";
import {Card, Input, Button } from "../_components/Shared";
import { useAuth } from "@/app/context/AuthContext";
import { HelpCircle } from "lucide-react";

export default function Page() {
    const { user, logout } = useAuth();
    // const imageUrl = user?.profilePicture?`http://localhost:5050/uploads/${user?.profilePicture}`:"/images/garbage.png";
    console.log(user)
    return (
        <section className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto mt-8 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Your Profile</h2>
              <p className="text-slate-500 mt-1">Manage your personal information and application preferences.</p>
          </div>
            <Card>
              <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-8 mb-8 pb-8 border-b border-slate-100">
            <div className="relative group">
              <Image src={"/images/garbage.png"} width={150} height={150} className="rounded-full border-4 border-teal-50 shadow-md" alt="Profile Picture" />
              <button className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg border border-slate-200 hover:text-teal-600 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                 </svg>
              </button>
            </div>
            <div className="text-center sm:text-left pt-4">
              <h3 className="text-2xl font-bold text-slate-800">{user?.name}</h3>
              <p className="text-slate-500">{user?.email}</p>
              <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full border border-teal-100 uppercase tracking-wider">{user?.role}</span>
                {/* <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200 uppercase tracking-wider">Account ID: #FMT-49201</span> */}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Full Name" value={user?.fullname} isDisabled={false}/>
            <Input label="Email Address" value={user?.email} isDisabled={true} />
            
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 flex justify-between items-center">
             <div className="flex sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 cursor-pointer">
                  <HelpCircle size={18} className="" />
                  < span>Forgot Password</span>
                </div>
                <button onClick={logout} className="text-rose-600 font-bold text-sm hover:underline cursor-pointer">Log out from all devices</button>
             </div>
             
             <div className="flex space-x-3">
               <Button variant="outline">Discard Changes</Button>
               <Button>Save Settings</Button>
             </div>
          </div>
            </Card>
        </section>
    );
}