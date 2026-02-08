import Link from "next/link";
import Image from "next/image";

const USER_LINKS = [
    { href: "/user/dashboard", label: "Dashboard"},
    { href: "/user/report", label: "Report Issue"},
    { href: "/user/reports", label: "Reports"},
    { href: "/user/notification", label: "Notification"},
    { href: "/user/profile", label: "Profile"},
]

export default function Sidebar() {
    return (
        <aside className="fixed md:static top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
                <Image src={"/logo.svg"} width={200} height={200} alt="Logo FixMyTown" />
            </div>
            <nav className="p-2 space-y-1">
                {
                    USER_LINKS.map(link=>(
                        <Link key={link.href} href={link.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm">
                            {link.label}
                        </Link>
                    ))
                }
            </nav>
        </aside>
    );
}