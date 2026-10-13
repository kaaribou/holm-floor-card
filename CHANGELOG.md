# Changelog

## 1.1.0
- **Correction** : dans l'éditeur visuel, les pièces ajoutées (et les capteurs choisis) n'étaient pas toujours enregistrées, surtout dans l'application mobile (#1). L'éditeur ne se reconstruit plus pendant la saisie et garde les panneaux ouverts.
- **Nouveau** : badge batterie optionnel sur chaque pièce (`battery`), avec icône et couleur selon le niveau, seuils orange / rouge réglables, pourcentage en option et mode « seulement si faible » (#2). Si vous choisissez un capteur « batterie faible », le pourcentage est repris d'un autre capteur de batterie du même appareil quand il existe.
- **Nouveau** : option `theme` — automatique (suit le mode clair / sombre), sombre, clair ou couleurs de votre thème Home Assistant (#3).

## 1.0.0
Première version publique.

- En-tête : moyenne, humidité moyenne, écart, température extérieure.
- Bande thermique colorée avec toutes les pièces.
- Tuiles pièces : température, tendance 1 h, humidité, mini-courbe 24 h (statistiques natives).
- Graphique détaillé 24 h / 7 j au toucher, fiche de l'entité à l'appui long.
- Éditeur visuel avec ajout de pièces.
