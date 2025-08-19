export async function onRequest(context) {
  // Get the original page response.
  const response = await context.next();

  // Get the Firebase config from the secure environment variables.
  const firebaseConfig = {
    apiKey: context.env.api,
    authDomain: context.env.d,
    projectId: context.env.i,
    storageBucket: context.env.b,
    messagingSenderId: context.env.id,
    appId: context.env.app,
  };

  const injectionScript = `<script>window.firebaseConfig = ${JSON.stringify(firebaseConfig)};</script>`;

  // Use HTMLRewriter to inject both the config and a visible test banner.
  const rewriter = new HTMLRewriter()
    .on('head', {
      element(element) {
        element.append(injectionScript, { html: true });
      },
    })
    .on('body', {
        element(element) {
            // This will add a visible red banner if the middleware runs.
            element.prepend('<h1 style="background:red; color:white; text-align:center; padding: 5px;">Middleware Test: If you see this, the middleware file is running.</h1>', { html: true });
        }
    });

  return rewriter.transform(response);
}
