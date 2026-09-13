export type AccountType = "cash" | "bank" | "debit_card" | "credit_card" | "other";
export type TransactionType = "expense" | "income" | "transfer";
export type CategoryKind = "expense" | "income";

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  currency: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export type Account = {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  currency: string;
  last_four: string | null;
  opening_balance: number;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export type Category = {
  id: string;
  user_id: string | null;
  name: string;
  slug: string;
  icon: string;
  kind: CategoryKind;
  is_archived: boolean;
  created_at: string;
}

export type Transaction = {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string | null;
  type: TransactionType;
  amount: number;
  currency: string;
  merchant: string | null;
  note: string | null;
  receipt_url: string | null;
  occurred_at: string;
  created_at: string;
  updated_at: string;
}

export type Budget = {
  id: string;
  user_id: string;
  category_id: string;
  month_start: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      accounts: {
        Row: Account;
        Insert: Partial<Account> & { user_id: string; name: string; type: AccountType };
        Update: Partial<Account>;
        Relationships: [];
      };
      categories: {
        Row: Category;
        Insert: Partial<Category> & { name: string; slug: string; kind: CategoryKind };
        Update: Partial<Category>;
        Relationships: [];
      };
      transactions: {
        Row: Transaction;
        Insert: Partial<Transaction> & {
          user_id: string;
          account_id: string;
          type: TransactionType;
          amount: number;
          occurred_at: string;
        };
        Update: Partial<Transaction>;
        Relationships: [];
      };
      budgets: {
        Row: Budget;
        Insert: Partial<Budget> & { user_id: string; category_id: string; month_start: string; amount: number };
        Update: Partial<Budget>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
