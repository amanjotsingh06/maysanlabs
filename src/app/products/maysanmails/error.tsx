"use client";

export default function ServiceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void error;
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center p-8">
        <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
        <p className="text-sm text-foreground/50 mb-4">Failed to load this page.</p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
