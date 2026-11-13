// Cloudflare Pages Function: GET /api/time
//
// Returns the edge server's current Unix time in milliseconds so the client
// can correct for a skewed local clock without calling a third-party service.
// Cloudflare's servers are NTP-synchronized.
//
// Note: inside Workers, Date.now() is frozen for the duration of a request,
// so the value is the time the request arrived. The client compensates for
// network latency by comparing it with the midpoint of its round trip.

export const onRequestGet = (): Response =>
  new Response(JSON.stringify({ now: Date.now() }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // A cached timestamp is a wrong timestamp.
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
