"use client";

import { useActionState } from "react";
import type { Profile } from "@/types/database";
import { updateProfileAction, type ProfileActionState } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ProfileActionState = { status: "idle" };

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "INR", "JPY"];

const COMMON_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
];

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <Label htmlFor="displayName">Name</Label>
        <Input id="displayName" name="displayName" type="text" defaultValue={profile.display_name ?? ""} />
      </div>

      <div>
        <Label htmlFor="currency">Currency</Label>
        <select
          id="currency"
          name="currency"
          defaultValue={profile.currency}
          className="h-10 w-full rounded-[var(--radius-control)] border border-border bg-surface px-3 text-sm text-foreground focus-visible:border-primary focus-visible:outline-none"
        >
          {!CURRENCIES.includes(profile.currency) ? (
            <option value={profile.currency}>{profile.currency}</option>
          ) : null}
          {CURRENCIES.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="timezone">Timezone</Label>
        <select
          id="timezone"
          name="timezone"
          defaultValue={profile.timezone}
          className="h-10 w-full rounded-[var(--radius-control)] border border-border bg-surface px-3 text-sm text-foreground focus-visible:border-primary focus-visible:outline-none"
        >
          {!COMMON_TIMEZONES.includes(profile.timezone) ? (
            <option value={profile.timezone}>{profile.timezone}</option>
          ) : null}
          {COMMON_TIMEZONES.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
      </div>

      {state.status === "error" ? (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" isLoading={isPending}>
        Save changes
      </Button>
    </form>
  );
}
