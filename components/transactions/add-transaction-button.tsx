"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { Account, Category } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TransactionForm } from "@/components/transactions/transaction-form";

export function AddTransactionButton({
  accounts,
  categories,
}: {
  accounts: Account[];
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} disabled={accounts.length === 0}>
        <Plus className="h-4 w-4" aria-hidden />
        Add transaction
      </Button>

      {open ? (
        <Dialog title="Add transaction" onClose={() => setOpen(false)}>
          <TransactionForm accounts={accounts} categories={categories} onSuccess={() => setOpen(false)} />
        </Dialog>
      ) : null}
    </>
  );
}
