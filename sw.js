const CACHE="hs-v15";
const FILES=["./","./index.html","./spielleiter.html","./manifest.webmanifest","./spielleiter.webmanifest","./icon-sl-192.png","./icon-sl-512.png","./apple-touch-icon-sl.png","./icon-192.png","./icon-512.png","./apple-touch-icon.png","./icon-32.png","./karte/karte-0.jpg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  if(e.request.mode==="navigate"){ const key=/spielleiter/.test(new URL(e.request.url).pathname)?"./spielleiter.html":"./index.html"; e.respondWith(fetch(e.request).then(r=>{const cp=r.clone(); caches.open(CACHE).then(c=>c.put(key,cp)); return r;}).catch(()=>caches.match(key))); return; }
  if(/\.(mp3|ogg|m4a|opus)$/i.test(new URL(e.request.url).pathname)) return;
  if(/\/karte\//.test(new URL(e.request.url).pathname)){ e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{ if(n.ok){ const cp=n.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); } return n; }))); return; }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
