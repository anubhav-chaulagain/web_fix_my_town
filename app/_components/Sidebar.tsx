'use client';
import Link from "next/link";
import { Icons } from "../user/constants";

import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

const USER_LINKS = [
    { href: "/user/dashboard", label: "Dashboard", Icon: Icons.Dashboard},
    { href: "/user/reportIssue", label: "Report Issue", Icon: Icons.Report},
    { href: "/user/reports", label: "Reports", Icon: Icons.MyReports},
    { href: "/user/profile", label: "Profile", Icon: Icons.Profile},
]

const ADMIN_LINKS = [
    { href: "/admin/dashboard",   label: "Dashboard",    Icon: Icons.Dashboard  },
    { href: "/admin/users",       label: "Users",  Icon: Icons.Profile    },
    { href: "/admin/issues",     label: "Issues",      Icon: Icons.MyReports  },
    { href: "/admin/profile",     label: "Profile",      Icon: Icons.Profile    },
];

export default function Sidebar() {
    const { user } = useAuth();
    const pathname = usePathname();
    const isAdmin = user?.role === "admin";
    const isAuthority = user?.role === "authority";

    const visibleLinks = USER_LINKS.filter(link =>
        !(link.href === "/user/reportIssue" && user?.role === "authority")
    );

    const adminLinks = isAdmin
        ? ADMIN_LINKS
        : USER_LINKS.filter(link =>
            !(link.href === "/user/reportIssue" && isAuthority)
          );
    
    const links = isAdmin ? adminLinks : visibleLinks;

    return (
        <aside className="fixed top-0 left-0 h-screen w-64 bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 overflow-y-auto z-40 shadow-2xl">
    {/* Logo Section */}
    <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/50">
                <span className="text-white font-bold text-xl">F</span>
            </div>
            <div>
                <h1 className="text-white font-bold text-lg">FixMyTown</h1>
                <p className="text-slate-400 text-xs">Report & Track Issues</p>
            </div>
        </div>
    </div>

    {/* Navigation Links */}
    <nav className="p-4 space-y-2">
        {links.map(link => {
            const isActive = link.href === pathname;
            return (
                <Link 
                    key={link.href} 
                    href={link.href}
                    className={`
                        group flex items-center gap-3 px-4 py-3 rounded-xl
                        transition-all duration-200 ease-in-out
                        ${isActive 
                            ? 'bg-linear-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/50' 
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }
                    `}
                >
                    <div className={`
                        transition-transform duration-200 w-5 h-5
                        ${isActive ? 'scale-110' : 'group-hover:scale-110'}
                    `}>
                        <link.Icon />
                    </div>
                    <span className="font-medium text-sm">{link.label}</span>
                    {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    )}
                </Link>
            );
        })}
    </nav>

    {/* Bottom Section (Optional) */}
    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-3 py-2 text-slate-400 text-xs">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            <span>System Online</span>
        </div>
    </div>
</aside>
    );
}