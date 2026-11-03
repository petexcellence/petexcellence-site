/* Univet 360 – fundo claro/escuro e comando de voz nas páginas públicas (pedido do CEO, 03/11/2026).
   Mesmo arquivo na página de vendas Pet Excellence e no site da Univet. Voz: Web Speech API do navegador
   (Chrome, Edge, Android, Safari). Só navega na página; nada é enviado sem o clique da pessoa. */
(function () {
  var UNIVET = /univetvitoria/.test(location.hostname) || /\/site\//.test((document.currentScript || {}).src || '');
  var CHAVE = UNIVET ? 'univet-tema' : 'pe360-tema';
  var root = document.documentElement;

  // ---- tema ----
  function padraoEscuro() { return UNIVET ? matchMedia('(prefers-color-scheme: dark)').matches : true; }
  function aplicar(t) {
    if (UNIVET) { root.setAttribute('data-theme', t === 'claro' ? 'light' : 'dark'); }
    else { if (t === 'claro') root.setAttribute('data-tema', 'claro'); else root.removeAttribute('data-tema'); }
    try { localStorage.setItem(CHAVE, t); } catch (e) {}
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', t === 'claro' ? '#F5F8FC' : '#050B1A');
    var b = document.getElementById('v360-tema'); if (b) b.innerHTML = t === 'claro' ? '🌙<span> Escuro</span>' : '☀️<span> Claro</span>';
  }
  function atual() { try { var s = localStorage.getItem(CHAVE); if (s) return s; } catch (e) {} return padraoEscuro() ? 'escuro' : 'claro'; }
  try { var salvo = localStorage.getItem(CHAVE); if (salvo) aplicar(salvo); } catch (e) {}

  // ---- comandos ----
  function sem(t) { return (' ' + t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim() + ' '); }
  function sel(q) { return document.querySelector(q); }
  function rolar(q) { var e = typeof q === 'string' ? sel(q) : q; if (e) { e.scrollIntoView({ behavior: 'smooth', block: 'start' }); return true; } return false; }
  function clicar(q) { var e = sel(q); if (e) { e.click(); return true; } return false; }
  function porTexto(re) { var els = document.querySelectorAll('h2,h3,summary'); for (var i = 0; i < els.length; i++) if (re.test(sem(els[i].textContent))) return els[i]; return null; }

  var PE = [
    [['simular', 'simulador', 'quanto custa', 'preco', 'precos', 'valor', 'valores'], 'Simular o plano', function () { return rolar('#simular'); }],
    [['planos', 'ver planos', 'comparar', 'gold', 'platinum', 'black', 'coberturas', 'o que cobre'], 'Planos', function () { return rolar('#plans') || rolar('#simular'); }],
    [['assinar', 'contratar', 'comprar', 'fechar', 'quero o plano', 'aderir', 'cadastro'], 'Fechar o plano', function () { return rolar('#assinar'); }],
    [['area do cliente', 'ja sou cliente', 'minha area', 'carteirinha', 'login'], 'Área do cliente', function () { return rolar('#cliente'); }],
    [['quem esta por tras', 'univet', 'clinica', 'credibilidade'], 'Quem está por trás', function () { return rolar('#quem') || rolar(porTexto(/univet/)); }],
    [['duvidas', 'perguntas', 'faq'], 'Perguntas', function () { return rolar('.faq') || rolar(porTexto(/pergunta|duvida/)); }],
    [['whatsapp', 'atendente', 'falar com alguem', 'conversar'], 'WhatsApp', function () { return clicar('a[href*="wa.me"]'); }],
    [['inicio', 'topo', 'comeco'], 'Início', function () { scrollTo({ top: 0, behavior: 'smooth' }); return true; }],
  ];
  var UV = [
    [['whatsapp', 'agendar', 'marcar consulta', 'atendimento', 'falar com alguem'], 'WhatsApp', function () { return clicar('a[href*="wa.me"]'); }],
    [['como chegar', 'endereco', 'mapa', 'localizacao', 'onde fica'], 'Como chegar', function () { return clicar('a[href*="google.com/maps"]'); }],
    [['simular plano', 'plano de saude', 'plano', 'pet excellence'], 'Plano Pet Excellence', function () { return clicar('a.cta-plano') || rolar('#plano'); }],
    [['especialidades', 'especialidade', 'servicos'], 'Especialidades', function () { return rolar('#especialidades'); }],
    [['estrutura', 'fotos', 'conhecer a clinica', 'por dentro'], 'Estrutura', function () { return rolar('#estrutura'); }],
    [['equipe', 'veterinarios', 'medicos'], 'Equipe', function () { return rolar('#equipe') || rolar('#direcao'); }],
    [['boletins', 'boletim', 'revista', 'ciencia'], 'Boletins e ciência', function () { return rolar('#boletins') || rolar('#ciencia'); }],
    [['campanhas', 'campanha', 'outubro rosa', 'novembro azul'], 'Campanhas', function () { return rolar('#campanhas'); }],
    [['contato', 'telefone', 'e mail', 'email'], 'Contato', function () { return rolar('#contato'); }],
    [['instagram'], 'Instagram', function () { return clicar('a[href*="instagram.com"]'); }],
    [['facebook'], 'Facebook', function () { return clicar('a[href*="facebook.com"]'); }],
    [['inicio', 'topo', 'comeco'], 'Início', function () { scrollTo({ top: 0, behavior: 'smooth' }); return true; }],
  ];
  var LISTA = UNIVET ? UV : PE;
  var AJUDA = UNIVET ? 'Diga, por exemplo: "como chegar", "WhatsApp", "especialidades", "simular plano" ou "fundo branco".'
                     : 'Diga, por exemplo: "simular", "ver planos", "assinar", "área do cliente", "WhatsApp" ou "fundo branco".';

  function interpretar(f) {
    var t = sem(f);
    if (/(fundo|tema|modo|tela) (branco|claro)|clarear/.test(t)) return { tema: 'claro' };
    if (/(fundo|tema|modo|tela) (escuro|preto|azul|noite)|escurecer/.test(t)) return { tema: 'escuro' };
    if (/ (ajuda|comandos|o que (eu )?posso (falar|dizer)) /.test(t)) return { ajuda: 1 };
    var m = null;
    LISTA.forEach(function (c) { c[0].forEach(function (k) { if (t.indexOf(' ' + k + ' ') >= 0 && (!m || k.length > m.len)) m = { nome: c[1], fazer: c[2], len: k.length }; }); });
    return m;
  }

  var balao, tb;
  function mostrar(html, ms) {
    if (!balao) { balao = document.createElement('div'); balao.className = 'v360-balao'; balao.setAttribute('role', 'status'); balao.onclick = function () { balao.style.display = 'none'; }; document.body.appendChild(balao); }
    balao.innerHTML = html; balao.style.display = 'block'; clearTimeout(tb); if (ms !== 0) tb = setTimeout(function () { balao.style.display = 'none'; }, ms || 4500);
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function falar(t) { try { var u = new SpeechSynthesisUtterance(t); u.lang = 'pt-BR'; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) {} }

  function executar(f) {
    var r = interpretar(f);
    if (r && r.tema) { aplicar(r.tema); mostrar('Ouvi: “' + esc(f) + '” → <b>fundo ' + (r.tema === 'claro' ? 'branco' : 'escuro') + '</b>'); return; }
    if (r && r.ajuda) { mostrar(AJUDA, 9000); return; }
    if (r && r.fazer()) { mostrar('Ouvi: “' + esc(f) + '” → <b>' + esc(r.nome) + '</b>'); falar(r.nome); return; }
    mostrar('Não entendi: “' + esc(f) + '”. ' + AJUDA, 9000);
  }

  var ouvindo = false, rec = null;
  function ouvir() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { mostrar('Este navegador não tem comando de voz. Use o Chrome, o Edge ou o celular.', 6000); return; }
    if (ouvindo && rec) { rec.stop(); return; }
    rec = new SR(); rec.lang = 'pt-BR'; rec.interimResults = true; rec.maxAlternatives = 3;
    var fim = '', erro = false, bt = document.getElementById('v360-voz');
    rec.onstart = function () { ouvindo = true; bt.classList.add('on'); bt.innerHTML = '🎤<span> Ouvindo</span>'; mostrar('<b>Pode falar…</b> ' + esc(AJUDA.replace('Diga, por exemplo: ', 'ex.: ')), 0); };
    rec.onresult = function (e) {
      var r = e.results[e.results.length - 1];
      if (r.isFinal) { var alts = []; for (var i = 0; i < r.length; i++) alts.push(r[i].transcript); fim = alts.filter(function (a) { return interpretar(a); })[0] || alts[0]; }
      else mostrar('<b>Ouvindo:</b> ' + esc(r[0].transcript), 0);
    };
    rec.onerror = function (e) { erro = true; mostrar(e.error === 'not-allowed' ? 'Libere o microfone (cadeado ao lado do endereço).' : e.error === 'no-speech' ? 'Não ouvi nada. Toque no microfone e fale.' : 'Não consegui ouvir.', 5000); };
    rec.onend = function () { ouvindo = false; bt.classList.remove('on'); bt.innerHTML = '🎤<span> Voz</span>'; if (fim) executar(fim.trim()); else if (!erro) mostrar('Não ouvi nada. Toque em 🎤 e fale.', 3500); };
    try { rec.start(); } catch (e) {}
  }

  function montar() {
    var css = document.createElement('style');
    css.textContent = '.v360-ferr{position:fixed;left:12px;bottom:12px;z-index:9990;display:flex;gap:6px}' +
      '.v360-ferr button{font:600 13px Inter,Poppins,system-ui,sans-serif;padding:8px 12px;border-radius:999px;cursor:pointer;border:1px solid rgba(148,190,255,.35);background:rgba(5,11,26,.82);color:#EAF2FF;backdrop-filter:blur(8px);box-shadow:0 6px 18px rgba(0,0,0,.25)}' +
      'html[data-tema=claro] .v360-ferr button,html[data-theme=light] .v360-ferr button{background:rgba(255,255,255,.92);color:#0F1B33;border-color:#C9D5E6}' +
      '.v360-ferr button.on{background:#F87171!important;color:#fff!important;border-color:#F87171!important;animation:v360p 1.2s infinite}' +
      '@keyframes v360p{0%{box-shadow:0 0 0 0 rgba(248,113,113,.6)}100%{box-shadow:0 0 0 14px rgba(248,113,113,0)}}' +
      '@media (max-width:640px){.v360-ferr{flex-direction:column;left:8px;bottom:84px}.v360-ferr button{padding:9px 10px;opacity:.9}.v360-ferr button span{display:none}}' +
      '.v360-balao{display:none;position:fixed;left:50%;bottom:64px;transform:translateX(-50%);z-index:9991;max-width:min(560px,92vw);padding:12px 18px;border-radius:14px;background:#0B1834;color:#EAF2FF;border:1px solid rgba(34,211,238,.45);box-shadow:0 12px 30px rgba(0,0,0,.35);font:14px/1.45 Inter,Poppins,system-ui,sans-serif}' +
      '.v360-balao b{color:#67E8F9}html[data-tema=claro] .v360-balao,html[data-theme=light] .v360-balao{background:#fff;color:#0F1B33;border-color:#9ADBE8}html[data-tema=claro] .v360-balao b,html[data-theme=light] .v360-balao b{color:#0E7490}';
    document.head.appendChild(css);
    var box = document.createElement('div'); box.className = 'v360-ferr';
    var temSR = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    if (temSR) { var v = document.createElement('button'); v.id = 'v360-voz'; v.type = 'button'; v.innerHTML = '🎤<span> Voz</span>'; v.title = 'Comando de voz'; v.setAttribute('aria-label', 'Comando de voz'); v.onclick = ouvir; box.appendChild(v); }
    var t = document.createElement('button'); t.id = 'v360-tema'; t.type = 'button'; t.title = 'Mudar o fundo'; t.setAttribute('aria-label', 'Mudar o fundo');
    t.onclick = function () { aplicar(atual() === 'claro' ? 'escuro' : 'claro'); };
    box.appendChild(t); document.body.appendChild(box);
    t.innerHTML = atual() === 'claro' ? '🌙<span> Escuro</span>' : '☀️<span> Claro</span>';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar); else montar();
})();
