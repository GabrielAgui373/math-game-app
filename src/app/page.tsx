"use client";

import { useRouter } from "next/navigation";
import Button from "./components/Button/Button";

export default function InitPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col flex-1  items-center justify-center">
      <Button onClick={() => router.push("/start")}>Play Solo</Button>
    </div>
  );
}
