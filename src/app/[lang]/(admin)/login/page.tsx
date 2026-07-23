import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatedFadeIn } from "@/components/ui/AnimatedFadeIn";
import { LoginErrorToast } from "@/components/admin/LoginErrorToast";
import Link from "next/link";
//importamo nuestra accion
import { loginAction } from "./actions";
import { redirectIfAuthenticated } from "@/lib/admin/auth";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  await redirectIfAuthenticated(lang);

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <LoginErrorToast />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>

      {/* UX Motion System: entrada suave del bloque de autenticación para reducir salto visual. */}
      <AnimatedFadeIn className="w-full max-w-md">
        <Card className="w-full border-primary/20 bg-background/60 backdrop-blur-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-wider font-(family-name:--font-geist-mono)">
              ADMIN <span className="text-primary">ACCESS</span>
            </CardTitle>
            <CardDescription>
              Introduce tus credenciales para acceder al sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* inyectamos el Server Action */}
            <form action={loginAction.bind(null, lang)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email de Operador</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@sistema.com"
                  required
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Código de Seguridad</Label>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="bg-background/50"
                />
              </div>

              <Button
                type="submit"
                className="w-full font-bold tracking-widest mt-4"
              >
                INICIAR SESIÓN
              </Button>

              <Button
                asChild
                type="button"
                variant="outline"
                className="w-full"
              >
                <Link href={`/${lang}`}>Volver al inicio</Link>
              </Button>
            </form>
          </CardContent>
        </Card>
      </AnimatedFadeIn>
    </main>
  );
}
