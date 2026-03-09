"use client";
import { useAuth } from "@/app/context/AuthContext";
import { AdminDashboard } from "@/app/admin/_components/AdminDashboard";


export default function Page() {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="mt-8 space-y-4 animate-pulse">
                <div className="h-8 bg-slate-200 rounded w-1/3" />
                <div className="grid grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-slate-100 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return <AdminDashboard />;
}