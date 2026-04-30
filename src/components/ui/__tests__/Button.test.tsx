import { render, screen } from "@testing-library/react";

import { Button } from "../button";

describe("Button", () => {
  it("renders a clickable button with its label", () => {
    render(<Button>Enviar</Button>);

    expect(screen.getByRole("button", { name: /enviar/i })).toBeInTheDocument();
  });
});
