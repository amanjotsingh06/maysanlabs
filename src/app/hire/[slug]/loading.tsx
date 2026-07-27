import { Skeleton } from "@/components/ui/Skeleton";

export default function HireLoading() {
  return (
    <main id="main-content" className="pt-32">
      <div className="container-main max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <Skeleton className="h-6 w-40 mx-auto mb-6" />
        <Skeleton className="h-12 w-full max-w-2xl mx-auto mb-4" />
        <Skeleton className="h-6 w-3/4 mx-auto mb-8" />
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Skeleton className="h-12 w-40 rounded-lg" />
          <Skeleton className="h-12 w-40 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    </main>
  );
}
