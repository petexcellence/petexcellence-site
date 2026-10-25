
const PRICES={ // Anexo II: [porte][faixa] -> preço
  Gold:{p:[69.90,89.90,109.90],g:null},
  Platinum:{p:[89.90,129.90,149.90],g:[129.90,159.90,169.90]},
  Black:{p:[289.90,339.90,399.90],g:[349.90,419.90,489.90]}
};
const INFO={
  Gold:{cb:'Consultas ilimitadas em horário comercial e as vacinas do ano por menos que um café por dia.',tag:'Saúde do dia a dia',items:['Consultas ilimitadas em horário comercial','Vacinas do ano','Medicação ambulatorial','Corte de unha','Desconto em exames de imagem']},
  Platinum:{cb:'Uma internação de 48 h no particular custa a partir de R$ 1.460; no Platinum ela está incluída, após a carência.',tag:'O mais escolhido',items:['Tudo do Gold','Exames de sangue, urina e fezes','Internação com medicação','Limpeza de tártaro','Cirurgia eletiva com anestesia']},
  Black:{cb:'Semi-intensiva incluída e reembolso de até R$ 500 por ano em qualquer clínica.',tag:'Cobertura completa',items:['Tudo do Platinum','Internação semi-intensiva','Reembolso de até R$ 500 por ano','Urgência fora do horário sem carência']}
};
const WA='5527981584468';
const AGES=['até 6 anos','de 7 a 11 anos','12 anos ou mais'];
const $=id=>document.getElementById(id);
let state={sp:'Cão',band:0,big:false,pick:null};
const band=()=>state.band;
const bandTxt=['Faixa jovem, até 6 anos e 11 meses','Faixa adulto, de 7 a 11 anos e 11 meses','Faixa sênior, a partir de 12 anos'];
const brl=v=>'R$ '+v.toFixed(2).replace('.',',');
function price(t){const tab=state.big?PRICES[t].g:PRICES[t].p;return tab?tab[state.band]:null}
function recommend(){return state.band===2?'Black':'Platinum'}
function render(){
  const rec=recommend(); if(!state.pick)state.pick=rec;
  const box=$('plans'); box.textContent='';
  ['Gold','Platinum','Black'].forEach(t=>{
    const v=price(t), el=document.createElement('article'); el.className='plan'+(t===rec?' on':''); el.dataset.tier=t;
    el.innerHTML=(t===rec?'<span class="rec">RECOMENDADO PARA ESTA FAIXA</span>':'')+
      '<div><div class="name"></div><div class="tag"></div></div><div class="price"></div><ul></ul><button type="button" class="pick"></button>';
    el.querySelector('.name').textContent=t; el.querySelector('.tag').textContent=INFO[t].tag;
    el.querySelector('.price').innerHTML=v?'<small>por mês</small><b></b>':'<small>porte acima de 15 kg</small><em>consulte a recepção</em>';
    if(v)el.querySelector('.price b').textContent=brl(v);
    INFO[t].items.forEach(i=>{const li=document.createElement('li');li.textContent=i;el.querySelector('ul').appendChild(li)});
    if(v){const pd=document.createElement('p');pd.className='perday';pd.innerHTML='<b></b> <span></span>';pd.querySelector('b').textContent=brl(v/30)+' por dia.';pd.querySelector('span').textContent=INFO[t].cb;el.insertBefore(pd,el.querySelector('.pick'))}
    const btn=el.querySelector('.pick'); btn.setAttribute('aria-pressed',String(state.pick===t)); btn.textContent=state.pick===t?'Plano escolhido':'Escolher '+t;
    btn.addEventListener('click',()=>{state.pick=t;render();document.getElementById('assinar').scrollIntoView({behavior:'smooth'})});
    box.appendChild(el);
  });
  const v=price(state.pick);
  $('summary').innerHTML='Plano <b></b> para '+(state.sp==='Cão'?'cão':'gato')+', '+AGES[state.band]+', '+(state.big?'acima de 15 kg':'até 15 kg')+(v?': <b></b> por mês.':'.');
  const bs=$('summary').querySelectorAll('b'); bs[0].textContent=state.pick; if(bs[1])bs[1].textContent=brl(v);
}
const RACAS={'Cão':['Sem raça definida (SRD)','Tenho dúvidas','Shih-tzu','Yorkshire','Lhasa apso','Poodle','Spitz alemão','Maltês','Pinscher','Dachshund','Buldogue francês','Pug','Beagle','Border collie','Labrador','Golden retriever','Pastor alemão','Rottweiler','Pit bull','Husky siberiano','Outra'],'Gato':['Sem raça definida (SRD)','Tenho dúvidas','Persa','Siamês','Maine coon','Angorá','Ragdoll','Sphynx','British shorthair','Outra']};
function fillRacas(){const r=$('raca');const cur=r.value;r.textContent='';const o0=document.createElement('option');o0.value='';o0.textContent='Raça do pet';r.appendChild(o0);RACAS[state.sp].forEach(x=>{const o=document.createElement('option');o.textContent=x;r.appendChild(o)});if(RACAS[state.sp].includes(cur))r.value=cur}
function campos(){const v=price(state.pick);return {plano:state.pick,valor:v?v.toFixed(2):'',especie:state.sp,faixa:AGES[state.band],porte:state.big?'acima de 15 kg':'até 15 kg',tutor:$('nome').value.trim(),tel:$('tel').value.trim(),cpf:$('cpf').value.trim(),email:$('email').value.trim(),cep:$('cep').value.trim(),end:$('end').value.trim(),num:$('num').value.trim(),anos:state.anos,kg:state.kg,sim:new Date().toLocaleDateString('sv-SE'),aceite:$('aceite').checked?aceiteAgora():'',pet:$('pet').value.trim(),raca:$('raca').value,sexo:state.sexo||'',nasc:$('nasc').value,saude:saudeTxt(),pag:$('pag').value,como:$('como').value,ind:$('ind').value.trim()}}
function message(){
  const c=campos(), v=price(state.pick);
  const code='PE1|'+Object.entries(c).map(([k,x])=>k+'='+encodeURIComponent(x||'')).join('|');
  return 'Olá! Quero assinar o Plano de Saúde Pet Excellence.\n'+
   'Plano: '+c.plano+(v?' ('+brl(v)+'/mês)':'')+'\n'+
   'Pet: '+(c.pet||'-')+' · '+c.especie+' · '+(c.raca||'raça não informada')+' · '+c.anos+' anos · '+c.kg+' kg\n'+
   (c.sexo?'Sexo: '+c.sexo+'\n':'')+(c.saude?'Saúde: '+c.saude+'\n':'')+'Tutor: '+(c.tutor||'-')+' · '+(c.tel||'')+'\n'+
   (/Pix/.test(c.pag)&&/Platinum|Black/.test(c.plano)?'Simulação em '+new Date().toLocaleDateString('pt-BR')+': pagando a adesão por Pix hoje, exames de sangue sem carência.\n':'')+(c.aceite?'Aceite: Li e concordo com o contrato v'+CV_VERSAO+' em '+c.aceite+'.\n':'')+'Cadastro (não apagar): '+code;
}
$('spDog').addEventListener('click',()=>{state.sp='Cão';fillRacas();$('spDog').setAttribute('aria-pressed','true');$('spCat').setAttribute('aria-pressed','false');render()});
$('spCat').addEventListener('click',()=>{state.sp='Gato';fillRacas();$('spCat').setAttribute('aria-pressed','true');$('spDog').setAttribute('aria-pressed','false');render()});
document.querySelectorAll('[data-age]').forEach(b=>b.addEventListener('click',()=>{state.band=+b.dataset.age;{const v=[3,9,13][state.band];state.anos=v;$('rAge').value=v;$('oAge').textContent=v+' anos'}state.pick=null;document.querySelectorAll('[data-age]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render()}));
document.querySelectorAll('[data-wt]').forEach(b=>b.addEventListener('click',()=>{state.big=b.dataset.wt==='1';{const v=state.big?25:8;state.kg=v;$('rWt').value=v;$('oWt').textContent=v+' kg'}document.querySelectorAll('[data-wt]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render()}));

async function buscaCep(raw){const c=String(raw).replace(/\D/g,'');if(c.length!==8)return null;
 const tries=[async()=>{const r=await fetch('https://viacep.com.br/ws/'+c+'/json/');const j=await r.json();if(j.erro)return null;return {rua:j.logradouro,bairro:j.bairro,cidade:j.localidade,uf:j.uf}},
  async()=>{const r=await fetch('https://brasilapi.com.br/api/cep/v1/'+c);if(!r.ok)return null;const j=await r.json();return {rua:j.street,bairro:j.neighborhood,cidade:j.city,uf:j.state}}];
 for(const t of tries){try{const x=await t();if(x)return x}catch(_){}}return false}
$('cep').addEventListener('input',async()=>{const el=$('cep');let d=el.value.replace(/\D/g,'').slice(0,8);el.value=d.length>5?d.slice(0,5)+'-'+d.slice(5):d;if(d.length!==8){$('cepMsg').textContent='';return}
 $('cepMsg').textContent='Buscando endereço…';const a=await buscaCep(d);
 if(a){$('end').value=[a.rua,a.bairro,(a.cidade||'')+(a.uf?'/'+a.uf:'')].filter(Boolean).join(', ');$('cepMsg').textContent='Endereço encontrado. Complete com o número.';$('num').focus()}
 else{$('cepMsg').textContent=a===null?'CEP não encontrado. Confira ou digite o endereço.':'Não foi possível buscar agora. Digite o endereço.'}});
function setBand(n){state.band=n;state.pick=null;document.querySelectorAll('[data-age]').forEach(x=>x.setAttribute('aria-pressed',String(+x.dataset.age===n)))}
function setBig(b){state.big=b;document.querySelectorAll('[data-wt]').forEach(x=>x.setAttribute('aria-pressed',String((x.dataset.wt==='1')===b)))}
state.anos=3;state.kg=8;
$('rAge').addEventListener('input',e=>{const v=+e.target.value;state.anos=v;$('oAge').textContent=v===0?'< 1 ano':(v===20?'20+ anos':v+(v===1?' ano':' anos'));const n=v<7?0:(v<12?1:2);if(n!==state.band)setBand(n);render()});
$('rWt').addEventListener('input',e=>{const v=+e.target.value;state.kg=v;$('oWt').textContent=(v===60?'60+':v)+' kg';setBig(v>15);render()});

function press(sel,b){document.querySelectorAll(sel).forEach(x=>x.setAttribute('aria-pressed',String(x===b)))}
document.querySelectorAll('[data-sexo]').forEach(b=>b.addEventListener('click',()=>{state.sexo=b.dataset.sexo;press('[data-sexo]',b)}));
document.querySelectorAll('[data-doenca]').forEach(b=>b.addEventListener('click',()=>{state.doenca=b.dataset.doenca;press('[data-doenca]',b);$('saudeBox').hidden=state.doenca!=='Sim'}));
document.querySelectorAll('#doencas button').forEach(b=>b.addEventListener('click',()=>b.setAttribute('aria-pressed',String(b.getAttribute('aria-pressed')!=='true'))));
document.querySelectorAll('[data-como]').forEach(b=>b.addEventListener('click',()=>{state.saudeComo=b.dataset.como;press('[data-como]',b);$('saudeDesc').hidden=state.saudeComo!=='desc';if(!$('saudeDesc').hidden)$('saudeDesc').focus()}));
function saudeTxt(){if(state.doenca!=='Sim')return state.doenca||'';const l=[...document.querySelectorAll('#doencas button[aria-pressed="true"]')].map(b=>b.textContent);
 let t='Sim'+(l.length?': '+l.join(', '):'');if(state.saudeComo==='consulta')t+=' (explicar na consulta)';const d=$('saudeDesc').value.trim();if(state.saudeComo==='desc'&&d)t+=' – '+d;return t}
const CAT={
 consulta_hc:{n:'Consulta em horário comercial',G:[0,0,1],P:[0,0,1],B:[0,0,1]},
 consulta_fh:{n:'Consulta fora do horário comercial',G:[1,30,1],P:[1,30,1],B:[1,0,1]},
 vac_can_ad:{n:'Vacina múltipla canina adulto',G:[1,0,1],P:[1,0,1],B:[1,30,1]},
 vac_can_fi:{n:'Vacina múltipla canina filhote',G:[3,0,1],P:[3,0,1],B:[3,0,1]},
 antirrabica:{n:'Vacina antirrábica',G:[1,0,1],P:[1,0,1],B:[1,0,1]},
 vac_fel_ad:{n:'Vacina quádrupla felina adulto',G:[1,0,1],P:[1,0,1],B:[1,0,1]},
 vac_fel_fi:{n:'Vacina quádrupla felina filhote',G:[2,0,1],P:[2,0,1],B:[2,0,1]},
 unha:{n:'Corte de unha',G:[0,0,1],P:[0,0,1],B:[0,0,1]},
 med_amb:{n:'Medicação ambulatorial',G:[4,30,1],P:[4,30,1],B:[4,90,1]},
 sedacao:{n:'Sedação',P:[1,30,1],B:[1,0,1]},
 hemograma:{n:'Hemograma',P:[4,30,1],B:[4,30,1],ex:1},
 creatinina:{n:'Creatinina',P:[4,30,1],B:[4,30,1],ex:1},
 ureia:{n:'Ureia',P:[4,30,1],B:[4,30,1],ex:1},
 glicose:{n:'Glicose',P:[1,30,1],B:[1,30,1],ex:1},
 fa:{n:'Fosfatase alcalina',P:[1,30,1],B:[1,30,1],ex:1},
 proteinas:{n:'Proteínas e frações',P:[1,30,1],B:[1,30,1],ex:1},
 ggt:{n:'GGT',P:[1,30,1],B:[1,30,1],ex:1},
 alt:{n:'ALT',P:[1,30,1],B:[1,30,1],ex:1},
 ast:{n:'AST',P:[1,30,1],B:[1,30,1],ex:1},
 eas:{n:'Urina (EAS)',P:[1,30,1],B:[1,30,1],ex:1},
 copro:{n:'Fezes (coproparasitológico)',P:[1,30,1],B:[1,30,1],ex:1},
 pressao:{n:'Aferição de pressão',P:[1,90,1],B:[1,30,1]},
 internacao:{n:'Internação com medicação (diária)',P:[4,90,1],B:[4,0,1]},
 semi:{n:'Adicional semi-intensiva (diária)',B:[2,120,1]},
 tartaro:{n:'Limpeza de tártaro com anestesia',P:[1,120,1],B:[1,30,1]},
 cir_hc:{n:'Cirurgia eletiva da lista + anestesia (horário comercial)',P:[1,120,1],B:[1,120,1]},
 cir_fh:{n:'Cirurgia + anestesia fora do horário comercial',P:[1,120,.4],B:[1,120,.4]},
 reembolso:{n:'Reembolso (informe o valor em R$ na quantidade)',B:[500,150,1],valor:1}
};
const NAO_COBRE='Quimioterapia, diálise, UTI, transfusão de sangue (no Black, pode ser solicitada por reembolso), semi-intensiva fora do Black, hemogasometria, exames não listados, especialistas, medicamentos de alto custo e para casa, microchip e estética.';

function escH(x){return String(x==null?'':x).replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]))}
const LOGO_CV='assets/img/logo-pet-excellence-sm.webp',FOTO_CV='assets/img/tutora-e-golden-thumb.webp';
// ===== Contrato visual Pet Excellence (versão 2026.10) – usado na página de vendas e no sistema =====
const CV_VERSAO='2026.10c';
function cvEsc(x){return String(x==null?'':x).replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]))}
function cvBrl(v){return 'R$ '+Number(v||0).toFixed(2).replace('.',',')}
function cvData(d){return d?String(d).slice(0,10).split('-').reverse().join('/'):'—'}
const CV_IC={
 hand:'<path d="M4 13l4-4 4 2 4-3 4 4"/><path d="M8 9l-3 7 4 3 3-2 3 2 4-4"/>',
 paw:'<circle cx="7" cy="9" r="1.8"/><circle cx="11" cy="6.5" r="1.8"/><circle cx="15" cy="6.5" r="1.8"/><circle cx="18.5" cy="9.5" r="1.7"/><path d="M8 16c0-3 3-5 4.5-5S17 13 17 16c0 2-2 3-4.5 2.2C10 19 8 18 8 16z"/>',
 doc:'<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 15h5M10 18h3"/>',
 money:'<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9v.01M18 15v.01"/>',
 clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>',
 shield:'<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
 chat:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
 alert:'<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17v.01"/>',
 door:'<path d="M6 3h10v18H6z"/><path d="M16 5l3 1v14l-3 1M13 12v.01"/>',
 x:'<circle cx="12" cy="12" r="8.5"/><path d="M9 9l6 6M15 9l-6 6"/>',
 star:'<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',
 sign:'<path d="M4 19c3-1 4-6 6-6s1 4 3 4 2-3 4-3 2 2 3 2"/><path d="M4 21h16"/>'
};
function cvIcon(k,s){return `<svg viewBox="0 0 24 24" width="${s||22}" height="${s||22}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${CV_IC[k]}</svg>`}
function cvHTML(d,CATX,NAOX,LOGOX,FOTOX){
 const t=(d.plano||'Gold')[0], E=cvEsc;
 const linhas=Object.values(CATX).filter(v=>v[t]);
 const car=v=>{let c=v[t][1];if(v.ex&&d.bonus)c=0;return c};
 // linha do tempo de carências
 const grupos={};linhas.forEach(v=>{const c=car(v);(grupos[c]=grupos[c]||[]).push(v.n.replace(/ \(.*\)$/,''))});
 const tl=Object.keys(grupos).map(Number).sort((a,b)=>a-b).map(c=>`<div class="tl-i"><div class="tl-d">${c===0?'Dia da<br>ativação':c+'<small> dias</small>'}</div><div class="tl-t">${E(grupos[c].slice(0,6).join(', '))}${grupos[c].length>6?' e mais '+(grupos[c].length-6):''}</div></div>`).join('');
 const tab=linhas.map(v=>{const r=v[t];return `<tr><td>${E(v.n.replace(/ \(informe.*\)$/,''))}</td><td>${r[0]===0?'ilimitado':(v.valor?'até R$ 500/ano':r[0]+'/ano')}</td><td>${car(v)===0?'—':car(v)+' dias'}</td><td>${Math.round(r[2]*100)}%</td></tr>`}).join('');
 const ok=(d.aceite&&d.aceite.quando);
 const head=(n)=>`<header class="hd"><img src="${LOGOX}" alt="Pet Excellence" class="lg"><div class="hd-r">Contrato do Plano de Saúde Pet · Plano ${E(d.plano)} · nº ${E(d.numero||'—')} · versão ${CV_VERSAO}</div></header>`;
 const foot=(n)=>`<footer class="ft"><span>Pet Excellence – Plano de Saúde · Univet Vitória, veterinária especializada 24 horas · WhatsApp (27) 98158-4468</span><span>${n}/4</span></footer>`;
 const card=(ic,tit,sub,body,cls)=>`<section class="bx ${cls||''}"><div class="bx-h"><span class="ic">${cvIcon(ic)}</span><div><h2>${tit}</h2>${sub?`<p class="sub">${sub}</p>`:''}</div></div>${body}</section>`;
 return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Contrato Pet Excellence – ${E(d.pet||'pet')}</title>
<style>@font-face{font-family:Poppins;font-weight:400;font-display:swap;src:url(assets/fonts/poppins-latin-400-normal.woff2) format('woff2')}@font-face{font-family:Poppins;font-weight:500;font-display:swap;src:url(assets/fonts/poppins-latin-500-normal.woff2) format('woff2')}@font-face{font-family:Poppins;font-weight:600;font-display:swap;src:url(assets/fonts/poppins-latin-600-normal.woff2) format('woff2')}@font-face{font-family:Poppins;font-weight:700;font-display:swap;src:url(assets/fonts/poppins-latin-700-normal.woff2) format('woff2')}@font-face{font-family:'Cormorant Garamond';font-weight:600;font-display:swap;src:url(assets/fonts/cormorant-garamond-latin-600-normal.woff2) format('woff2')}@font-face{font-family:'Cormorant Garamond';font-weight:700;font-display:swap;src:url(assets/fonts/cormorant-garamond-latin-700-normal.woff2) format('woff2')}</style>
<style>
*{box-sizing:border-box}body{margin:0;background:#E9EEF7;font:400 10.4px/1.45 Poppins,Arial,sans-serif;color:#0D1B5C}
.pg{width:794px;height:1123px;margin:16px auto;background:#fff;position:relative;padding:30px 38px 46px;overflow:hidden;box-shadow:0 2px 14px rgba(13,27,92,.12)}
.pg::before{content:"";position:absolute;right:-90px;top:-90px;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,#E8F5FC 0,#E8F5FC 60%,transparent 61%);z-index:0}
.pg>*{position:relative;z-index:1}
.hd{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #01A1DB;padding-bottom:8px;margin-bottom:12px}.lg{height:30px}.hd-r{font-size:9px;color:#5B6787;text-align:right;max-width:60%}
.ft{position:absolute;left:38px;right:38px;bottom:16px;display:flex;justify-content:space-between;font-size:8px;color:#7a86a6;border-top:1px solid #DDE3EE;padding-top:6px}
.cover{display:grid;grid-template-columns:1fr 150px;gap:16px;align-items:center;margin-bottom:12px}
.cover h1{font:700 30px/1.02 'Cormorant Garamond',Georgia,serif;color:#13288A;margin:0}.cover h1 span{display:block;color:#01A1DB}
.cover p{margin:6px 0 0;font-size:10.5px;color:#33406b}.cover img{width:150px}
.partes{display:grid;grid-template-columns:1fr 46px 1fr;gap:0;align-items:stretch;margin-bottom:12px}
.pt{background:#13288A;color:#fff;border-radius:10px;padding:10px 12px}.pt h3{margin:0 0 4px;font:600 10px Poppins;letter-spacing:.12em;color:#9FDcf3}.pt p{margin:0;font-size:9.6px;line-height:1.45}
.pt.b{background:#01A1DB}.pt.b h3{color:#E8F5FC}.mid{display:flex;align-items:center;justify-content:center;color:#F2B632}
.bx{border:1px solid #D6E2F0;border-radius:10px;padding:10px 12px;margin-bottom:10px;background:#fff}
.bx-h{display:flex;gap:10px;align-items:center;margin-bottom:6px}.ic{flex:0 0 34px;height:34px;border-radius:50%;background:#E8F5FC;color:#13288A;display:flex;align-items:center;justify-content:center}
.bx h2{margin:0;font:600 13px Poppins;color:#13288A;text-transform:uppercase;letter-spacing:.02em}.sub{margin:0;font-size:8.6px;color:#7a86a6}
.bx ul{margin:0;padding-left:16px}.bx li{margin:1.5px 0}.bx p{margin:2px 0}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:10px}.g2 .bx{margin-bottom:0}
.hl{background:#FFF7E3;border:1px solid #F2B632;border-radius:8px;padding:6px 10px;margin-top:6px;font-size:9.8px}.hl b{color:#8a6100}
.pet{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.pet div{background:#F4F8FC;border-radius:6px;padding:5px 7px}.pet b{display:block;font-size:8px;color:#7a86a6;font-weight:500;text-transform:uppercase;letter-spacing:.06em}
.price{display:flex;gap:10px;align-items:stretch}.price .big{background:#13288A;color:#fff;border-radius:8px;padding:8px 12px;min-width:150px}.price .big b{display:block;font:700 24px 'Cormorant Garamond',serif}.price ul{flex:1}
.tl{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:6px;margin-top:4px}.tl-i{border-left:3px solid #01A1DB;background:#F4F8FC;border-radius:0 6px 6px 0;padding:5px 8px}.tl-d{font:700 15px 'Cormorant Garamond',serif;color:#13288A;line-height:1.05}.tl-d small{font:500 9px Poppins}.tl-t{font-size:8.6px;color:#33406b;margin-top:2px}
table{width:100%;border-collapse:collapse;font-size:9px}th{background:#13288A;color:#fff;text-align:left;padding:4px 6px;font-weight:600}td{border-bottom:1px solid #E3E9F3;padding:3.2px 6px;vertical-align:top}tr:nth-child(even) td{background:#F7FAFD}
.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.st{background:#F4F8FC;border-radius:8px;padding:7px;text-align:center}.st .n{width:22px;height:22px;border-radius:50%;background:#01A1DB;color:#fff;font-weight:700;display:inline-flex;align-items:center;justify-content:center;margin-bottom:3px}.st p{margin:0;font-size:8.8px}
.ladder{display:grid;grid-template-columns:repeat(5,1fr);gap:4px}.ladder div{border-radius:6px;padding:5px 6px;font-size:8.6px;background:#F4F8FC}.ladder b{display:block;font-size:10px;color:#13288A}
.ladder div:nth-child(2){background:#FFF7E3}.ladder div:nth-child(3){background:#FDEFE0}.ladder div:nth-child(4),.ladder div:nth-child(5){background:#FBE7E6}
.aceite{border:2px solid #13288A;border-radius:12px;padding:12px 14px;margin-top:10px}.aceite h2{margin:0 0 6px;font:600 13px Poppins;color:#13288A}
.chk{display:flex;gap:8px;align-items:flex-start;font-size:10.5px;font-weight:500}.box{flex:0 0 18px;height:18px;border:2px solid #13288A;border-radius:4px;display:flex;align-items:center;justify-content:center;color:#fff;background:${ok?'#13288A':'#fff'};font-size:13px;line-height:1}
.sig{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-top:22px}.sig div{border-top:1px solid #0D1B5C;padding-top:4px;font-size:9px}
.small{font-size:8.4px;color:#5B6787}
@media print{body{background:#fff}.pg{margin:0;box-shadow:none;page-break-after:always}}
@media screen and (max-width:820px){body{zoom:.5}}@media screen and (max-width:430px){body{zoom:.4}}
</style></head><body>
<div class="pg">${head(1)}
 <div class="cover"><div><h1>Contrato do Plano<span>de Saúde Pet Excellence</span></h1><p>Contrato em linguagem simples e ilustrada. Cada bloco responde a uma pergunta. Ele vale como contrato completo e pode ser aceito no “Li e concordo” ou assinado em plataforma de assinatura eletrônica.</p></div><img src="${FOTOX}" alt=""></div>
 <div class="partes"><div class="pt"><h3>CONTRATADAS</h3><p><b>UNIVET VITÓRIA LTDA</b>, CNPJ 13.350.878/0001-07, e <b>PET EXCELLENCE LTDA</b>, CNPJ 67.311.711/0001-58. Av. Judith Leão Castello Ribeiro, 291, Jardim Camburi, Vitória/ES. Juntas, chamadas de “Pet Excellence”.</p></div><div class="mid">${cvIcon('hand',30)}</div>
 <div class="pt b"><h3>CONTRATANTE (TUTOR)</h3><p><b>${E(d.tutor||'—')}</b>, CPF ${E(d.cpf||'—')}, ${E(d.end||'endereço')}${d.cep?', CEP '+E(d.cep):''}. Telefone ${E(d.tel||'—')} · e-mail ${E(d.email||'—')}</p></div></div>
 ${card('paw','Quem é o pet?','Beneficiário do plano (o contrato vale só para ele)',`<div class="pet"><div><b>Nome</b>${E(d.pet||'—')}</div><div><b>Espécie / raça</b>${E(d.especie||'—')} · ${E(d.raca||'—')}</div><div><b>Sexo / nascimento</b>${E(d.sexo||'—')} · ${E(d.nasc?cvData(d.nasc):(d.idade!=null?d.idade+' anos':'—'))}</div><div><b>Peso</b>${E(d.peso||'—')} kg</div></div><p style="margin-top:6px"><b>Saúde informada:</b> ${E(d.saude||'Não informado')}. Aceitamos pets com doenças e comorbidades: a cobertura é a mesma de qualquer pet, só com as carências normais (sem carência extra e sem exclusão).</p>`)}
 ${card('doc','O que é este contrato?','Cláusula 1',`<ul><li>A Pet Excellence cobre os serviços veterinários do plano <b>${E(d.plano)}</b>, nas quantidades e carências da tabela da página 2 (Anexo I).</li><li>É só para cães e gatos. Não é seguro saúde nem plano da ANS: é um pacote de serviços veterinários com pagamento mensal.</li><li>Fazem parte do contrato: a tabela de coberturas, a tabela de preços, a lista de exclusões e de cirurgias (páginas 3 e 4), os aditivos e os comprovantes de pagamento.</li></ul>`)}
 ${card('money','Quanto vou pagar?','Cláusula 3',`<div class="price"><div class="big">Mensalidade<b>${d.valor?cvBrl(d.valor):'conforme tabela'}</b><span class="small" style="color:#cfe3ff">no cartão de crédito, todo mês</span></div><ul><li><b>Adesão:</b> paga uma vez, por Pix de R$ 90,00.</li><li><b>Mensalidade:</b> cobrança recorrente no cartão pela Asaas, a partir da ativação. Boleto ou Pix só com autorização. Não aceitamos dinheiro.</li><li><b>Cartão recusado:</b> avisamos pelo WhatsApp em até 3 dias úteis, com link para atualizar ou pagar por Pix.</li><li><b>Segundo pet em diante:</b> 5% de desconto (até 4 pets).</li></ul></div>`)}
 ${card('clock','Quando começa e quando posso usar?','Carências contadas da ativação: contrato aceito/assinado + cartão cadastrado',`<div class="tl">${tl}</div>${d.bonus?`<div class="hl"><b>Bônus de adesão aplicado:</b> adesão paga por Pix no dia da simulação${d.sim?' ('+cvData(d.sim)+')':''}. Exames de sangue sem carência a partir da ativação.</div>`:(t!=='G'?`<div class="hl"><b>Bônus de adesão:</b> pagando a adesão por Pix no mesmo dia da simulação, os exames de sangue ficam sem carência.</div>`:'')}`)}
 ${foot(1)}</div>

<div class="pg">${head(2)}
 ${card('shield','O que o plano '+E(d.plano)+' cobre?','Anexo I · quantidades por ano de contrato (renovam a cada 12 meses e não acumulam)',`<table><tr><th>Serviço</th><th>Quantidade</th><th>Carência</th><th>Cobertura</th></tr>${tab}</table><p class="small" style="margin-top:4px">Raio-x, ultrassom e ecocardiograma: 40% de desconto no parceiro Focus Jardim Camburi (até 2 raio-x, 2 ultrassons e 1 eco por ano), pago direto ao parceiro.${t==='B'?' Reembolso Black: relatório do veterinário, nota fiscal e comprovante em nome do tutor, por e-mail; pagamento em até 45 dias após aprovação.':''}</p>`)}
 ${card('chat','Como uso no dia a dia?','Cláusula 2',`<div class="steps"><div class="st"><div class="n">1</div><p><b>Agende</b> pelo WhatsApp oficial. Urgência: atendida 24 h, sem agendamento.</p></div><div class="st"><div class="n">2</div><p><b>Antes</b> de qualquer procedimento, você recebe por escrito o que o plano cobre e o que você paga.</p></div><div class="st"><div class="n">3</div><p><b>Atendimento</b> com veterinários da clínica. Exames e procedimentos precisam de pedido deles.</p></div><div class="st"><div class="n">4</div><p><b>Depois</b>, você recebe o protocolo, quanto economizou e o saldo do plano.</p></div></div>
 <ul style="margin-top:6px"><li><b>Horário comercial:</b> segunda a sexta, 9h às 20h. Noites, fins de semana e feriados seguem as regras de “fora do horário”.</li><li><b>Urgência:</b> a consulta de avaliação é coberta conforme a tabela; o que vier depois só se estiver no plano, dentro da quantidade e fora da carência. Em risco de vida, estabilizamos primeiro e o orçamento vem em seguida.</li><li><b>Especialistas</b> (dermato, orto, neuro, cardio etc.) e serviços em outros locais não estão cobertos, exceto o reembolso do Black e os parceiros indicados.</li></ul>`)}
 ${foot(2)}</div>

<div class="pg">${head(3)}
 ${card('alert','E se eu atrasar?','Cláusula 4',`<div class="ladder"><div><b>Atraso</b>multa de 2% e juros de 1% ao mês</div><div><b>+15 dias</b>uso suspenso; urgência atendida como particular</div><div><b>Pagou</b>volta a usar no mesmo dia da confirmação</div><div><b>+60 dias</b>pode haver cancelamento, com aviso e 10 dias para regularizar</div><div><b>+90 dias</b>nome pode ir aos órgãos de crédito, com aviso prévio</div></div>`)}
 <div class="g2">
 ${card('door','Posso desistir ou cancelar?','Cláusulas 7 e 8',`<ul><li><b>7 dias</b> para desistir sem justificativa: sem uso, devolvemos adesão e mensalidade em até 7 dias.</li><li>Não ativado em 7 dias? Pode pedir a adesão de volta.</li><li><b>Cancele quando quiser</b> pelo WhatsApp ou e-mail, com 30 dias de aviso (o plano vale até o fim deles).</li><li><b>Sem valor extra</b> se no ciclo atual o pet usou só consultas, vacinas e corte de unha, se o aviso termina na data de renovação ou se o pet faleceu.</li><li>Usou outros serviços no ciclo (exames, internação, cirurgia, tártaro, sedação, anestesia, medicação, reembolso) e cancela antes do fim: <b>acerto = mensalidades que faltam para completar os 12 meses do ciclo</b>, contadas depois do mês do aviso.</li><li>Confirmação por escrito em até 2 dias úteis.</li></ul>`)}
 ${card('star','Regras importantes','Cláusulas 5, 6 e 9',`<ul><li><b>Vigência:</b> ciclos de 12 meses a partir da ativação, com renovação automática.</li><li><b>Reajuste:</b> todo julho, pelo IPCA (IBGE) dos últimos 12 meses, com aviso de 30 dias, aplicado automaticamente na cobrança do cartão. Mudou de faixa de idade ou peso: nova mensalidade no mês seguinte, com aviso.</li><li><b>Pessoal:</b> vale só para este pet; não pode ser transferido.</li><li><b>Tutor:</b> pagar em dia, manter cartão e dados atualizados, agendar e informar doenças.</li><li><b>Pet Excellence:</b> veterinários habilitados, orçamento antes, aviso de cobrança e resposta em até 2 dias úteis.</li><li>Vacinas de laboratório aprovado pelo Ministério da Agricultura. Dados protegidos pela LGPD.</li></ul>`)}
 </div>
 <div style="height:10px"></div>
 ${card('x','O que o plano não cobre?','Anexo III · o tutor paga na clínica, sempre com orçamento antes',`<ul><li>Quimioterapia, hemodiálise e diálise peritoneal, transplantes e próteses.</li><li>Internação intensiva (UTI) e semi-intensiva (exceto Black), infusões contínuas e vasoativos.</li><li>Exames fora da tabela, como hemogasometria e prova de carga.</li><li>Consultas e procedimentos de especialistas (exceto reembolso Black).</li><li>Alimentação por sonda, enteral ou parenteral, patês e rações; microchip, inseminação e estética.</li><li>Medicamentos de alto custo (como Cerênia, Convênia, Imizol, eritropoetina, Librela, meropenem), pré e probióticos e remédios para casa.</li></ul><p class="small">Na dúvida sobre um medicamento ou exame, a clínica informa no orçamento, por escrito, antes de usar.</p>`)}
 ${foot(3)}</div>

<div class="pg">${head(4)}
 ${t!=='G'?card('shield','Cirurgias eletivas cobertas','Platinum e Black · 1 por ano de contrato, escolhida entre estas',`<p>Otohematoma, redução de prolapso retal, sutura de pele, amputação de dedo, castração de macho e de fêmea, cesariana, cistotomia, correção de hérnia umbilical, mastectomia total unilateral, retirada de nódulos de pele de até 3 cm, debridamento de feridas, tratamento cirúrgico de miíase e berne, retirada de espinhos de ouriço.</p>`):''}
 ${card('money','Tabela de mensalidades','Anexo II · faixas: jovem até 6 anos e 11 meses · adulto 7 a 11 anos e 11 meses · sênior 12 anos ou mais',`<table><tr><th>Plano</th><th>Porte</th><th>Jovem</th><th>Adulto</th><th>Sênior</th></tr><tr><td>Gold</td><td>até 15 kg</td><td>R$ 69,90</td><td>R$ 89,90</td><td>R$ 109,90</td></tr><tr><td>Platinum</td><td>até 15 kg</td><td>R$ 89,90</td><td>R$ 129,90</td><td>R$ 149,90</td></tr><tr><td>Platinum</td><td>acima de 15 kg</td><td>R$ 129,90</td><td>R$ 159,90</td><td>R$ 169,90</td></tr><tr><td>Black</td><td>até 15 kg</td><td>R$ 289,90</td><td>R$ 339,90</td><td>R$ 399,90</td></tr><tr><td>Black</td><td>acima de 15 kg</td><td>R$ 349,90</td><td>R$ 419,90</td><td>R$ 489,90</td></tr></table><p class="small">Valores vigentes até o reajuste de julho. Gold não atende pets acima de 15 kg.</p>`)}
${card('chat','Perguntas rápidas','Respostas curtas, conforme este contrato',`<div class="g2" style="gap:6px 14px"><p><b>Posso usar no dia em que contratar?</b><br>Sim, após a ativação: consultas em horário comercial, vacinas e corte de unha.</p><p><b>Meu pet passou mal à noite. Está coberto?</b><br>A consulta de urgência, conforme a tabela. O resto depende do plano, com orçamento antes.</p><p><b>Como sei se algo está coberto?</b><br>Pergunte no WhatsApp ou na recepção. Você recebe por escrito antes.</p><p><b>Posso trocar de plano?</b><br>Para maior, a qualquer momento (carências novas contam da troca). Para menor, na renovação.</p><p><b>Meu cartão foi recusado. E agora?</b><br>Você recebe um link para atualizar ou pagar por Pix. Até 15 dias o plano segue ativo.</p><p><b>Como peço um relatório do meu plano?</b><br>Pelo WhatsApp: enviamos carências, saldo, histórico e economia em PDF.</p></div>`)}
 <section class="aceite"><h2>${cvIcon('sign',18)} Aceite e assinatura</h2>
  <div class="chk"><span class="box">${ok?'✓':''}</span><span>Li e concordo com todas as cláusulas deste contrato e com os anexos.</span></div>
  <p class="small" style="margin-top:6px">${ok?`Aceite eletrônico registrado em ${E(d.aceite.quando)} pelo canal ${E(d.aceite.canal||'WhatsApp')}, a partir do telefone ${E(d.tel||'—')}, versão ${CV_VERSAO}.`:'O aceite é feito marcando “Li e concordo” no cadastro digital, enviado pelo WhatsApp do tutor, com registro de data, hora, telefone e versão.'} As partes reconhecem a validade da contratação e da assinatura por meio eletrônico (MP 2.200-2/2001, art. 10, § 2º). Foro de Vitória/ES, sem prejuízo do foro do domicílio do consumidor.</p>
  <p style="margin:8px 0 0">Vitória/ES, ${cvData(d.dataDoc||new Date().toISOString())}.</p>
  <div class="sig"><div>UNIVET VITÓRIA LTDA e PET EXCELLENCE LTDA<br>por Bernardo Fernandes Lopes</div><div>${E(d.tutor||'Contratante')}<br>CPF ${E(d.cpf||'—')}${ok?' · aceite eletrônico':''}</div></div>
 </section>
 ${foot(4)}</div>
</body></html>`}

function aceiteAgora(){const d=new Date(),p=n=>String(n).padStart(2,'0');return p(d.getDate())+'/'+p(d.getMonth()+1)+'/'+d.getFullYear()+' '+p(d.getHours())+':'+p(d.getMinutes())}
function cvDadosPagina(aceite){const c=campos(),v=price(state.pick);return {numero:'(definido na ativação)',plano:state.pick,tutor:c.tutor,cpf:c.cpf,end:[c.end,c.num].filter(Boolean).join(', '),cep:c.cep,tel:c.tel,email:c.email,pet:c.pet,especie:c.especie,raca:c.raca,sexo:c.sexo,idade:c.anos,peso:c.kg,saude:c.saude,valor:v,bonus:/Pix/.test(c.pag)&&state.pick!=='Gold',sim:c.sim,aceite:aceite?{quando:aceite,canal:'WhatsApp'}:null}}
$('verContrato').addEventListener('click',()=>{$('dlgCorpo').innerHTML='<iframe id="cvFrame" title="Seu contrato ilustrado" style="width:100%;height:70vh;border:0;background:#E9EEF7"></iframe>';$('cvFrame').srcdoc=cvHTML(cvDadosPagina($('aceite').checked?aceiteAgora():null),CAT,NAO_COBRE,LOGO_CV,FOTO_CV);try{$('dlgContrato').showModal()}catch(_){$('dlgContrato').setAttribute('open','')}});
$('dlgAceito').addEventListener('click',()=>{$('aceite').checked=true;$('dlgContrato').close();$('aceite').scrollIntoView({block:'center'})});
$('dlgFechar').addEventListener('click',()=>$('dlgContrato').close());
document.querySelectorAll('#cQuer button').forEach(b=>b.addEventListener('click',()=>b.setAttribute('aria-pressed',String(b.getAttribute('aria-pressed')!=='true'))));
$('cCpf').addEventListener('input',e=>{let d=e.target.value.replace(/\D/g,'').slice(0,11);e.target.value=d.replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2')});
$('cEnviar').addEventListener('click',()=>{const cpf=$('cCpf').value.replace(/\D/g,''),pet=$('cPet').value.trim();if(cpf.length!==11){$('cErr').hidden=false;return}$('cErr').hidden=true;
 const q=[...document.querySelectorAll('#cQuer button[aria-pressed="true"]')].map(b=>b.textContent);
 const m='CONSULTA DO PLANO\nCPF: '+$('cCpf').value+'\nPet: '+(pet||'-')+'\nQuero ver: '+(q.join(', ')||'resumo')+'\nCódigo (não apagar): PC1|cpf='+cpf+'|pet='+encodeURIComponent(pet)+'|quer='+encodeURIComponent(q.join(', '));
 const a=document.createElement('a');a.href='https://wa.me/'+WA+'?text='+encodeURIComponent(m);a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove()});
$('lerContrato').addEventListener('click',e=>{e.preventDefault();$('verContrato').click()});
$('form').addEventListener('submit',e=>{
  e.preventDefault();
  if(!$('nome').value.trim()||!$('pet').value.trim()||!$('tel').value.trim()||!$('aceite').checked){$('err').hidden=false;return}
  $('err').hidden=true; const m=message(); $('msg').textContent=m; $('msg').hidden=false;
  const a=document.createElement('a'); a.href='https://wa.me/'+WA+'?text='+encodeURIComponent(m); a.target='_blank'; a.rel='noopener'; document.body.appendChild(a); a.click(); a.remove();
});
$('copy').addEventListener('click',()=>{
  const m=message(); $('msg').textContent=m; $('msg').hidden=false;
  try{navigator.clipboard.writeText(m).then(()=>{$('copy').textContent='Mensagem copiada'},()=>{selectMsg()})}catch(_){selectMsg()}
});
function selectMsg(){const r=document.createRange();r.selectNodeContents($('msg'));const s=getSelection();s.removeAllRanges();s.addRange(r);$('copy').textContent='Mensagem selecionada'}
fillRacas();render();
