"use client";
import { useEffect, useState } from "react";
import { AvatarIcon } from "@radix-ui/react-icons";
import { client } from "@/utils/fetch-client";
import toast from "react-hot-toast";
import { User } from "@prisma/client";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Students() {
  const [students, setStudents] = useState<User[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents().catch((e) => toast.error("Could not fetch e-logs"));
  }, []);

  async function fetchStudents() {
    setLoading(true);
    try {
      const res = await client("/api/students");
      setStudents(res);
    } catch (error) {
      toast.error("Could not fetch students");
    }
    setLoading(false);
  }

  return (
    <main>
      {!loading && (students?.length || 0) < 1 && (
        <p className="text-xl text-center font-semibold my-5">
          No students found
        </p>
      )}
      {loading && (
        <div className="flex gap-5 justify-center text-slate-100">
          <Skeleton className="h-[100px] rounded-full" />
          <Skeleton className="h-[100px] rounded-full" />
        </div>
      )}
      <ul className="flex flex-wrap gap-8">
        {students?.map((student) => (
          <li key={student.id}>
            <Card className="p-4 w-[250px] grid gap-1 font-medium">
              <AvatarIcon className="w-16 h-16 text-blue-300 mb-3" />
              <p>
                <span className="text-slate-500 font-normal block">Email:</span>
                {student.email}
              </p>
              <p>
                <span className="text-slate-500 font-normal block">
                  Full name:{" "}
                </span>
                {student.firstName?.toLowerCase()}{" "}
                {student.lastName?.toLowerCase()}
              </p>
              <p>
                <span className="text-slate-500 font-normal block capitalize">
                  Username:{" "}
                </span>
                {student.username?.toLowerCase()}
              </p>
              <p>
                <span className="text-slate-500 font-normal block">
                  Enroll date:{" "}
                </span>
                {format(new Date(student.createdAt), "dd/mm/yyyy")}
              </p>
            </Card>
          </li>
        ))}
      </ul>
    </main>
  );
}
