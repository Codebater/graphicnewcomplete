export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Dashboard | Graphiq.Art</title>
        <style dangerouslySetInnerHTML={{
          __html: `
            html, body {
              margin: 0;
              padding: 0;
              height: 100%;
              width: 100%;
              background: rgb(3, 7, 18);
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }
            
            * {
              box-sizing: border-box;
            }
          `
        }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
