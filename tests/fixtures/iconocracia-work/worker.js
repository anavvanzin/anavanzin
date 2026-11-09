export default {
  fetch(request) {
    const url = new URL(request.url);
    return new Response('Local Iconocracia fixture ' + url.pathname + url.search);
  }
};
