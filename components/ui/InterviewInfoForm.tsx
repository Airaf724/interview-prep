"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const InterviewSetupPage = ({ userId }: { userId: string | undefined }) => {
  const router = useRouter();

  const [role, setRole] = useState("");
  const [level, setLevel] = useState("Entry-level");
  const [amount, setAmount] = useState(5);
  const [type, setType] = useState("Technical");
  const [techstack, setTechstack] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          level,
          amount,
          type,
          techstack,
          userid: userId, // Replace with actual user ID from auth
        }),
      });

      if (res.ok) {
        toast.success("Interview created succesfully !");
        router.push("/"); // Go to interview page
      } else {
        alert("Error generating interview");
      }
    } catch (error) {
      console.error(error);
      alert("Error generating interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-1/2 mx-auto mt-10 p-6 shadow rounded bg-black">
      <h1 className="text-2xl font-bold mb-6">Setup Your Interview</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Role</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            placeholder="e.g. Frontend Developer"
          />
        </div>

        <div className="bg-black">
          <label className="block mb-1 font-medium">Level</label>
          <select
            className="w-full bg-black border p-2 rounded"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option>Entry-level</option>
            <option>Mid-level</option>
            <option>Senior</option>
            <option>Lead</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Type</label>
          <select
            className="w-full bg-black border p-2 rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option>Technical</option>
            <option>Behavioural</option>
            <option>Mixed</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Tech Stack</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={techstack}
            onChange={(e) => setTechstack(e.target.value)}
            placeholder="e.g. React, Node.js, TypeScript"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Amount of Questions</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min={1}
            max={20}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Generating..." : "Start Interview"}
        </button>
      </form>
    </div>
  );
};

export default InterviewSetupPage;
