import Image from "next/image";
import Link from "next/link";

export default function LandingMain() {
    return (
        <section className="max-w-7xl mx-auto h-[calc(100vh-85px)] flex items-center px-8 lg:px-16">
                <div className="flex justify-between items-center w-full gap-12">   
                  <ul className="flex-1 space-y-12">
                    <div>
                      <li className="text-6xl font-bold">Make your town</li>
                      <li className="text-6xl font-bold"><span className="text-(--primary-color)">better</span>, together.</li>
                    </div>
                    <li className="text-slate-500 tracking-wider leading-relaxed max-w-xl">The professional bridge between citizens and city authorities. Report local issues in seconds and watch your community transform.</li>
                    <li className="flex gap-6">
                      <Link href={"/signup"} className="bg-(--primary-color) text-lg text-white px-5 py-4 rounded-lg">Join the Platform</Link>
                      <Link href={"/login"} className="text-slate-600 border border-slate-400 text-lg px-5 py-4 rounded-lg">Access Your Account</Link>
                    </li>
                  </ul>
                  <div className="rounded-3xl overflow-hidden">
                    <Image src={"/images/garbage.png"} width={450} height={450} alt="Garbage Image"/>
                  </div>
                </div>
              </section>
    );
}