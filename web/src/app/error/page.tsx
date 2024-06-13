"use client"
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react';

export default function Page() {
    const params = useSearchParams()

    const search = params.get('message')

    useEffect(() => {
        console.log(params)
    }, [params])
    
    return (
        <main className="relative w-screen h-screen text-4xl font-bold text-white bg-zinc-900 rounded-md flex flex-col gap-5 items-center justify-center">
            <span className="">
                Error: {search}
            </span>

            <a href="/">
                <span className="text-red-300 cursor-pointer"> Return </span>
            </a>
        </main>
    );
}