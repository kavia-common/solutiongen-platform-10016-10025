import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders upload configure page title", () => {
  render(<App />);
  expect(
    screen.getByRole("heading", { name: /upload documents & configure/i })
  ).toBeInTheDocument();
});
