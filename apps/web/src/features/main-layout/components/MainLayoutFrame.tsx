export default function MainLayoutFrame({
  nav,
  transactionSheet,
  header,
  content,
}: Readonly<{
  nav: React.ReactNode;
  transactionSheet: React.ReactNode;
  header: React.ReactNode;
  content: React.ReactNode;
}>) {
  return (
    <div className="text-primary-text flex flex-col relative flex-1 min-w-0 min-h-0">
      <div className="flex flex-1 relative z-10 min-w-0 min-h-0">
        {nav}
        {transactionSheet}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {header}
          {content}
        </div>
      </div>
    </div>
  );
}
