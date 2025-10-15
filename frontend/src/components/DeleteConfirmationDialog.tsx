import React from "react";

type Props = {
  isOpen: boolean;
  prompt?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteConfirmationDialog({
  isOpen,
  prompt,
  onCancel,
  onConfirm,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        className="bg-background rounded-lg shadow-xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="delete-dialog-title"
          className="text-xl font-semibold text-white"
        >
          Confirm Deletion
        </h2>
        <p
          id="delete-dialog-description"
          className="mt-2 text-white/80 whitespace-pre-line"
        >
          {prompt || "Are you sure you want to delete this letter? This action cannot be undone."}
        </p>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
