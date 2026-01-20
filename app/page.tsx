import Image from "next/image";

export default function RootPage() {
  return (
    <div className="relative w-screen h-screen overflow-y-hidden">
    <div className="absolute top-0 left-0 w-full -z-10 overflow-hidden"> 
        <Image
          className="w-full h-auto" 
          src="/landing_bg.svg"
          alt="My Icon"
          layout="responsive" 
          width={500} 
          height={250} 
        />
      </div>

      <main className="w-full p-20">
        <section className="w-80 flex flex-col"  >
          <Image
          className="w-full mb-6" 
          src="/logo.svg"
          alt="My Icon"
          layout="responsive" 
          width={500} 
          height={100} 
        />
        <span className="w-full whitespace-nowrap text-white text-6xl">Report Resolve</span>
        <span className="w-full whitespace-nowrap text-white text-6xl"><span className="text-7xl">&</span> Revive</span>
        </section>
        <section className="w-full justify-between flex flex-row items-center">
          <div>
            <button className="form-btn">Get Started</button>
            <button>Login</button>
          </div>
          <Image src={"/images/pana.png"} alt="Sitting at the desk" width={310} height={310}/>
        </section >
      </main>

    </ div>
    
  );
}

 