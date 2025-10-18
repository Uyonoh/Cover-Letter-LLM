"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import { Trash2 } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";

interface DeleteProps {
  id: string;
  table: string;
  text?: string;
  redirectTo?: string; // optional redirect path
  prepDelete?: () => void; // Before deleting
  onDeleted?: () => void; // After deleting
  asyncPrep?: boolean; // Make prep async
}

export default function DeleteButton({ table, id, text, asyncPrep, prepDelete, onDeleted, redirectTo = "/letters" }: DeleteProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function awaitPrep(){
    if (prepDelete) prepDelete();
  }

  async function handleDelete() {
    setLoading(true);
    
    if (prepDelete) {
      if (asyncPrep){
        await awaitPrep();
      } else {
        prepDelete();
      }
    }

    const { status, statusText } = await supabase
      .from(table)
      .delete()
      .eq("id", id);

    setLoading(false);
    console.log("Deleting id:", id, typeof id)
    console.log("Delete:", statusText);

    if (status !== 204) {
      console.error("Delete failed:", statusText);
      alert(`Failed to delete: ${statusText}`);
    } else {
      setDialogOpen(false);

      if (!onDeleted) {
        router.replace(redirectTo);
      } else {
        onDeleted();
      }
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={loading}
        className="hover:underline hover:text-primary flex gap-2 items-center cursor-pointer bg-transparent border-none p-0 disabled:opacity-50"
        onClick={(e) => {
          e.preventDefault(); // extra safety
          setDialogOpen(true);
        }}
      >
        <Trash2 size={20} className="text-red-500" />
        <span className="hidden sm:block">{text}</span>
      </button>

      <DeleteConfirmationDialog
        isOpen={isDialogOpen}
        onCancel={() => setDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
