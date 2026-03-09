import Image from "next/image";
import { useState } from "react";

export default function ImageCarousel({ images }: { images: string[] }) {
    const [current, setCurrent] = useState(0);
    const total = images.length;

    const prev = () => setCurrent((i) => (i - 1 + total) % total);
    const next = () => setCurrent((i) => (i + 1) % total);

    return (
        <div className="mb-6 space-y-3">
            <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden relative group">
                <Image
                    src={`http://localhost:5050${images[current]}`}
                    className="w-full h-full object-cover transition-all duration-300"
                    alt={`Issue photo ${current + 1}`}
                    width={690}
                    height={388}
                />

                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {current + 1} / {total}
                </div>

                {total > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}

                {total > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`rounded-full transition-all ${
                                    i === current
                                        ? 'w-4 h-1.5 bg-white'
                                        : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {total > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                i === current
                                    ? 'border-teal-500 opacity-100'
                                    : 'border-transparent opacity-50 hover:opacity-75'
                            }`}
                        >
                            <Image
                                src={`http://localhost:5050${img}`}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                                alt={`Thumbnail ${i + 1}`}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}