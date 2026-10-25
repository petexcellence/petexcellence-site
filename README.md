# Pet Excellence – Plano de Saúde Pet · petexcellence.com.br

Página de vendas do **Plano de Saúde Pet Excellence**, com a credibilidade da **Univet Vitória** – veterinária especializada 24 horas em Jardim Camburi, Vitória/ES.

> Aqui os procedimentos já estão autorizados. Sem guias, sem ligar para operadora, sem esperar aprovação.

## O que a página faz
- **Simulador**: espécie, idade e porte → preço do Gold, Platinum e Black e custo por dia.
- **Cadastro em 3 passos**: preenche os dados, abre o contrato ilustrado já preenchido e envia tudo pelo WhatsApp do plano – (27) 98158-4468.
- **Já sou cliente**: consulta de carências, saldo e histórico (a resposta é enviada pela equipe).
- **Contrato ilustrado** (versão 2026.10c) dentro da própria página.

## Tecnologia
Site **100% estático** (HTML, CSS e JavaScript puro), sem servidor e sem banco de dados, publicado pelo **GitHub Pages**.

```
index.html            página
assets/css/style.css  estilos
assets/js/app.js      simulador, cadastro e contrato ilustrado
assets/img/           imagens WebP, ícones e imagem de compartilhamento (og)
assets/fonts/         Poppins e Cormorant Garamond (licença SIL OFL 1.1)
404.html · robots.txt · sitemap.xml · site.webmanifest · CNAME
tools/build_site.py   gera o site a partir da página aprovada (uso interno)
```

## Segurança e privacidade
- **Content Security Policy**: só scripts, estilos e fontes do próprio site; conexões externas apenas para busca de CEP (ViaCEP e BrasilAPI).
- **Nenhum dado é armazenado no site**: o cadastro sai só na mensagem de WhatsApp enviada pelo próprio cliente (LGPD).
- Fontes hospedadas no próprio domínio (sem Google Fonts).
- No GitHub Pages: manter **Enforce HTTPS** ativado.

## Desempenho
Página completa com cerca de 75 KB na primeira visita: imagens em WebP com largura e altura definidas, fontes e foto principal pré-carregadas, script com `defer`, arquivos com versão (`?v=`) para atualização imediata.

## Domínios
- `petexcellence.com.br` – esta página (GitHub Pages, arquivo `CNAME`).
- `app.petexcellence.com.br` – sistema interno de contratos (separado deste repositório).

## Publicação
Toda atualização é preparada, testada (computador e celular) e **só é enviada a este repositório após aprovação da direção**.

---
© Univet Vitória · Pet Excellence Ltda. Conteúdo informativo; vale o contrato completo vigente.
