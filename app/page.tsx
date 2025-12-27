import Image from "next/image";

export default function RootPage() {
  return (
    <>
    <div className="w-full h-26 absolute top-0 z-[-1]"> 
        <Image
          className="w-full h-auto" 
          src="/landing_bg.svg"
          alt="My Icon"
          layout="responsive" 
          width={500} 
          height={250} 
        />
      </div>

      <main className="w-full m-20">
        <div className="w-80 flex flex-col"  >
          <Image
          className="w-full h-auto mb-6" 
          src="/logo.svg"
          alt="My Icon"
          layout="responsive" 
          width={500} 
          height={250} 
        />
        <span className="w-full whitespace-nowrap text-white text-6xl mb-1">Report Resolve</span>
        <span className="w-full whitespace-nowrap text-white text-6xl"><span className="text-7xl">&</span> Revive</span>
        </div>
        <div></div>
      </main>

    </>
    
  );
}

 