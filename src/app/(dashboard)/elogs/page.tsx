"use client";
import { getLocalUser } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { client } from "@/utils/fetch-client";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Elog } from "@prisma/client";
import { format, formatDistanceToNow } from "date-fns";
import { ElogFormDialog } from "@/components/ElogForm";

export default function Elogs() {
  const [open, setOpen] = useState<any>();
  const [user, setUser] = useState<any>();
  const [elogs, setElogs] = useState<Elog[]>();
  const [selectedLog, setSelectedLog] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = getLocalUser();
    setUser(user);
    fetchElogs().catch((e) => toast.error("Could not fetch e-logs"));
  }, []);

  async function fetchElogs() {
    setLoading(true);
    try {
      const res = await client("/api/elogs");
      setElogs(res);
    } catch (error) {
      toast.error("Could not fetch e-logs");
    }
    setLoading(false);
  }

  function editLog(id: string) {
    setSelectedLog(id);
    setOpen(true);
  }

  function toggleForm(open: boolean) {
    !open ? setSelectedLog(null) : null;
    setOpen(open);
  }
  return (
    <main className="w-full h-full">
      <section className="w-full py-2 px-4 relative h-full">
        <h2 className="text-xl font-semibold mb-4">Your E-logs</h2>
        {loading ? (
          <div className="flex flex-col justify-center text-slate-100 gap-5">
            <Skeleton className="h-[20px] rounded-full" />
            <Skeleton className="h-[20px] rounded-full" />
          </div>
        ) : (
          <ul className="grid gap-6">
            {(elogs?.length || 0) < 1 && (
              <p className="text-xl text-center font-semibold my-5">
                No e-logs found
              </p>
            )}
            {elogs?.map((elog) => (
              <li key={elog?.id}>
                <Card className="flex flex-col p-4 min-w-full max-w-xs shadow-none gap-2 relative min-h-[120px]">
                  <span className="flex items-center justify-between">
                    <p className="text-lg font-medium leading-none">
                      {elog?.title}
                    </p>
                    {user?.role === "STUDENT" && (
                      <button
                        className="text-orange-600 hover:text-orange-500"
                        onClick={() => editLog(elog.id)}
                      >
                        <Pencil1Icon className="w-5 h-5" />
                      </button>
                    )}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {elog?.content}
                  </p>

                  <div className="grid gap-1">
                    <p className="text-xs text-slate-500 flex gap-2 mt-5">
                      <span>Created on:</span>
                      <span className=" text-blue-500">
                        {format(new Date(elog.createdAt), "dd/MM/yyyy")}
                      </span>
                    </p>
                    <p className="text-xs text-slate-500 flex gap-2">
                      <span>Last updated:</span>
                      <span className=" text-blue-500">
                        {formatDistanceToNow(new Date(elog.updatedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </p>
                  </div>
                  {user?.role === "SUPERVISOR" && (
                    <p className="text-xs text-slate-500 flex gap-2">
                      <span>Created by:</span>
                      <span className=" text-blue-500">{elog.author}</span>
                    </p>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        )}
        {user?.role === "STUDENT" && (
          <div className="absolute bottom-1">
            <ElogFormDialog
              key={`${open}-elog-form`}
              elogId={selectedLog}
              open={open}
              setOpen={toggleForm}
              refetch={fetchElogs}
            />
          </div>
        )}
      </section>
    </main>
  );
}
