import Register from "@/components/Register";
import { BookmarkFilledIcon } from "@radix-ui/react-icons";

export default function Home() {
  return (
    <main className="grid place-items-center min-h-screen w-full">
      <div className="w-full flex flex-col items-center">
        <BookmarkFilledIcon className="w-16 h-16 mx-auto mb-5" />
        <Register />
      </div>
    </main>
  );
}
