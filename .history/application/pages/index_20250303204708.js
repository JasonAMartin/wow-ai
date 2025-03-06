import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">WoW Assistant Home</h1>
      <ul className="list-disc ml-8 space-y-2">
        <li><Link href="/add-delve-run"><a className="text-blue-500 underline">Add Delve Run</a></Link></li>
        <li><Link href="/get-delve-runs"><a className="text-blue-500 underline">Get Delve Runs</a></Link></li>
        <li><Link href="/update-inventory"><a className="text-blue-500 underline">Update Inventory</a></Link></li>
        <li><Link href="/update-talents"><a className="text-blue-500 underline">Update Talents</a></Link></li>
        <li><Link href="/update-currency"><a className="text-blue-500 underline">Update Currency</a></Link></li>
        <li><Link href="/update-curios"><a className="text-blue-500 underline">Update Curios</a></Link></li>
        <li><Link href="/update-stats"><a className="text-blue-500 underline">Update Stats</a></Link></li>
        <li><Link href="/update-gear"><a className="text-blue-500 underline">Update Gear</a></Link></li>
        <li><Link href="/get-inventory"><a className="text-blue-500 underline">Get Inventory</a></Link></li>
        <li><Link href="/get-talents"><a className="text-blue-500 underline">Get Talents</a></Link></li>
        <li><Link href="/get-currency"><a className="text-blue-500 underline">Get Currency</a></Link></li>
        <li><Link href="/get-curios"><a className="text-blue-500 underline">Get Curios</a></Link></li>
        <li><Link href="/get-stats"><a className="text-blue-500 underline">Get Stats</a></Link></li>
        <li><Link href="/get-gear"><a className="text-blue-500 underline">Get Gear</a></Link></li>
        <li><Link href="/store-ai-context"><a className="text-blue-500 underline">Store AI Context</a></Link></li>
        <li><Link href="/get-latest-ai-context"><a className="text-blue-500 underline">Get Latest AI Context</a></Link></li>
      </ul>
    </div>
  );
}
