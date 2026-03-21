import Link from "next/link";

export default function Sidebar() {

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">

      <nav className="flex flex-col gap-4">

        <Link href="/freelancer/dashboard">
          Dashboard
        </Link>

        <Link href="/freelancer/projects">
          Projects
        </Link>

        <Link href="/freelancer/earnings">
          Earnings
        </Link>

        <Link href="/messages">
          Messages
        </Link>

      </nav>

    </aside>
  );
}
