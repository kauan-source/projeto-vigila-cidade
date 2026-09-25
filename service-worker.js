// ==========================================================
// VigilaCidade — Service Worker (PWA)
// ==========================================================

const CACHE_NAME = "vigilacidade-v1";

// Arquivos que serão cacheados na instalação
const ASSETS = [
  "./",
  "index.html",
  "login.html",
  "css/style.css",
  "js/script.js",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png"
];


// ----------------------------------------------------------
// INSTALAÇÃO — pré-cache dos arquivos essenciais
// ----------------------------------------------------------

self.addEventListener("install", function (event) {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(ASSETS);
      })
      .then(function () {
        return self.skipWaiting();
      })

  );

});


// ----------------------------------------------------------
// ATIVAÇÃO — remove caches antigos
// ----------------------------------------------------------

self.addEventListener("activate", function (event) {

  event.waitUntil(

    caches.keys()
      .then(function (chaves) {
        return Promise.all(
          chaves
            .filter(function (chave) {
              return chave !== CACHE_NAME;
            })
            .map(function (chave) {
              return caches.delete(chave);
            })
        );
      })
      .then(function () {
        return self.clients.claim();
      })

  );

});


// ----------------------------------------------------------
// FETCH — estratégia de cache
// ----------------------------------------------------------

self.addEventListener("fetch", function (event) {

  // Ignora requisições que não sejam GET
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);

  // Não intercepta requisições externas (ex.: Google Fonts)
  if (url.origin !== self.location.origin) {
    return;
  }


  // ---------- Navegação (HTML) → network-first ----------
  if (event.request.mode === "navigate") {

    event.respondWith(

      fetch(event.request)
        .catch(function () {
          return caches.match("index.html");
        })

    );

    return;

  }


  // ---------- Arquivos estáticos → cache-first ----------
  event.respondWith(

    caches.match(event.request)
      .then(function (respostaCache) {

        if (respostaCache) {
          return respostaCache;
        }

        return fetch(event.request)
          .then(function (respostaRede) {

            // Guarda uma cópia no cache se for resposta válida
            if (
              respostaRede &&
              respostaRede.status === 200 &&
              respostaRede.type === "basic"
            ) {

              const clone = respostaRede.clone();

              caches.open(CACHE_NAME)
                .then(function (cache) {
                  cache.put(event.request, clone);
                });

            }

            return respostaRede;

          })
          .catch(function () {

            // Fallback para HTML se algo falhar
            if (event.request.destination === "document") {
              return caches.match("index.html");
            }

          });

      })

  );

});