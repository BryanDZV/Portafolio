import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";

import { ProjectCard } from "../ProjectCard";

const mockUse3DTilt = jest.fn();

jest.mock("@/hooks/use3DTilt", () => ({
  use3DTilt: () => mockUse3DTilt(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={typeof src === "string" ? src : (src as { src?: string })?.src} alt={alt as string} {...props} />
  ),
}));

jest.mock("framer-motion", () => ({
  m: {
    div: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
      <div {...props}>{children}</div>
    ),
    a: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
      <a {...props}>{children}</a>
    ),
  },
}));

describe("ProjectCard", () => {
  beforeEach(() => {
    mockUse3DTilt.mockReturnValue({
      ref: createRef<HTMLDivElement>(),
      rotateX: 0,
      rotateY: 0,
      onMouseMove: jest.fn(),
      onMouseLeave: jest.fn(),
    });
  });

  it("renders project content and action links", () => {
    render(
      <ProjectCard
        title="Portfolio App"
        description="Aplicación para mostrar proyectos y contacto."
        imageUrl="/images/project.jpg"
        techStack={["React", "Next.js", "Tailwind"]}
        liveUrl="https://demo.example.com"
        githubUrl="https://github.com/example/portfolio"
      />,
    );

    expect(
      screen.getByRole("heading", { name: /portfolio app/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/aplicación para mostrar proyectos y contacto/i),
    ).toBeInTheDocument();
    expect(screen.getByAltText("Portfolio App")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("Tailwind")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ver código/i })).toHaveAttribute(
      "href",
      "https://github.com/example/portfolio",
    );
    expect(screen.getByRole("link", { name: /demo web/i })).toHaveAttribute(
      "href",
      "https://demo.example.com",
    );
  });

  it("renders the image fallback and hides optional links when urls are missing", () => {
    render(
      <ProjectCard
        title="Minimal Card"
        description="Solo datos básicos."
        techStack={[]}
      />,
    );

    expect(screen.getByText("Sin imagen")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /ver código/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /demo web/i }),
    ).not.toBeInTheDocument();
  });
});
