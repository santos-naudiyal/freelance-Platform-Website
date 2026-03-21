import Link from "next/link";

export default function Navbar() {

  return (
    <nav className="bg-white border-b">

      <div className="container flex justify-between items-center py-4">

        <Link href="/" className="font-bold text-xl">
          FreelanceHub
        </Link>

        <div className="flex gap-6 text-sm">

          <Link href="/projects/browse">
            Projects
          </Link>

          <Link href="/freelancers/discover">
            Freelancers
          </Link>

          <Link href="/auth/login">
            Login
          </Link>

        </div>

      </div>

    </nav>
  );
}
