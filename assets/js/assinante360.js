/* Área do assinante na página (CEO, 11/11/2026): o cliente vê na hora, sem pedir no WhatsApp.
   Abre a área do assinante do Univet 360 aqui mesmo; CPF e final do celular vão por mensagem segura (nunca na URL).
   O WhatsApp só aparece lá dentro, se ele disser que não resolveu, teve dúvida ou dificuldade. */
(function(){
  var URL_AREA='https://gestao.univetvitoria.com.br/assinante', ORIGEM='https://gestao.univetvitoria.com.br';
  var MAPA={'Carências':'car','Saldo da franquia':'fra','Histórico de atendimentos':'his','Quanto economizei':'eco','Relatório completo em PDF':'pdf','Demonstrativo: plano × particular':'dem','2ª via da mensalidade':'seg','Cadastrar ou trocar o cartão':'cartao','Assinar o contrato':'contrato','Atualizar meus dados':'dados','Simular o cancelamento':'canc'};
  function $(i){return document.getElementById(i)}
  var b=$('cEnviar'); if(!b) return;
  var nb=b.cloneNode(true); nb.textContent='Ver agora'; b.replaceWith(nb);
  var t=$('cTel'); if(t) t.addEventListener('input',function(e){e.target.value=e.target.value.replace(/\D/g,'').slice(0,4)});
  var box=$('cArea'), fr=null, pend=null;
  addEventListener('message',function(ev){ if(ev.origin!==ORIGEM||!fr||ev.source!==fr.contentWindow) return;
    var d=ev.data||{};
    if(d.tipo==='u360-pronto'&&pend){ fr.contentWindow.postMessage(pend,ORIGEM); pend=null; }
    if(d.tipo==='u360-altura'&&d.h) fr.style.height=Math.max(420,Math.min(6000,d.h+8))+'px';
  });
  nb.addEventListener('click',function(){
    var cpf=($('cCpf').value||'').replace(/\D/g,''), t4=(t&&t.value||'').replace(/\D/g,'');
    if(cpf.length!==11||t4.length!==4){ $('cErr').textContent='Informe o CPF do titular e os 4 últimos números do celular do cadastro.'; $('cErr').hidden=false; return; }
    $('cErr').hidden=true;
    var ver=[].slice.call(document.querySelectorAll('#cQuer button[aria-pressed="true"]')).map(function(x){return MAPA[x.textContent.trim()]}).filter(Boolean);
    pend={tipo:'u360-assinante',cpf:cpf,t4:t4,ver:ver};
    if(!fr){ fr=document.createElement('iframe'); fr.title='Área do assinante Pet Excellence 360'; fr.src=URL_AREA+'?embed=1&ver='+ver.join(',');
      fr.style.cssText='width:100%;height:640px;border:0;border-radius:20px;background:#050B1A;display:block'; box.appendChild(fr); }
    else { fr.contentWindow.postMessage(pend,ORIGEM); pend=null; }
    box.hidden=false; box.scrollIntoView({behavior:'smooth',block:'start'});
  });
})();
