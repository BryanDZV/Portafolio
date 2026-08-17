// src/components/organisms/AboutProfile.tsx

import React from "react";
import { AboutProfileProps } from "@/types/About";
import { LottieAnimation } from "../atoms/LottieAnimation";
import contactAnimation from "@/assets/lotties/profile.json";

export default function AboutProfile({ data }: AboutProfileProps) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <LottieAnimation
        animationData={contactAnimation}
        className="w-48 h-48 md:w-64 md:h-64 mb-4"
      />
      {/* Sección: Lema */}
      <section className="mb-16 text-center lg:text-left">
        <h2 className="text-2xl md:text-4xl font-semibold text-primary mb-4">
          {data.motto}
        </h2>
      </section>
      {/* Encabezado Principal */}
      <header className="mb-16 text-center lg:text-left border-b border-border pb-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight mb-6">
          {data.title}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-3xl">
          {data.headline}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* COLUMNA IZQUIERDA: Biografía y Habilidades */}
        <div className="lg:col-span-7 space-y-16">
          {/* Sección: Biografía */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              {data.biographyTitle}
            </h2>
            <article className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              {data.biography.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </article>
          </section>

          {/* Sección: Stack Tecnológico */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-8">
              {data.techStackTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {data.mainStack.map((stack, index) => (
                <div
                  key={index}
                  className="bg-card/60 backdrop-blur-md p-6 rounded-2xl border border-border"
                >
                  <h3 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
                    {stack.categoryName}
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {stack.technologies.map((tech, i) => (
                      <li
                        key={i}
                        className="px-3 py-1.5 bg-background text-foreground rounded-md text-sm font-medium border border-border shadow-sm"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Sección: Competencias Transversales */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              {data.coreSkillsTitle}
            </h2>
            <ul className="flex flex-wrap gap-3">
              {data.coreSkills.map((skill, index) => (
                <li
                  key={index}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* COLUMNA DERECHA: Experiencia Laboral */}
        <div className="lg:col-span-5 bg-card/40 backdrop-blur-md p-8 rounded-3xl border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-10">
            {data.experienceTitle}
          </h2>
          <div className="space-y-12">
            {data.experiences.map((exp) => (
              <article
                key={exp.id}
                className="relative pl-8 border-l-2 border-primary"
              >
                <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-1.5 ring-4 ring-background" />

                <header className="mb-3">
                  <h3 className="text-xl font-bold text-foreground">
                    {exp.role}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-muted-foreground mt-1">
                    <span className="font-semibold text-foreground">
                      {exp.company}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <time className="font-mono text-xs font-medium uppercase tracking-wider bg-secondary px-2 py-0.5 rounded">
                      {exp.period}
                    </time>
                  </div>
                </header>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {exp.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
