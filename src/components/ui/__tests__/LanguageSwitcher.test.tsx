import { fireEvent, render, screen } from "@testing-library/react";

import { LanguageSwitcher } from "../LanguageSwitcher";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => "/es/contacto",
}));

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("switches from Spanish to English", () => {
    render(<LanguageSwitcher currentLang="es" />);

    fireEvent.click(
      screen.getByRole("button", { name: /cambiar idioma a inglés/i }),
    );

    expect(mockPush).toHaveBeenCalledWith("/en/contacto");
  });
});
