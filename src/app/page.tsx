export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-8 gap-8">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-primary">
          Antisocial
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          A modern, containerized social media foundation built with Next.js,
          Tailwind CSS v4, and Shadcn UI.
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-2">Tailwind v4 Test</h2>
          <p className="text-sm text-muted-foreground">
            This card uses{" "}
            <code className="bg-muted px-1 rounded text-primary">bg-card</code>{" "}
            and
            <code className="bg-muted px-1 rounded text-primary">
              border-border
            </code>{" "}
            from the new v4 theme variables.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-primary text-primary-foreground shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Primary Color</h2>
          <p className="text-sm opacity-90">
            Testing high-contrast primary styles and accessibility.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-secondary text-secondary-foreground shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Secondary Style</h2>
          <p className="text-sm opacity-90">
            Checking subtle backgrounds and neutral layout elements.
          </p>
        </div>
      </main>

      <footer className="mt-12 text-sm text-muted-foreground flex gap-4">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          System Online
        </span>
        <span>•</span>
        <span>Next.js 16 + Tailwind v4</span>
      </footer>
    </div>
  );
}
