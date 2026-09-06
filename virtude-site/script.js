/* =====================================================================
   Igreja Virtude — script principal
   - Carrega o conteúdo de dados.json (fixo)
   - Se config.js tiver a chave do Google, LIGA o modo automático:
       • Mensagens  -> últimos vídeos do YouTube do canal
       • Agenda     -> eventos da Google Agenda pública
   - Sem chave (ou se a API falhar), usa o conteúdo fixo. Nunca quebra.
   ===================================================================== */
(function () {
  "use strict";

  var MES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  var DIAS = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];

  /* ---------- ícones (SVG inline) ---------- */
  var I = {
   KIDS:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="6" r="2.4"/><path d="M12 9v6M8 12h8M9 20l3-5 3 5"/></svg>',
   TEEN:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15.5 20c.2-1.8 1.4-3.2 3-3.6"/></svg>',
   WOMEN:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c2.8 0 5 2.2 5 5 0 3.5-3 5.2-4 6h-2c-1-.8-4-2.5-4-6 0-2.8 2.2-5 5-5Z"/><path d="M9 20h6M10 17h4"/></svg>',
   MUSIC:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/></svg>',
   HOUSE:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11l8-6 8 6M6 10v9h12v-9"/><path d="M12 19v-4a2 2 0 0 1 4 0"/></svg>',
   BOOK:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M12 6v9"/></svg>',
   HEART:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-9.3A3.7 3.7 0 0 1 12 8a3.7 3.7 0 0 1 7 2.7C19 15.6 12 20 12 20Z"/></svg>',
   HANDS:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v7M9 5l3-2 3 2M5 13c0 4 3 8 7 8s7-4 7-8l-3 1-4-2-4 2z"/></svg>',
   GLOBE:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18"/></svg>',
   PLAY:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l11-7z"/></svg>'
  };

  var PAGES = [['inicio','Início'],['sobre','Quem Somos'],['ministerios','Ministérios'],['agenda','Agenda'],['mensagens','Mensagens'],['contato','Contato']];

  /* ---------- montadores de HTML ---------- */
  function evHTML(e){
    var meta = (e.meta||[]).filter(Boolean).map(function(m,i){return '<span>'+(i?'· ':'')+m+'</span>';}).join('');
    return '<div class="ev"><div class="date"><div class="d">'+e.d+'</div><div class="m">'+e.m+'</div></div>'+
           '<div><h3>'+e.t+'</h3><div class="meta">'+meta+'</div></div>'+
           (e.p ? '<span class="pill">'+e.p+'</span>' : '')+'</div>';
  }
  function msgHTML(m){
    return '<a class="msg" href="https://www.youtube.com/watch?v='+m.id+'" target="_blank" rel="noopener">'+
           '<div class="thumb"><img src="'+m.co+'" alt="" loading="lazy"><div class="play">'+I.PLAY+'</div></div>'+
           '<div class="body"><div class="s">'+m.s+'</div><h3>'+m.t+'</h3><div class="who">'+m.who+'</div></div></a>';
  }
  function minHTML(m){
    return '<article class="min"><div class="ic">'+(I[m.i]||'')+'</div><div><h3>'+m.t+'</h3><p>'+m.x+'</p><div class="tagm">'+m.g+'</div></div></article>';
  }
  function valHTML(v){
    return '<article class="min"><div class="ic">'+(I[v.i]||'')+'</div><div><h3>'+v.t+'</h3><p>'+v.x+'</p></div></article>';
  }

  function render(dados, eventos, mensagens){
    var set = function(id, html){ var el=document.getElementById(id); if(el) el.innerHTML=html; };
    set('agendaHome', (eventos||[]).slice(0,4).map(evHTML).join(''));
    set('agendaFull', (eventos||[]).map(evHTML).join(''));
    set('msgsHome',   (mensagens||[]).slice(0,6).map(msgHTML).join(''));
    set('msgsFull',   (mensagens||[]).map(msgHTML).join(''));
    set('minFull',    (dados.ministerios||[]).map(minHTML).join(''));
    set('valuesGrid', (dados.valores||[]).map(valHTML).join(''));
  }

  /* ---------- auto-sync: YouTube ---------- */
  function fmtDate(iso){ try{ var d=new Date(iso); return String(d.getDate()).padStart(2,'0')+' · '+MES[d.getMonth()]+' · '+d.getFullYear(); }catch(e){ return 'Virtude.tv'; } }
  function parseYT(raw, publishedAt){
    var parts = (raw||'').split('|').map(function(s){return s.trim();}).filter(Boolean);
    if(parts.length && /igreja\s*virtude/i.test(parts[0])) parts.shift();
    var dateStr='';
    if(parts.length && /^\d{2}\/\d{2}\/\d{4}$/.test(parts[parts.length-1])) dateStr=parts.pop();
    var title = parts.length ? parts[parts.length-1] : raw;
    var who;
    if(parts.length>=2) who = parts[0];
    else if(dateStr){ var p=dateStr.split('/'); who = p[0]+' · '+MES[(+p[1]||1)-1]+' · '+p[2]; }
    else who = fmtDate(publishedAt);
    var s = /domingo/i.test(raw)?'Domingo':(/quarta/i.test(raw)?'Quarta':'Virtude.tv');
    return { s:s, t:title, who:who };
  }
  function fetchYouTube(cfg){
    var pl = 'UU' + cfg.youtubeChannelId.slice(2); // playlist de uploads do canal
    var url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=12&playlistId='+pl+'&key='+cfg.googleApiKey;
    return fetch(url).then(function(r){return r.json();}).then(function(d){
      if(!d.items) throw new Error(d.error ? d.error.message : 'sem items');
      return d.items.filter(function(it){
        var t = it.snippet && it.snippet.title;
        return it.snippet && it.snippet.resourceId && t && t!=='Private video' && t!=='Deleted video';
      }).slice(0,9).map(function(it){
        var sn=it.snippet, th=sn.thumbnails||{};
        var cover=(th.maxres||th.standard||th.high||th.medium||th.default||{}).url||'';
        var p=parseYT(sn.title, sn.publishedAt);
        return { s:p.s, t:p.t, who:p.who, id:sn.resourceId.videoId, co:cover };
      });
    });
  }

  /* ---------- auto-sync: Google Agenda ---------- */
  function fetchCalendar(cfg){
    var now = new Date().toISOString();
    var url = 'https://www.googleapis.com/calendar/v3/calendars/'+encodeURIComponent(cfg.calendarId)+
              '/events?key='+cfg.googleApiKey+'&timeMin='+encodeURIComponent(now)+
              '&singleEvents=true&orderBy=startTime&maxResults=8';
    return fetch(url).then(function(r){return r.json();}).then(function(d){
      if(!d.items) throw new Error(d.error ? d.error.message : 'sem eventos');
      return d.items.map(function(ev){
        var iso = (ev.start && (ev.start.dateTime || ev.start.date)) || '';
        var dt = new Date(iso);
        var hora = (ev.start && ev.start.dateTime)
          ? DIAS[dt.getDay()]+' · '+String(dt.getHours()).padStart(2,'0')+'h'+(dt.getMinutes()?String(dt.getMinutes()).padStart(2,'0'):'')
          : DIAS[dt.getDay()];
        return { d:String(dt.getDate()).padStart(2,'0'), m:MES[dt.getMonth()], t:ev.summary||'Evento',
                 meta:[hora, ev.location||'Igreja Virtude'], p:'' };
      });
    });
  }

  /* ---------- carregar tudo ---------- */
  function loadData(){
    var cfg = window.VIRTUDE_CONFIG || {};
    fetch('dados.json').then(function(r){return r.json();}).catch(function(e){
      console.error('dados.json não carregou', e);
      return { agenda:[], ministerios:[], valores:[], mensagens:[] };
    }).then(function(dados){
      var eventos = dados.agenda || [];
      var mensagens = dados.mensagens || [];
      var tasks = [];
      if(cfg.googleApiKey && cfg.calendarId){
        tasks.push(fetchCalendar(cfg).then(function(ev){ if(ev && ev.length) eventos=ev; })
          .catch(function(e){ console.warn('Agenda automática indisponível — usando conteúdo fixo.', e); }));
      }
      if(cfg.googleApiKey && cfg.youtubeChannelId){
        tasks.push(fetchYouTube(cfg).then(function(ms){ if(ms && ms.length) mensagens=ms; })
          .catch(function(e){ console.warn('Mensagens automáticas indisponíveis — usando conteúdo fixo.', e); }));
      }
      Promise.all(tasks).then(function(){ render(dados, eventos, mensagens); });
    });
  }

  /* ---------- navegação / menus ---------- */
  var menu = document.getElementById('menu'),
      mob  = document.getElementById('mobMenu'),
      foot = document.getElementById('footNav');
  PAGES.forEach(function(p){
    if(menu) menu.insertAdjacentHTML('beforeend','<button data-p="'+p[0]+'" onclick="VIRTUDE.go(\''+p[0]+'\')">'+p[1]+'</button>');
    if(mob)  mob.insertAdjacentHTML('beforeend','<button data-p="'+p[0]+'" onclick="VIRTUDE.go(\''+p[0]+'\')">'+p[1]+'</button>');
    if(foot) foot.insertAdjacentHTML('beforeend','<a onclick="VIRTUDE.go(\''+p[0]+'\')">'+p[1]+'</a>');
  });

  function go(id){
    document.querySelectorAll('main>section[data-page]').forEach(function(s){ s.classList.toggle('show', s.getAttribute('data-page')===id); });
    document.querySelectorAll('[data-p]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-p')===id); });
    if(mob) mob.classList.remove('open');
    window.scrollTo({top:0, behavior:'auto'});
  }
  var ham = document.getElementById('ham');
  if(ham) ham.addEventListener('click', function(){ if(mob) mob.classList.toggle('open'); });

  /* ---------- tema claro/escuro + troca de logo ---------- */
  var root = document.documentElement, tb = document.getElementById('themeBtn');
  function isDark(){ var c=root.getAttribute('data-theme'); return c==='dark' || (!c && window.matchMedia('(prefers-color-scheme:dark)').matches); }
  function syncLogo(){
    var d = isDark();
    document.querySelectorAll('.lg-light').forEach(function(e){ e.hidden = d; });
    document.querySelectorAll('.lg-dark').forEach(function(e){ e.hidden = !d; });
  }
  if(tb) tb.addEventListener('click', function(){ root.setAttribute('data-theme', isDark() ? 'light' : 'dark'); syncLogo(); });
  try{ window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change', syncLogo); }catch(e){}

  /* expõe go() para os onclick do HTML (ex.: onclick="go('contato')") */
  window.go = go;
  window.VIRTUDE = { go: go };

  /* ---------- start ---------- */
  syncLogo();
  go('inicio');
  loadData();
})();
