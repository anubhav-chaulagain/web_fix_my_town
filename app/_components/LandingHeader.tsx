import Image from "next/image";
import Link from "next/link";

export default function LandingHeader() {
    return <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4 border-b border-gray-300">
        <div>
          <Image src={"/logo.svg"} width={200} height={200} alt="Logo FixMyTown" />
        </div>
        <ul className="flex items-center gap-8">
          <li className="text-slate-600">How it works</li>
          <li className="text-slate-600">Public Reports</li>
          <li className="text-slate-600">About Us</li>
          <li className="text-slate-200">|</li>
          <li className="text-slate-600"><Link href={"/login"}>Sign In</Link></li>
          <li><button className="form-btn px-6 h-9">Get Started</button></li>
        </ul>
      </div>
}