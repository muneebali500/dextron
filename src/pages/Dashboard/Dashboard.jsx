import React from "react";
import DrivePage from "../Drive/DrivePage";

export default function Dashboard() {
  return (
    <main className="flex">
      <aside className="h-screen w-[272px] bg-white shadow">
        <li>Content</li>
      </aside>

      <div className="flex-1 bg-gray-100">
        <DrivePage />
      </div>
    </main>
  );
}
