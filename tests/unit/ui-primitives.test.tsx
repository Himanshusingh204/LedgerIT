import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

describe("UI Primitives Component Suite", () => {
  describe("<Button />", () => {
    it("renders children text accurately", () => {
      render(<Button>Submit Expense</Button>);
      expect(screen.getByRole("button", { name: "Submit Expense" })).toBeInTheDocument();
    });

    it("triggers onClick when activated", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      fireEvent.click(screen.getByRole("button", { name: "Click Me" }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("disables interaction when isLoading or disabled is true", () => {
      const handleClick = vi.fn();
      render(
        <Button isLoading onClick={handleClick}>
          Processing
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("applies variant classes properly", () => {
      const { rerender } = render(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole("button")).toHaveClass("border");

      rerender(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole("button")).toHaveClass("text-foreground-muted");
    });
  });

  describe("<Input />", () => {
    it("renders text input with accessible placeholder and value", () => {
      render(<Input placeholder="Enter merchant..." defaultValue="Starbucks" />);
      const input = screen.getByPlaceholderText("Enter merchant...");
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue("Starbucks");
    });

    it("accepts user typing events", () => {
      render(<Input placeholder="Type note" />);
      const input = screen.getByPlaceholderText("Type note");
      fireEvent.change(input, { target: { value: "Lunch meeting" } });
      expect(input).toHaveValue("Lunch meeting");
    });

    it("applies danger border class when hasError is true", () => {
      render(<Input placeholder="Error test" hasError />);
      expect(screen.getByPlaceholderText("Error test")).toHaveClass("border-danger");
    });
  });

  describe("<Label />", () => {
    it("renders label with appropriate htmlFor association", () => {
      render(<Label htmlFor="test-id">Account Name</Label>);
      const label = screen.getByText("Account Name");
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute("for", "test-id");
    });
  });
});
