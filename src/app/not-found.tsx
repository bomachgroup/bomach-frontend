import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="font-display text-6xl md:text-8xl font-black text-secondary-950 mb-4">404</h1>
      <p className="text-xl text-secondary-600 mb-8">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="btn-primary"
      >
        Back to Home
      </Link>
    </div>
  );
}
