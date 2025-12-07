import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-border/50 relative z-10 border-t backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-center px-4">
        <p className="text-muted-foreground text-sm">
          © 2025 Devmint.dev — Built by{" "}
          <Link
            target="_blank"
            href="https://anirudhkille.com"
            className="hover:text-primary hover:underline"
          >
            Anirudh Kille
          </Link>
        </p>
      </div>
    </footer>
  );
}
