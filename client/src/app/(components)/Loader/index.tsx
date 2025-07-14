
import { LoaderCircle } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <LoaderCircle className="animate-spin text-blue-600 h-8 w-8" />
    </div>
  );
}
