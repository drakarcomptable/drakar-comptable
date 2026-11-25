# DONETADOC en ligne.
#
# L'outil a besoin d'un vrai Chromium : il photographie les sites des
# prospects et imprime le PDF. C'est pourquoi il tourne dans un conteneur
# qui vit, et non dans une fonction sans etat : la fabrication dure une a
# deux minutes et pese plus que ce qu'une fonction accepte d'embarquer.
#
# L'image officielle Playwright apporte deja Chromium et ses dependances
# systeme, qui sont la partie lourde et penible a installer.
#
# Le contexte de construction est la RACINE du depot, pas ce dossier :
# l'outil lit les polices, les logos et les photos dans nazar-site/.
FROM mcr.microsoft.com/playwright:v1.63.0-noble

ENV PYTHONUNBUFFERED=1 \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    HOTE=0.0.0.0

WORKDIR /app

# poppler-utils n'est pas indispensable a l'outil, mais il sert aux essais
# (rasteriser une page pour la verifier) et pese peu.
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 poppler-utils \
 && rm -rf /var/lib/apt/lists/*

# Le paquet npm seul : les navigateurs sont deja dans l'image.
RUN npm install --no-save --omit=dev playwright@1.63.0

COPY nazar-site/ /app/nazar-site/
COPY proposition/ /app/proposition/

# Ces dossiers accueillent les captures et les PDF. Ils sont volatils :
# sur un hebergeur sans disque, tout disparait au redemarrage. C'est sans
# consequence, un document se telecharge dans la foulee.
RUN mkdir -p /app/proposition/depots /app/proposition/sortie

EXPOSE 8080
CMD ["python3", "/app/proposition/outil.py"]
