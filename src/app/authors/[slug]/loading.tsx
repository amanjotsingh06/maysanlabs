import { Skeleton } from "@/components/ui/Skeleton";

export default function AuthorLoading() {
  return (
    <main id="main-content" className="pt-32">
      <div className="container-main">
        <Skeleton className="h-4 w-24 mb-6" />
        <div className="flex items-center gap-5 mb-8">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div>
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-5 w-full max-w-2xl mb-10" />
        <Skeleton className="h-4 w-32 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
        </div>
      </div>
    </main>
  );
}
