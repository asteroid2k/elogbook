import Register from "@/components/Register";
import Image from "next/image";
import logo from "../../../public/atu.png";

export default function Home() {
  return (
    <main className="grid place-items-center min-h-screen w-full">
      <div className="w-full flex flex-col items-center gap-5">
        <Image src={logo} width="80" height="60" alt="atu" />
        <Register />
      </div>
    </main>
  );
}
