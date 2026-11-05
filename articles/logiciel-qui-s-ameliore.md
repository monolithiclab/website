---
title: "Le logiciel qui s’améliore tout seul : ce qu’un dirigeant doit décider d’abord — Monolithic Lab"
description: "Des agents IA savent lire les erreurs et les tickets, puis proposer un correctif. Dire ce que « mieux » signifie, prouver chaque changement et garder un responsable restent des décisions de direction."
alternate: "/en-us/articles/self-improving-software/"
hero:
  compact: true
  label: "Article"
  headline: "Le logiciel qui s’améliore tout seul : ce qu’un dirigeant doit décider d’abord"
  subheadline: "Des agents savent déjà lire les erreurs et les tickets, puis proposer un correctif. Reste à leur dire ce qu’il faut améliorer, et à vérifier qu’ils y parviennent."
cta_band:
  text: "Vous voulez confier une partie de ce travail à des agents, sans perdre la main ? Décrivez votre situation."
  button_text: "Prendre contact"
  button_url: "/contact/"
---

## L’idée

Des agents IA écrivent une part croissante du code, alors que le retour du terrain reste souvent manuel. Les erreurs sont dans un outil, les statistiques d’usage dans un deuxième, les tickets du support dans un troisième. Quelqu’un rassemble le tout, rédige une demande et la priorise pour la semaine suivante.

Ce travail peut désormais être confié à des agents : ils lisent les signaux, regroupent ce qui relève du même problème, et proposent la correction.

## Pourquoi cela concerne la direction

L’idée dépasse la technique. Quand corriger coûte moins cher, la question devient : que faut-il corriger, et au nom de quoi ?

Les exemples sont nombreux. Répondre plus vite au support peut dégrader la qualité des réponses. Relancer plus souvent les prospects peut augmenter les ventes et lasser les clients. Ces arbitrages existaient déjà, souvent implicites, tranchés au cas par cas dans une réunion. Pour qu’une machine en tienne compte, il faut les écrire.

## Quatre décisions à prendre avant d’automatiser

**1. Écrire ce que « mieux » signifie.** Quelques objectifs chiffrés, et surtout les limites qu’aucune amélioration n’a le droit de franchir : une marge minimale, un délai de réponse, un taux d’erreur acceptable. Un objectif seul finit par être atteint aux dépens de ce qui n’est pas mesuré.

**2. Exiger une preuve avant chaque changement.** Ouvrir une demande de modification n’est que le début. Le plus difficile vient ensuite. Un changement doit être rejoué sur des cas passés, testé sur des données que l’agent n’a jamais vues, et jugé selon des critères qu’il ne peut pas modifier. Sans cela, l’agent apprend surtout à réussir son propre examen.

**3. Nommer un responsable.** Dans une PME, quelqu’un répond d’une erreur devant un client. L’autonomie peut donc se gagner par étapes : une personne valide chaque changement, puis certaines catégories passent en automatique avec un contrôle par échantillon, et reviennent à la validation si les résultats baissent.

**4. Décider ce que les agents peuvent lire et écrire.** Un ticket client contient des données personnelles, et le RGPD s’applique. Il contient aussi un texte écrit par n’importe qui, qui peut glisser des instructions à destination de l’agent. Un agent qui lit tous les tickets et écrit directement dans le code cumule ces risques. Il faut donc masquer ce qui doit l’être, limiter la durée de conservation, et séparer la lecture des signaux du droit de publier.

## Par où commencer dans une PME

Inutile de viser tout le logiciel de l’entreprise. Mieux vaut partir d’un périmètre où le retour est déjà disponible :

1. **Repérer le transport.** Où vos équipes copient-elles des informations d’un outil à un autre pour que quelqu’un décide ? C’est le travail le plus simple à retirer.
2. **Choisir un processus déjà relu par une personne.** Qualification de prospects, tri de documents, réponses au support. Chaque correction humaine indique ce qui était attendu, et devient une donnée d’apprentissage.
3. **Mesurer avant d’automatiser.** Le coût par cas traité et la part des cas corrigés par une personne donnent un point de départ. Sans eux, personne ne pourra dire si le système progresse.
4. **Faire proposer, et garder la validation.** L’agent prépare le changement et sa preuve, et une personne accepte ou refuse en quelques minutes.
5. **Vérifier après la mise en production.** Le gain annoncé s’est-il produit ? Cette mesure décide des catégories de changement que l’on peut ensuite déléguer.

## L’exemple de Millstream

Monolithic Lab développe [Millstream](/apps/millstream/), une plateforme de pipelines qui mêle code, agents IA et décisions humaines, encore en préversion. Les analyses de production y sont calculées par des règles, sans IA. Un agent rédige les propositions, le moteur les valide sur l’historique, et une personne les accepte.

Sur le scénario de test, avec des données synthétiques qui suivent une règle, le code proposé a remplacé l’agent sur 260 cas sur 270, et le coût en agents de la journée suivante est tombé à 3,7 % du coût de départ. Ce chiffre montre la boucle à l’œuvre de bout en bout. Sur un processus réel, le résultat dépend de ses données. [Le détail technique](https://millstream.dev/blog/self-improving-pipelines) est disponible en anglais.

## Le lien avec le rôle de CTO

Ces quatre décisions appartiennent à la direction, et il faut quelqu’un pour les rendre applicables : traduire les objectifs en mesures, fixer les règles de preuve, définir les accès, dire ce que l’on délègue et à quel moment. Dans une PME, ce travail revient à la direction technique.

C’est l’approche de Monolithic Lab, en [CTO à temps partagé](/cto-temps-partage/) ou en [CTO de transition](/cto-de-transition/), dans le cadre de la transformation de l’entreprise.

[La transformation IA en détail](/transformation-ia/)

## Source

Boris Tane, [« Self-improving software is inevitable »](https://boristane.com/blog/self-improving-software-is-inevitable/), octobre 2026.
