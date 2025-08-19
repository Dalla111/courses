export async function onRequest(context) {
  // Get the original page response.
  const response = await context.next();

  // Get the Firebase config from the secure environment variables you will set in Cloudflare.
  const firebaseConfig = {
    apiKey: context.env.a,
    authDomain: context.env.d,
    projectId: context.env.i,
    storageBucket: context.env.b,
    messagingSenderId: context.env.id,
    appId: context.env.app,
  };

  // This creates a new script tag containing your secure config.
  const injectionScript = `<script>window.firebaseConfig = ${JSON.stringify(firebaseConfig)};</script>`;

  // Use HTMLRewriter to safely inject the new script tag into the <head> of your HTML file.
  return new HTMLRewriter()
    .on('head', {
      element(element) {
        element.append(injectionScript, { html: true });
      },
    })
    .transform(response);

}
