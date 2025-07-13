import React, {
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
  forwardRef
} from "react";
import WebView from "react-native-webview";

const QuillEditor = forwardRef(({ initialHtml = "" }, ref) => {
  const webviewRef = useRef(null);
  const pendingPromiseRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getHtml: () => {
      return new Promise((resolve) => {
        pendingPromiseRef.current = resolve;
        webviewRef.current.injectJavaScript(`
          window.ReactNativeWebView.postMessage(
            document.querySelector('.ql-editor').innerHTML
          );
          true;
        `);
      });
    }
  }));

  const handleMessage = (event) => {
    const html = event.nativeEvent.data;
    if (pendingPromiseRef.current) {
      pendingPromiseRef.current(html);
      pendingPromiseRef.current = null; // Clear promise after resolved
    }
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
      <style>
        body { margin: 0; padding: 0; height: 100vh; }
        #editor { height: 100%; }
      </style>
    </head>
    <body>
      <div id="editor">${initialHtml}</div>
      <script src="https://cdn.quilljs.com/1.3.6/quill.min.js"></script>
      <script>
        const quill = new Quill('#editor', {
          theme: 'snow'
        });

        window.getHtml = () => quill.root.innerHTML;

        // Không post tự động — tránh spam
      </script>
    </body>
    </html>
  `;

  return (
    <WebView
      ref={webviewRef}
      originWhitelist={["*"]}
      source={{ html: htmlContent }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      automaticallyAdjustContentInsets={false}
      style={{ height: 500 }}
      onMessage={handleMessage}
    />
  );
});

export default QuillEditor;
