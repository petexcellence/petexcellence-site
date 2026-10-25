"""Gera o site estático petexcellence.com.br a partir do HTML publicado da página de vendas (artefato).
Uso: python3 build_site.py <artefato.html> <pasta_saida>
- extrai imagens base64 -> assets/img/*.webp (+ og 1200x630, ícones)
- CSS da página -> assets/css/style.css (com @font-face locais); JS -> assets/js/app.js (defer)
- fontes Poppins/Cormorant hospedadas no site (assets/fonts, OFL)
- CSP sem scripts externos; preload de fontes e da foto principal; width/height nas imagens
"""
import re, sys, base64, hashlib, io, os, shutil
from PIL import Image, ImageDraw, ImageFont

SRC, OUT = sys.argv[1], sys.argv[2]
HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, 'fonts')          # woff2 + licenças OFL
FD = '/home/claude/camp/fonts/'                 # TTF para a imagem og
SYM = '/home/claude/camp/symbol_pe.png'         # trevo para os ícones

raw = open(SRC, encoding='utf-8').read()
body = raw.split('<body>', 1)[1].rsplit('</body>', 1)[0] if '<body>' in raw else raw

# 1) separar o script ANTES de mexer nos estilos (o script contém <style> do contrato)
scripts = re.findall(r'<script>(.*?)</script>', body, flags=re.S)
assert len(scripts) == 1, len(scripts)
js = scripts[0]
body = re.sub(r'<script>.*?</script>\s*', '', body, flags=re.S)
styles = re.findall(r'<style>(.*?)</style>', body, flags=re.S)
body = re.sub(r'<style>.*?</style>\s*', '', body, flags=re.S)

# 2) imagens base64 -> arquivos
NAMES = {}
def name_for(rawimg, w, h):
    if w == h and w >= 500: return 'tutora-e-golden'
    if w == h: return 'tutora-e-golden-thumb'
    return 'logo-pet-excellence' if w >= 500 else 'logo-pet-excellence-sm'
dims = {}
def rep(m):
    data = base64.b64decode(m.group(2)); key = hashlib.md5(data).hexdigest()
    if key not in NAMES:
        im = Image.open(io.BytesIO(data)).convert('RGBA'); n = name_for(data, *im.size)
        if n in dims: n += '-' + key[:4]
        im.save(f'{OUT}/assets/img/{n}.webp', 'WEBP', quality=84, method=6)
        NAMES[key] = n; dims[n] = im.size
    return f'assets/img/{NAMES[key]}.webp'
for d in ('assets/img', 'assets/css', 'assets/js', 'assets/fonts'): os.makedirs(f'{OUT}/{d}', exist_ok=True)
pat = r'data:image/([a-z+]+);base64,([A-Za-z0-9+/=]+)'
body = re.sub(pat, rep, body)
js = re.sub(pat, rep, js)

# 3) fontes locais
for f in os.listdir(FONTS): shutil.copy(os.path.join(FONTS, f), f'{OUT}/assets/fonts/{f}')
ff = ''.join(f"@font-face{{font-family:'Poppins';font-style:normal;font-weight:{w};font-display:swap;src:url(../fonts/poppins-latin-{w}-normal.woff2) format('woff2')}}\n" for w in (300, 400, 500, 600, 700))
ff += ''.join(f"@font-face{{font-family:'Cormorant Garamond';font-style:normal;font-weight:{w};font-display:swap;src:url(../fonts/cormorant-garamond-latin-{w}-normal.woff2) format('woff2')}}\n" for w in (500, 600, 700))
css = ff + 'img{height:auto}\n' + '\n'.join(styles)
# contrato ilustrado (iframe srcdoc): trocar Google Fonts por fontes locais
ffi = ''.join(f"@font-face{{font-family:Poppins;font-weight:{w};font-display:swap;src:url(/assets/fonts/poppins-latin-{w}-normal.woff2) format('woff2')}}" for w in (400, 500, 600, 700))
ffi += ''.join(f"@font-face{{font-family:'Cormorant Garamond';font-weight:{w};font-display:swap;src:url(/assets/fonts/cormorant-garamond-latin-{w}-normal.woff2) format('woff2')}}" for w in (600, 700))
js = re.sub(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com[^"]*">', '<style>' + ffi + '</style>', js)
assert 'googleapis' not in js
open(f'{OUT}/assets/css/style.css', 'w', encoding='utf-8').write(css)
open(f'{OUT}/assets/js/app.js', 'w', encoding='utf-8').write(js)
v = hashlib.md5((css + js).encode()).hexdigest()[:8]

# 4) imagem de compartilhamento e ícones
hero = Image.open(f'{OUT}/assets/img/tutora-e-golden.webp').convert('RGBA')
logo = Image.open(f'{OUT}/assets/img/logo-pet-excellence.webp').convert('RGBA')
og = Image.new('RGB', (1200, 630), (8, 18, 52)); h = hero.resize((560, 560), Image.LANCZOS); og.paste(h, (600, 35), h)
lg = logo.resize((520, int(520 * logo.height / logo.width)), Image.LANCZOS); og.paste(lg, (50, 80), lg)
d = ImageDraw.Draw(og)
d.text((50, 260), 'Aqui os procedimentos', font=ImageFont.truetype(FD + 'Poppins-Bold.ttf', 46), fill='white')
d.text((50, 320), 'já estão autorizados.', font=ImageFont.truetype(FD + 'Poppins-Bold.ttf', 46), fill=(46, 196, 245))
d.text((50, 410), 'Plano de saúde pet a partir de R$ 69,90/mês', font=ImageFont.truetype(FD + 'Poppins-Medium.ttf', 26), fill=(207, 233, 247))
d.text((50, 455), 'com a credibilidade da Univet · Vitória/ES', font=ImageFont.truetype(FD + 'Poppins-Regular.ttf', 24), fill=(207, 233, 247))
og.save(f'{OUT}/assets/img/og-petexcellence.jpg', quality=86, optimize=True, progressive=True)
sym = Image.open(SYM).convert('RGBA'); sym = sym.crop(sym.getbbox()); w = max(sym.size)
sq = Image.new('RGBA', (w, w), (0, 0, 0, 0)); sq.paste(sym, ((w - sym.width) // 2, (w - sym.height) // 2))
for sz, n in [(32, 'favicon-32.png'), (180, 'apple-touch-icon.png'), (192, 'icon-192.png'), (512, 'icon-512.png')]:
    t = sq.resize((sz, sz), Image.LANCZOS)
    if n == 'apple-touch-icon.png':
        t = Image.new('RGBA', (sz, sz), (255, 255, 255, 255)); s2 = sq.resize((int(sz * .8),) * 2, Image.LANCZOS); t.paste(s2, (int(sz * .1),) * 2, s2)
    t.save(f'{OUT}/assets/img/{n}', optimize=True)

# 5) imagens: width/height, lazy fora da dobra
def imgfix(m):
    t = m.group(0)
    for n, (w, h) in dims.items():
        if f'assets/img/{n}.webp' in t and 'width=' not in t: t = t.replace('<img ', f'<img width="{w}" height="{h}" ', 1)
    if 'hero-art' in t: t = t.replace('<img ', '<img fetchpriority="high" decoding="async" ', 1)
    elif not ('class="logo"' in t and 'style=' not in t): t = t.replace('<img ', '<img loading="lazy" decoding="async" ', 1)
    return t
body = re.sub(r'<img [^>]*>', imgfix, body)
body = re.sub(r'<link rel="preconnect" href="https://fonts\.googleapis\.com">\s*', '', body)
body = re.sub(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com[^>]*>\s*', '', body)
body = re.sub(r'<meta charset="utf-8">\s*', '', body)
body = re.sub(r'<title>[^<]*</title>\s*', '', body, count=1)
body = re.sub(r'<meta name="claude:[^>]*>\s*', '', body)

CSP = ("default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; "
       "connect-src 'self' https://viacep.com.br https://brasilapi.com.br; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests")
head = f'''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta http-equiv="Content-Security-Policy" content="{CSP}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>Plano de Saúde Pet Excellence | Univet Vitória – veterinária especializada 24 horas</title>
<meta name="description" content="Plano de saúde para cães e gatos com a credibilidade da Univet, em Jardim Camburi, Vitória/ES. Aqui os procedimentos já estão autorizados. Planos a partir de R$ 69,90/mês. Simule agora.">
<link rel="canonical" href="https://petexcellence.com.br/">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Pet Excellence">
<meta property="og:title" content="Plano de Saúde Pet Excellence – com a credibilidade da Univet">
<meta property="og:description" content="Aqui os procedimentos já estão autorizados. Sem guias, sem ligar para operadora. A partir de R$ 69,90/mês.">
<meta property="og:url" content="https://petexcellence.com.br/">
<meta property="og:image" content="https://petexcellence.com.br/assets/img/og-petexcellence.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#081234">
<meta name="format-detection" content="telephone=no">
<link rel="preload" href="assets/fonts/poppins-latin-300-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/cormorant-garamond-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/img/tutora-e-golden.webp" as="image" fetchpriority="high">
<link rel="stylesheet" href="assets/css/style.css?v={v}">
<link rel="icon" type="image/png" sizes="32x32" href="assets/img/favicon-32.png">
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
</head>
<body>
'''
open(f'{OUT}/index.html', 'w', encoding='utf-8').write(head + body.strip() + f'\n<script src="assets/js/app.js?v={v}" defer></script>\n</body>\n</html>\n')
print('ok', v, dims)
