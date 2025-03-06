import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">WoW Assistant Home</h1>
      <ul className="list-disc ml-8 space-y-2">
        <li>
          <Link href="/add-delve-run" className="text-blue-500 underline">
            Add Delve Run
          </Link>
        </li>
        <li>
          <Link href="/get-delve-runs" className="text-blue-500 underline">
            Get Delve Runs
          </Link>
        </li>
        <li>
          <Link href="/update-inventory" className="text-blue-500 underline">
            Update Inventory
          </Link>
        </li>
        <li>
          <Link href="/update-talents" className="text-blue-500 underline">
            Update Talents
          </Link>
        </li>
        <li>
          <Link href="/update-currency" className="text-blue-500 underline">
            Update Currency
          </Link>
        </li>
        <li>
          <Link href="/update-curios" className="text-blue-500 underline">
            Update Curios
          </Link>
        </li>
        <li>
          <Link href="/update-stats" className="text-blue-500 underline">
            Update Stats
          </Link>
        </li>
        <li>
          <Link href="/update-gear" className="text-blue-500 underline">
            Update Gear
          </Link>
        </li>
        <li>
          <Link href="/get-inventory" className="text-blue-500 underline">
            Get Inventory
          </Link>
        </li>
        <li>
          <Link href="/get-talents" className="text-blue-500 underline">
            Get Talents
          </Link>
        </li>
        <li>
          <Link href="/get-currency" className="text-blue-500 underline">
            Get Currency
          </Link>
        </li>
        <li>
          <Link href="/get-curios" className="text-blue-500 underline">
            Get Curios
          </Link>
        </li>
        <li>
          <Link href="/get-stats" className="text-blue-500 underline">
            Get Stats
          </Link>
        </li>
        <li>
          <Link href="/get-gear" className="text-blue-500 underline">
            Get Gear
          </Link>
        </li>
        <li>
          <Link href="/store-ai-context" className="text-blue-500 underline">
            Store AI Context
          </Link>
        </li>
        <li>
          <Link href="/get-latest-ai-context" className="text-blue-500 underline">
            Get Latest AI Context
          </Link>
        </li>
      </ul>
    </div>
  );
}
