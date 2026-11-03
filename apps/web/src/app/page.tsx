import { redirect } from "next/navigation";

const Home = () => {
  redirect("/feed");
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <header className="space-y-4 text-center">
        <h1 className="text-primary text-4xl font-bold tracking-tight sm:text-6xl">
          Antisocial
        </h1>
        <p className="text-muted-foreground max-w-2xl text-xl">
          A modern, containerized social media foundation built with Next.js,
          Tailwind CSS v4, and Shadcn UI.
        </p>
      </header>

      <main className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="border-border bg-card rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md">
          <h2 className="mb-2 text-lg font-semibold">Tailwind v4 Test</h2>
          <p className="text-muted-foreground text-sm">
            This card uses{" "}
            <code className="bg-muted text-primary rounded px-1">bg-card</code>{" "}
            and
            <code className="bg-muted text-primary rounded px-1">
              border-border
            </code>{" "}
            from the new v4 theme variables.
          </p>
        </div>

        <div className="border-border bg-primary text-primary-foreground rounded-xl border p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Primary Color</h2>
          <p className="text-sm opacity-90">
            Testing high-contrast primary styles and accessibility.
          </p>
        </div>

        <div className="border-border bg-secondary text-secondary-foreground rounded-xl border p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Secondary Style</h2>
          <p className="text-sm opacity-90">
            Checking subtle backgrounds and neutral layout elements.
          </p>
        </div>
      </main>

      <footer className="text-muted-foreground mt-12 flex gap-4 text-sm">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          System Online
        </span>
        <span>•</span>
        <span>Next.js 16 + Tailwind v4</span>
      </footer>
    </div>
  );
};

export default Home;
