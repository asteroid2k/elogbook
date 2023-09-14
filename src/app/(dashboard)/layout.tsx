"use client";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearLocal, getLocalUser } from "@/utils/helpers";
import {
  ChevronDownIcon,
  ClipboardIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import logo from "../../../public/atu.png";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const links = [
    { href: "/elogs", name: "E-logs", icon: <ClipboardIcon /> },
    { href: "/students", name: "Students", icon: <PersonIcon /> },
  ];
  const [user, setUser] = useState<any>();
  const route = usePathname();
  const router = useRouter();

  useEffect(() => {
    const user = getLocalUser();
    if (!user) {
      logout();
    }
    setUser(user);
  }, []);

  function logout() {
    clearLocal();
    Cookies.remove("elogbook_token");
    router.push("/");
  }
  return (
    <main className="flex justify-between min-h-screen lg:mx-8 xl:mx-12 py-5 max-w-[1400px] mx-auto">
      <div className="w-full max-w-[240px]">
        <Card className="shadow-none py-4 px-4 flex flex-col space-y-6">
          <div>
            <Image
              src={logo}
              width="40"
              height="30"
              alt="atu"
              className="mx-auto"
            />
            <p className="text-center my-2 font-semibold">
              ATU Attachment system
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-2 w-full justify-between font-medium px-2 text-blue-700">
                <span>{user?.username?.toLowerCase()}</span>
                <ChevronDownIcon />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ul className="grid gap-2">
            {links.map((link) => (
              <li
                key={link.name}
                className={cn(
                  "px-3 py-2 font-semibold rounded flex items-center gap-4",
                  route.split("/")[1] === link.href.replace("/", "")
                    ? "bg-blue-500 text-white ring-2 ring-blue-300"
                    : "hover:bg-blue-100"
                )}
              >
                {link.icon}
                <Link href={link.href}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <div className="w-full max-w-4xl mt-3">{children}</div>
    </main>
  );
}
