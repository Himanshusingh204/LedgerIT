-- System default categories (user_id null), readable by every authenticated user.
insert into public.categories (name, slug, icon, kind) values
  ('Housing', 'housing', 'home', 'expense'),
  ('Food & Dining', 'food-dining', 'utensils', 'expense'),
  ('Transport', 'transport', 'car', 'expense'),
  ('Shopping', 'shopping', 'shopping-bag', 'expense'),
  ('Entertainment', 'entertainment', 'clapperboard', 'expense'),
  ('Health', 'health', 'heart-pulse', 'expense'),
  ('Bills', 'bills', 'receipt', 'expense'),
  ('Education', 'education', 'graduation-cap', 'expense'),
  ('Travel', 'travel', 'plane', 'expense'),
  ('Personal', 'personal', 'user', 'expense'),
  ('Other', 'other', 'circle-ellipsis', 'expense'),
  ('Salary', 'salary', 'wallet', 'income'),
  ('Other Income', 'other-income', 'circle-dollar-sign', 'income');
