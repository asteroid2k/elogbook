import Login from "@/components/Login";
import Image from "next/image";
import logo from "../../public/atu.png";

export default function Home() {
  return (
    <main className="grid place-items-center min-h-screen w-full">
      <div className="w-full flex flex-col items-center">
        <Image src={logo} width="80" height="60" alt="atu" className="mb-3" />

        <a className="text-sm text-blue-500 my-3 font-light" href="/register">
          Don&apos;t have an account? Sign up
        </a>
        <Login />
      </div>
    </main>
  );
}
