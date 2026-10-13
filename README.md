# 🏠 HOLM Floor Card

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://hacs.xyz/)
![Version](https://img.shields.io/github/v/release/kaaribou/holm-floor-card)
![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2025.1%2B-03a9f4)

**Toutes les températures d'un étage en un coup d'œil : où il fait trop chaud, trop froid, trop humide, et comment ça évolue.**

HOLM Floor Card regroupe les sondes de température (et d'humidité) d'un étage dans une seule carte colorée : une **bande thermique** place chaque pièce sur une échelle de couleurs, et chaque pièce a sa tuile avec sa **tendance sur 1 h** et sa **mini-courbe sur 24 h**. Un toucher sur une pièce ouvre son **graphique détaillé**.

> ✨ **Zéro YAML, aucun helper.** Les courbes viennent directement des statistiques de Home Assistant. Tout se règle dans l'éditeur visuel.

### En bref

- 🌡️ **En-tête** : moyenne de l'étage, humidité moyenne, écart entre la pièce la plus froide et la plus chaude, température extérieure.
- 🌈 **Bande thermique** : chaque pièce (et l'extérieur) placée sur une échelle de couleurs, du bleu au rouge.
- 🧱 **Tuiles pièces** : température colorée, tendance sur une heure (↗ / ↘), humidité avec son niveau (Sec, Idéal, Humide…), mini-courbe 24 h.
- 📈 **Graphique détaillé** au toucher : température et humidité sur **24 h ou 7 jours**, avec min / moyenne / max.
- 🔋 **Badge batterie** (option) sur chaque tuile : icône et couleur selon le niveau, avec vos propres seuils.
- 🎨 **Thème clair, sombre ou couleurs de votre thème** Home Assistant.
- 👆 Appui long sur une pièce : fiche de l'entité.

| Vue d'ensemble | Graphique d'une pièce |
|---|---|
| ![Vue d'ensemble](docs/images/etage.png) | ![Graphique](docs/images/graphique.png) |

---

## Installation

### Avec HACS (recommandé)

1. HACS → menu ⋮ → **Dépôts personnalisés**.
2. Ajoutez `https://github.com/kaaribou/holm-floor-card`, catégorie **Tableau de bord** (*Dashboard / Plugin*).
3. Recherchez la carte → **Télécharger**.
4. Rechargez la page (Ctrl + F5).

### Manuellement

1. Copiez `dist/holm-floor-card.js` dans `config/www/community/holm-floor-card/`.
2. **Paramètres → Tableaux de bord → ⋮ → Ressources → Ajouter** : `/local/community/holm-floor-card/holm-floor-card.js`, type **Module JavaScript**.
3. Rechargez la page.

---

## Utilisation

Ajoutez la carte **HOLM Étage**, donnez-lui un titre et ajoutez vos pièces dans l'éditeur (bouton **Ajouter une pièce**).

```yaml
type: custom:holm-floor-card
title: Rez-de-chaussée
icon: mdi:home-floor-0
outdoor_entity: sensor.temperature_exterieure
rooms:
  - name: Salon
    icon: mdi:sofa
    temperature: sensor.salon_temperature
    humidity: sensor.salon_humidite
    battery: sensor.salon_batterie
  - name: Salle de bain
    short: SdB
    temperature: sensor.sdb_temperature
```

## Options

| Option | Description | Par défaut |
|---|---|---|
| `title` / `icon` | Titre et icône de l'étage | `Étage` / `mdi:home-floor-0` |
| `outdoor_entity` | Température extérieure (affichée dans l'en-tête et sur la bande) | — |
| `hours` | Durée des mini-courbes (h) | `24` |
| `show_humidity` | Afficher l'humidité | `true` |
| `theme` | Apparence : `auto` (suit le mode clair / sombre de Home Assistant), `dark`, `light`, `theme` (couleurs de votre thème) | `auto` |
| `battery_display` | Badge batterie : `always` (toujours), `low` (seulement si faible), `never` (jamais) | `always` |
| `battery_percent` | Afficher le pourcentage à côté de l'icône | `false` |
| `battery_warn` | Seuil orange (%) | `30` |
| `battery_low` | Seuil rouge (%) | `15` |
| `rooms` | Pièces : `name`, `icon`, `temperature` (**obligatoire**), `humidity`, `battery`, `short` (nom court sur la bande) | — |

### Badge batterie

Ajoutez à une pièce le capteur de batterie de sa sonde (`battery`) : un capteur en % (`sensor`, classe `battery`) ou un capteur « batterie faible » (`binary_sensor`, classe `battery`).

| Niveau | Icône | Couleur |
|---|---|---|
| au-dessus du seuil orange | 🔋 selon le niveau (plein, 80 %, 50 %…) | vert |
| sous le seuil orange | | orange |
| sous le seuil rouge, ou `binary_sensor` à « faible » | alerte | rouge |
| indisponible | inconnue | gris |

Si vous choisissez un capteur « batterie faible » (oui / non), la carte cherche un capteur de batterie en % sur le même appareil pour afficher le niveau ; s'il n'y en a pas (ou s'il est indisponible), seule l'icône s'affiche.

Avec `battery_display: low`, le badge n'apparaît que lorsqu'il faut changer la pile.

## FAQ

| Problème | Solution |
|---|---|
| Pas de courbe | La sonde n'a pas de statistiques : elle doit avoir un `state_class` (`measurement`). |
| Noms qui se chevauchent sur la bande | Donnez un nom court (`short`) aux pièces aux noms longs. |
| Les choix dans l'éditeur ne sont pas enregistrés (versions < 1.1.0) | Corrigé en 1.1.0 : mettez la carte à jour. |
| La nouvelle version ne s'affiche pas | Videz le cache (Ctrl + F5). |

---

## Un petit merci ?

La carte vous plaît ? Vous pouvez m'offrir une bière 🍺

[![Offrez-moi une bière](https://img.shields.io/badge/Offrez--moi_une_bi%C3%A8re-PayPal-0070ba?logo=paypal&logoColor=white)](https://paypal.me/kaaribou)

---

## Licence

Code : licence **MIT** — © kaaribou. Voir le [CHANGELOG](CHANGELOG.md).

Fait partie de la collection **HOLM — Home Orchestration & Living Management** : [Carburant HOLM](https://github.com/kaaribou/carburant-holm) · [HOLM LaMetric](https://github.com/kaaribou/lametric-holm) · [HOLM My Menu](https://github.com/kaaribou/holm-mymenu) · [HOLM Navbar Card](https://github.com/kaaribou/holm-navbar-card) · [HOLM Music Card](https://github.com/kaaribou/holm-music-card) · [HOLM Sentinel Card](https://github.com/kaaribou/holm-sentinel-card) · [HOLM Climate Card](https://github.com/kaaribou/climate-card-holm) · [HOLM Radiator Card](https://github.com/kaaribou/holm-radiator-card) · [HOLM Ecojoko Card](https://github.com/kaaribou/holm-ecojoko-card).
