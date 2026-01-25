const Home = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-8 text-foreground">
      <header className="space-y-4 text-center">
        <h1 className="font-bold text-4xl text-primary tracking-tight sm:text-6xl">
          Antisocial
        </h1>
        <p className="max-w-2xl text-muted-foreground text-xl">
          A modern, containerized social media foundation built with Next.js,
          Tailwind CSS v4, and Shadcn UI.
        </p>
      </header>

      <main className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
          <h2 className="mb-2 font-semibold text-lg">Tailwind v4 Test</h2>
          <p className="text-muted-foreground text-sm">
            This card uses{" "}
            <code className="rounded bg-muted px-1 text-primary">bg-card</code>{" "}
            and
            <code className="rounded bg-muted px-1 text-primary">
              border-border
            </code>{" "}
            from the new v4 theme variables.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-primary p-6 text-primary-foreground shadow-sm">
          <h2 className="mb-2 font-semibold text-lg">Primary Color</h2>
          <p className="text-sm opacity-90">
            Testing high-contrast primary styles and accessibility.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-secondary p-6 text-secondary-foreground shadow-sm">
          <h2 className="mb-2 font-semibold text-lg">Secondary Style</h2>
          <p className="text-sm opacity-90">
            Checking subtle backgrounds and neutral layout elements.
          </p>
        </div>
      </main>

      <footer className="mt-12 flex gap-4 text-muted-foreground text-sm">
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
