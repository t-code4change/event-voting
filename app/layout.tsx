// Root layout - minimal wrapper for locale-specific layouts
// The actual layout with i18n is in app/[locale]/layout.tsx

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
