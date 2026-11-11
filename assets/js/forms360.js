/* Prova 03/11: preencher dentro do quadro, lembrar dados, completar enquanto digita */
(function(){
const $=id=>document.getElementById(id);
const CAMPOS={nome:['Nome completo do tutor','name','text'],pet:['Nome do pet','off','text'],tel:['WhatsApp com DDD','tel-national','tel'],email:['E-mail','email','email'],
  cpf:['CPF','off','numeric'],cep:['CEP','postal-code','numeric'],end:['Endereço (preenche pelo CEP)','street-address','text'],num:['Número e complemento','address-line2','text'],ind:['Indicado por (opcional)','off','text']};
// 1) rótulo dentro do quadro
for(const [id,[rot,ac,im]] of Object.entries(CAMPOS)){const el=$(id);if(!el)continue;const w=document.createElement('div');w.className='fl';el.parentNode.insertBefore(w,el);w.appendChild(el);
  const l=document.createElement('label');l.htmlFor=id;l.textContent=rot;w.appendChild(l);const s=document.createElement('span');s.className='st';s.setAttribute('aria-hidden','true');w.appendChild(s);
  el.placeholder=' ';el.setAttribute('autocomplete',ac);if(im==='numeric')el.inputMode='numeric';if(im==='tel')el.type='tel';if(im==='email'){el.type='email';el.autocapitalize='off'}}
for(const id of ['pag','como']){const el=$(id);if(!el)continue;const w=document.createElement('div');w.className='fl tem';el.parentNode.insertBefore(w,el);w.appendChild(el);const l=document.createElement('label');l.htmlFor=id;l.textContent=id==='pag'?'Como pagar a adesão':'Como conheceu o plano';w.appendChild(l)}
const fl=id=>$(id)&&$(id).closest('.fl');
const marca=(id,ok,dica)=>{const w=fl(id);if(!w)return;w.classList.toggle('ok',ok===true);w.classList.toggle('erro',ok===false);let d=w.querySelector('.dica');if(dica){if(!d){d=document.createElement('span');d.className='dica';w.appendChild(d)}d.textContent=dica}else if(d)d.remove()};
// 2) máscaras e validação na hora
const cpfOk=c=>{c=c.replace(/\D/g,'');if(c.length!==11||/^(\d)\1+$/.test(c))return false;let s=0;for(let i=0;i<9;i++)s+=+c[i]*(10-i);let d=(s*10)%11%10;if(d!==+c[9])return false;s=0;for(let i=0;i<10;i++)s+=+c[i]*(11-i);return (s*10)%11%10===+c[10]};
$('cpf')&&$('cpf').addEventListener('input',e=>{let d=e.target.value.replace(/\D/g,'').slice(0,11);e.target.value=d.replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})\.(\d{3})(\d)/,'$1.$2.$3').replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/,'$1.$2.$3-$4');
  marca('cpf',d.length<11?null:cpfOk(d),d.length===11&&!cpfOk(d)?'Confira o CPF: os dígitos não batem.':'')});
$('tel')&&$('tel').addEventListener('input',e=>{let d=e.target.value.replace(/\D/g,'').replace(/^55(?=\d{10,11}$)/,'').slice(0,11);e.target.value=d.length>10?`(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`:d.length>6?`(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`:d.length>2?`(${d.slice(0,2)}) ${d.slice(2)}`:d;
  marca('tel',d.length<10?null:d.length===11&&d[2]==='9'||d.length===10,'')});
const nomeBonito=v=>v.toLowerCase().replace(/(^|\s)(\S)/g,(m,a,b)=>a+b.toUpperCase()).replace(/\b(Da|De|Do|Das|Dos|E)\b/g,m=>m.toLowerCase());
for(const id of ['nome','pet'])$(id)&&$(id).addEventListener('blur',e=>{if(e.target.value.trim()){e.target.value=nomeBonito(e.target.value.trim());marca(id,id==='nome'?e.target.value.split(' ').length>1:true,id==='nome'&&e.target.value.split(' ').length<2?'Escreva o nome completo (nome e sobrenome).':'')}});
// 3) e-mail: completa o domínio enquanto digita
const DOM=['gmail.com','hotmail.com','outlook.com','icloud.com','yahoo.com.br','live.com','uol.com.br','bol.com.br'];
if($('email')){const w=fl('email'),box=document.createElement('div');box.className='sug';w.appendChild(box);
  $('email').addEventListener('input',e=>{const v=e.target.value.trim();const at=v.indexOf('@');box.innerHTML='';if(!v||(at>0&&v.slice(at+1).includes('.')&&DOM.some(d=>v.endsWith('@'+d)))){marca('email',/^\S+@\S+\.\S+$/.test(v)||null,'');return}
    const u=at<0?v:v.slice(0,at),pf=at<0?'':v.slice(at+1);DOM.filter(d=>d.startsWith(pf)).slice(0,4).forEach(d=>{const b=document.createElement('button');b.type='button';b.textContent=u+'@'+d;b.onclick=()=>{$('email').value=u+'@'+d;box.innerHTML='';marca('email',true,'');salvar();$('cpf')?.focus()};box.appendChild(b)});
    marca('email',/^\S+@\S+\.\S+$/.test(v)||null,'')})}
// 4) progresso
const OBR=['nome','pet','tel','email','cpf','cep','end','num'];
const prog=document.createElement('div');prog.className='prog';prog.innerHTML='<span style="font-size:13px;color:var(--mist)">Seu cadastro</span><div class="tr"><i></i></div><b id="progTxt">0%</b>';
const form=$('form');form.parentNode.insertBefore(prog,form);
const atualiza=()=>{const n=OBR.filter(id=>$(id)&&$(id).value.trim()).length+($('aceite')?.checked?1:0);const p=Math.round(n/(OBR.length+1)*100);prog.querySelector('i').style.width=p+'%';$('progTxt').textContent=p===100?'Pronto para fechar ✓':`${p}% · faltam ${OBR.length+1-n}`};
// 5) lembrar meus dados neste aparelho (só com permissão)
const CH='pe360_cadastro';const lem=document.createElement('label');lem.className='lembrar full';lem.innerHTML='<input type="checkbox" id="lembrar" checked> <span><b style="color:var(--ink)">Lembrar meus dados neste aparelho</b> – se sair da página, continua de onde parou. Nada vai para a internet até você enviar. CPF nunca é guardado.</span>';
$('aceite').closest('label').before(lem);
const LIST=['nome','pet','tel','email','cep','end','num','ind'];
function salvar(){try{if(!$('lembrar').checked){localStorage.removeItem(CH);return}const o={t:Date.now()};LIST.forEach(id=>o[id]=$(id)?.value||'');localStorage.setItem(CH,JSON.stringify(o))}catch(_){}atualiza()}
form.addEventListener('input',salvar);form.addEventListener('change',salvar);$('lembrar').addEventListener('change',salvar);
try{const o=JSON.parse(localStorage.getItem(CH)||'null');if(o&&o.nome){const v=document.createElement('div');v.className='volta';
  v.innerHTML=`<p>👋 <b>Olá, ${nomeBonito(o.nome).split(' ')[0]}!</b> Você começou o cadastro${o.pet?' do '+nomeBonito(o.pet):''}. Quer continuar de onde parou?</p><button type="button" class="btn" id="voltaSim">Continuar</button><button type="button" class="btn ghost" id="voltaNao">Começar do zero</button>`;
  prog.after(v);$('voltaSim').onclick=()=>{LIST.forEach(id=>{if($(id)&&o[id]){$(id).value=o[id];$(id).dispatchEvent(new Event('input',{bubbles:true}))}});v.remove();atualiza();(OBR.map($).find(e=>e&&!e.value)||$('aceite')).focus()};
  $('voltaNao').onclick=()=>{try{localStorage.removeItem(CH)}catch(_){}v.remove()}}}catch(_){}
const dica=document.createElement('p');dica.className='full autofill-dica';dica.innerHTML='💡 No celular, toque em <b>“Preencher automaticamente”</b> e tudo entra de uma vez.';
form.querySelector('.etapa').after(dica);
$('aceite').addEventListener('change',atualiza);atualiza();
// 6) CEP: marca ok quando achar o endereço
$('cep')&&$('cep').addEventListener('input',()=>{const d=$('cep').value.replace(/\D/g,'');marca('cep',d.length===8?true:null,'');setTimeout(()=>{if($('end').value)fl('end').classList.add('ok');atualiza()},1500)});
// etiqueta da prova

})();
/* raça: abre e seleciona em lista (CEO 03/11) */
(function(){const $=id=>document.getElementById(id);const busca=$('racaBusca'),lista=$('racaLista'),sel=$('raca');if(!busca||!lista||!sel)return;
const cel=busca.parentNode;const lab=cel.querySelector('.dlab');if(lab)lab.style.display='none';
const rc=document.createElement('div');rc.className='rc';rc.innerHTML='<button type="button" class="rc-bt" aria-haspopup="listbox" aria-expanded="false"><span class="rc-l">Raça do pet</span><span class="rc-v vazio">Toque para escolher na lista</span></button><div class="rc-p" hidden></div>';
cel.insertBefore(rc,busca);const bt=rc.querySelector('.rc-bt'),pn=rc.querySelector('.rc-p'),vl=rc.querySelector('.rc-v');pn.appendChild(busca);pn.appendChild(lista);busca.placeholder='Digite para filtrar (ex.: Shih-tzu, SRD, Persa)';
const mostra=()=>{const v=sel.value;vl.textContent=v||'Toque para escolher na lista';vl.classList.toggle('vazio',!v)};
const abre=a=>{pn.hidden=!a;rc.classList.toggle('aberto',a);bt.setAttribute('aria-expanded',a);if(a){busca.value='';busca.dispatchEvent(new Event('input',{bubbles:true}));setTimeout(()=>{(lista.querySelector('[aria-pressed="true"]')||lista.querySelector('button'))?.scrollIntoView({block:'nearest'});if(matchMedia('(pointer:fine)').matches)busca.focus()},30)}};
bt.addEventListener('click',()=>abre(pn.hidden));
lista.addEventListener('click',e=>{if(e.target.closest('button'))setTimeout(()=>{mostra();abre(false);bt.focus()},0)});
sel.addEventListener('change',mostra);document.addEventListener('click',e=>{if(!rc.contains(e.target))abre(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!pn.hidden){abre(false);bt.focus()}});
document.querySelectorAll('[data-fsp],[data-sp]').forEach(b=>b.addEventListener('click',()=>setTimeout(mostra,0)));mostra();})();
/* Pet Excellence 360 + pagamento com menos texto (CEO 03/11) */
(function(){const $=id=>document.getElementById(id);
const lg=document.querySelector('.hero .logo');if(lg){const w=document.createElement('div');w.className='pe360';w.setAttribute('role','img');w.setAttribute('aria-label','Pet Excellence 360 – plano de saúde pet');w.innerHTML='<span class="b360">360</span><div class="pe-nome">Pet Excellence <span class="gt">360</span><span class="pe-sub">PLANO DE SAÚDE PET</span></div>';lg.parentNode.insertBefore(w,lg);lg.style.display='none';const fr=document.createElement('p');fr.className='frase-cred';fr.innerHTML='O plano de saúde com a <b>credibilidade da Univet</b>.';w.after(fr)}
document.title='Pet Excellence 360 – plano de saúde pet';
const e2=$('etapa2');if(e2&&e2.querySelector('small'))e2.querySelector('small').textContent='Falta CPF, endereço e como pagar.';
const sel=$('pag');if(sel){const fl=sel.closest('.fl')||sel.parentNode;const OP=[['Pix hoje','Adesão = 1 mensalidade · exames de sangue sem carência'],['Cartão de crédito','Adesão + mensalidade no link seguro'],['Na recepção','Paga a adesão na Univet']];
  const box=document.createElement('div');box.className='pagopc full';box.setAttribute('role','group');box.setAttribute('aria-label','Como pagar a adesão');
  OP.forEach(([t,s],i)=>{const b=document.createElement('button');b.type='button';b.innerHTML=`${t}<span>${s}</span>`;b.setAttribute('aria-pressed',sel.selectedIndex===i);b.onclick=()=>{sel.selectedIndex=i;sel.dispatchEvent(new Event('change',{bubbles:true}));box.querySelectorAll('button').forEach((x,j)=>x.setAttribute('aria-pressed',j===i))};box.appendChild(b)});
  const cel=fl.parentNode;cel.classList.add('full');cel.insertBefore(box,fl);fl.style.display='none';
  const lab=document.createElement('span');lab.className='dlab';lab.textContent='Como pagar a adesão';cel.insertBefore(lab,box)}
const px=$('pixBox');if(px){px.classList.add('curto');const sp=px.querySelectorAll(':scope>span');if(sp[0])sp[0].innerHTML='<b style="color:var(--ink)">Pix da adesão (1 mensalidade)</b> · pague hoje e os exames de sangue (Platinum e Black) ficam sem carência.';if(sp[1])sp[1].textContent='Depois, a mensalidade vai para o cartão no link seguro.';const cp=$('copyPix');if(cp)cp.textContent='Copiar chave'}
const ct=$('cartaoBox');if(ct){ct.classList.add('curto');const sp=ct.querySelector('span');if(sp)sp.innerHTML='<b style="color:var(--ink)">Cartão</b> · adesão + 1ª mensalidade no link seguro do Asaas. O cartão é digitado só lá.'}
const nt=document.querySelector('#form .note');if(nt)nt.innerHTML='Nenhum pagamento é feito nesta página. WhatsApp: <span class="phone">(27) 98158-4468</span>.';
})();
/* credibilidade da Univet + logo nova no rodapé (CEO 03/11) */
(function(){const UV='assets/img/logo-univet-branca.webp';
const LOGO='<div class="pe360" role="img" aria-label="Pet Excellence 360"><span class="b360">360</span><div class="pe-nome">Pet Excellence <span class="gt">360</span><span class="pe-sub">PLANO DE SAÚDE PET</span></div></div>';
const az=document.querySelector('section.autz'),ass=document.getElementById('assinar');if(az&&ass){const s=document.createElement('section');s.className='cred';s.id='quem';s.setAttribute('aria-label','A credibilidade da Univet');
 s.innerHTML='<div class="wrap"><div class="box"><figure class="fach"><img src="assets/img/fachada-univet-sm.webp" alt="Fachada da Univet Vitória, em Jardim Camburi"><figcaption><img src="'+UV+'" alt="Univet Vitória"></figcaption></figure><div><p class="kicker">QUEM ESTÁ POR TRÁS</p><h2>O plano de saúde com a <span class="gt">credibilidade da Univet</span>.</h2><ul><li><b>Mais de 15 anos</b> em Jardim Camburi</li><li><b>Veterinária especializada 24 horas</b>, todos os dias</li><li><b>Mais de 1.000 cirurgias</b> por ano</li><li><b>Tudo no mesmo lugar</b>: consulta, exames, internação e centro cirúrgico</li><li><b>Revista Científica Univet</b> e <b>boletins técnicos semanais</b> para a equipe</li><li><b>Condutas atualizadas</b> pelas diretrizes internacionais</li><li><b>Ciência que vira cuidado</b></li></ul></div></div></div>';
 ass.before(s);const m=document.createElement('section');m.className='cred-mini';m.setAttribute('aria-label','Credibilidade da Univet');m.innerHTML='<div class="wrap"><a class="cm" href="#quem"><img src="assets/img/fachada-univet-sm.webp" alt="Fachada da Univet"><span class="cm-t">O plano de saúde com a <b>credibilidade da Univet</b><small>Veterinária especializada 24 h · Revista Científica Univet · Ciência que vira cuidado</small></span><span class="cm-v">Quem está por trás ↓</span></a></div>';az.after(m)}
const ft=document.querySelector('footer.wrap > img.logo');if(ft){const w=document.createElement('div');w.className='rod360';w.innerHTML=LOGO+'<span class="sep"></span><img src="'+UV+'" alt="Univet Vitória"><p class="frase-cred" style="flex-basis:100%;margin:0">Pet Excellence 360: o plano de saúde com a <b>credibilidade da Univet</b>.</p>';ft.parentNode.insertBefore(w,ft);ft.style.display='none'}
})();
/* "Feche em 2 minutos": opções curtas e selo de pagamento seguro (CEO 03/11) */
(function(){const $=id=>document.getElementById(id);
const IC={compra:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3.5h2.6l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L21 7.5H6.2"/></svg>',
 wa:'<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>'};
const TX={compra:['Comprar por aqui','Contrato pronto na hora'],wa:['Fechar pelo WhatsApp','A equipe conclui com você']};
document.querySelectorAll('.opc button[data-modo]').forEach(b=>{const m=b.dataset.modo;if(!TX[m])return;b.innerHTML=`<span class="ic">${IC[m]}</span><span><b>${TX[m][0]}</b><small>${TX[m][1]}</small></span>`});
const sh=document.querySelector('#assinar .sec-head p:not(.kicker)');if(sh)sh.textContent='Escolha como prefere fechar.';
const LOCK='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
const pg=document.querySelector('.pagopc');if(pg){const s=document.createElement('div');s.className='selo full';s.innerHTML=`<span class="cad">${LOCK}</span><div><b>Pagamento 100% seguro</b><span>Cartão só na página segura do Asaas. Nenhum dado de cartão passa por aqui.</span></div>`;pg.after(s)}
const cp=$('comprar');if(cp){const m=document.createElement('span');m.className='selo-mini full';m.innerHTML=LOCK.replace('18','14').replace('18','14')+' Compra segura · Asaas';cp.closest('.actions').after(m)}
})();
/* faixas de peso do formulário: até 15 · acima de 15 · acima de 25 (CEO 03/11) */
(function(){const bs=document.querySelectorAll('#pesos [data-kg]');if(bs.length<5)return;
const set=(b,kg,t)=>{b.dataset.kg=kg;b.textContent=t};set(bs[0],'10','Até 15 kg');set(bs[3],'20','Acima de 15 kg');set(bs[4],'30','Acima de 25 kg');bs[1].hidden=true;bs[2].hidden=true;
const p=document.getElementById('pesos');p.insertBefore(bs[0],p.firstChild);})();
