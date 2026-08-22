/** @format */
"use client";

import { SubcontractorUI } from "@/types";
import { CheckCircle2, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTradeService } from "@/src/actions/dataActions";

export default function ServicesTab({ profile }: { profile: SubcontractorUI }) {
  const [newService, setNewService] = useState("");
  const queryClient = useQueryClient();

  const addServiceMutation = useMutation({
    mutationFn: async (trade: string) => {
      return await addTradeService(profile.id, trade);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", profile.id] });
      setNewService("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newService.trim()) {
      addServiceMutation.mutate(newService.trim());
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm max-w-2xl">
      <h3 className="text-lg font-bold text-slate-900 mb-6">
        Manage Services & Trades
      </h3>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <input
          type="text"
          value={newService}
          onChange={(e) => setNewService(e.target.value)}
          placeholder="e.g., Demolition, Electrical"
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={addServiceMutation.isPending || !newService.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          {addServiceMutation.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Plus size={16} />
          )}
          Add Service
        </button>
      </form>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Current Services
        </h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {profile.trades?.map((trade, idx) => (
            <li
              key={idx}
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50 text-slate-800 text-sm font-medium"
            >
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
              {trade}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
