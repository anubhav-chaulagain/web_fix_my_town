'use client';
import Image from "next/image";
import profileImg from "@/app/assets/garbage.png";
import { useAuth } from "@/app/context/AuthContext";

export default function Header() {
    const { user } = useAuth();

    return (
        <div className="w-full flex items-center justify-end p-4 border-b border-gray-300">
            <ul className="flex items-center gap-4">
                <li className="text-slate-200">|</li>
                <li>
                    <ul>
                        <li className="text-sm font-bold tracking-wide">
                            {user?.fullname || 'Guest'}
                        </li>
                        <li className="text-[12px] tracking-wider text-slate-400">
                            {user?.email || ''}
                        </li>
                    </ul>
                </li>
                <li className="w-10 h-10 rounded-[20px] overflow-hidden">
                    {user?.profilePicture ? (
                        <Image
                            src={`http://localhost:5050${user.profilePicture}`}
                            alt="Profile picture"
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Image src={profileImg} alt="Profile picture" />
                    )}
                </li>
            </ul>
        </div>
    );
}