'use client';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/learn');
  }, [router]);

  return (
    <div>
      {/* Aqui você pode adicionar conteúdo ou manter vazio */}
    </div>
  );
}
