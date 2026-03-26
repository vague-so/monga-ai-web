import { Link } from "react-router";

export function Welcome({ message }: { message: string }) {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <div className="max-w-[300px] w-full space-y-6 px-4">
          <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
            <Link
              className="inline-flex items-center gap-2 self-stretch p-3 leading-normal text-blue-700 hover:underline dark:text-blue-500"
              to="/playground"
            >
              Playground
            </Link>
          </nav>
        </div>
      </div>
    </main>
  );
}
