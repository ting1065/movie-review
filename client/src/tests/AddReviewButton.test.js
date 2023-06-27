import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import AddReviewButton from "../components/AddReviewButton";
import { MemoryRouter } from "react-router-dom";

test("renders add review button", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <AddReviewButton />
    </MemoryRouter>
  );

  const addReviewButton = await screen.findByText("add one");
  expect(addReviewButton).toBeInTheDocument();
});
