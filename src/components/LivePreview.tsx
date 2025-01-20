'use client';

import { useEffect, useRef } from 'react';

interface LivePreviewProps {
  code: string;
  framework: string;
}

export default function LivePreview({ code, framework }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current || !code) return;

    const isReact = framework === 'react';
    
    if (isReact) {
      // Handle React code
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
            <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
            <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            <style>
              body { 
                margin: 0; 
                padding: 1rem;
                font-family: system-ui, -apple-system, sans-serif;
                color: #1a1a1a;
                background: #ffffff;
              }
              @media (prefers-color-scheme: dark) {
                body {
                  color: #e5e5e5;
                  background: #1a1a1a;
                }
              }
              * { box-sizing: border-box; }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script type="text/babel">
              try {
                ${code}
                // If code doesn't explicitly render, try to render the last expression
                const lastExpression = (function() {
                  try {
                    return eval('(' + \`${code}\`+ ')');
                  } catch {
                    return null;
                  }
                })();
                if (lastExpression && typeof lastExpression === 'function') {
                  ReactDOM.render(React.createElement(lastExpression), document.getElementById('root'));
                }
              } catch (error) {
                document.body.innerHTML = '<pre style="color: red;">' + error + '</pre>';
              }
            </script>
          </body>
        </html>
      `;
      iframeRef.current.srcdoc = html;
    } else {
      // For plain HTML, use the code directly if it's a complete HTML document
      if (code.includes('<!DOCTYPE html>')) {
        iframeRef.current.srcdoc = code;
      } else {
        // Fallback for incomplete HTML
        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { 
                  margin: 0; 
                  padding: 1rem;
                  font-family: system-ui, -apple-system, sans-serif;
                  color: #1a1a1a;
                  background: #ffffff;
                }
                @media (prefers-color-scheme: dark) {
                  body {
                    color: #e5e5e5;
                    background: #1a1a1a;
                  }
                }
                * { box-sizing: border-box; }
                ${code.match(/<style>([\s\S]*?)<\/style>/)?.[1] || ''}
              </style>
            </head>
            <body>
              ${code.replace(/<style>[\s\S]*?<\/style>/, '').replace(/<script>[\s\S]*?<\/script>/, '')}
              <script>
                try {
                  ${code.match(/<script>([\s\S]*?)<\/script>/)?.[1] || ''}
                } catch (error) {
                  document.body.innerHTML = '<pre style="color: red;">' + error + '</pre>';
                }
              </script>
            </body>
          </html>
        `;
        iframeRef.current.srcdoc = html;
      }
    }
  }, [code, framework]);

  return (
    <iframe
      ref={iframeRef}
      title="Live Preview"
      className="w-full h-[400px] border-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
      sandbox="allow-scripts allow-popups allow-modals allow-forms allow-same-origin"
    />
  );
}
