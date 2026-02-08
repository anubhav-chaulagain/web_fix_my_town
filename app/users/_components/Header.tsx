import Image from "next/image";
import profileImg from "@/app/assets/garbage.png";

export default function Header() {
    return <div className="w-full flex items-center justify-end p-4 border-b border-gray-300">
        <ul className="flex items-center gap-4">
          <li className="text-slate-200">|</li>
            <li>
                <ul>
                    <li className="text-sm font-bold tracking-wide">Citizen Name</li>
                    <li className="text-[12px] tracking-wider text-slate-400">abc@example.com</li>
                </ul>
            </li>
          <li className="w-10 h-10 rounded-[20px] overflow-hidden">
            <Image src={profileImg} alt="Profile picture"/>
          </li>
        </ul>
      </div>
}