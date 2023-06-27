import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import VisitorNavBar from "../components/VisitorNavBar";
import { MemoryRouter } from "react-router-dom";

test("renders the nav bar for a visitor", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <VisitorNavBar />
    </MemoryRouter>
  );

  const signUpButton = await screen.findByText("Log In / Sign Up");
  expect(signUpButton).toBeInTheDocument();
});
