import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import WelcomeBar from "../components/WelcomeBar";
import { MemoryRouter } from "react-router-dom";

test("renders the welcome bar", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <WelcomeBar />
    </MemoryRouter>
  );

  const logOutButton = await screen.findByText("Log Out");
  expect(logOutButton).toBeInTheDocument();
});
