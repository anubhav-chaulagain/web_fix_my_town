'use client';
import Link from "next/link";
import Image from "next/image";
import { Icons } from "../constants";

import { usePathname } from "next/navigation";

const USER_LINKS = [
    { href: "/user/dashboard", label: "Dashboard", Icon: Icons.Dashboard},
    { href: "/user/reportIssue", label: "Report Issue", Icon: Icons.Report},
    { href: "/user/reports", label: "Reports", Icon: Icons.MyReports},
    { href: "/user/notification", label: "Notification", Icon: Icons.Notifications},
    { href: "/user/profile", label: "Profile", Icon: Icons.Profile},
]

export default function Sidebar() {
    const pathname = usePathname();
    return (
        <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto z-40">
            <div className="p-4">
                <Image src={"/logo.svg"} width={200} height={200} alt="Logo FixMyTown" />
            </div>
            <nav className="p-2 space-y-1">
                {
                    USER_LINKS.map(link=>(
                        <Link key={link.href} href={link.href}
                        className={`${link.href==pathname?"bg-gray-300":""} flex items-center hover:bg-gray-200 gap-3 px-3  py-2.5 rounded-lg text-sm`}>
                            <link.Icon/>
                            <span>{link.label}</span>
                        </Link>
                    ))
                }
            </nav>
            <p>{}</p>
        </aside>
    );
}