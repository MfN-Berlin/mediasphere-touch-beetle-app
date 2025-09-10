# Digitale Reproduktion des responsiven Käfers

[![Static Badge](https://img.shields.io/badge/lang-en-grey)](./README.md)
[![Static Badge](https://img.shields.io/badge/lang-de-blue)](./README.de.md)

Ausgangspunkt für das Projekt ist ein 3D-Scan eines Waldmistkäfers aus der Sammlung des Museum für Naturkunde in Berlin. Das Museum verfügt über eine riesige Sammlung von rund 30 Millionen Objekten. Die Hälfte davon ist in der Insektensammlung zu finden. Das Museum hat sich zum Ziel gesetzt, seine Sammlung nicht nur zu bewahren und zu digitalisieren, sondern sie auch für innovative Nachnutzungszwecke zu verwenden, z. B. für künstlerische Arbeiten oder Produktentwicklungen in Zusammenarbeit mit der Wirtschaft.

Eines dieser Kooperationsprojekte brachte Mediasphere For Nature (das museumseigene Lab für digitale Medien) mit dem Modellbauunternehmen werk5 zusammen. Gemeinsam entwickelten sie ein responsives Modell eines Waldmistkäfers, das auch für blinde und sehbehinderte Menschen geeignet ist.

Ziel der digitalen Reproduktion ist es, die Zugänglichkeit zum Projekt zu erweitern und zusätzliche Barrierefreiheit, z.B. durch Gebärdensprachvideos, zu ermöglichen.

Hierfür mussten die 3D-Daten von unseren Projektleitern für die Reproduktion als Modell aufbereitet werden. Dank hochauflösender Fotografien des Käfers konnten auch filigranste Körperstellen mit dem digitalen Zwilling abgeglichen werden, um den Wakdmistkäfer möglich lebensecht nachzubauen.

[Erfahren Sie mehr über die Entwicklung des Tastmodells auf der Website von werk5.](https://werk5.com/projekte/responsiver_tastkaefer/)

## App

Diese App ist eine digitale Reproduktion des taktilen Tastkäfermodells.

### Entwicklung

```sh

# Install rush
npm i @microsoft/rush -g

# Install dependencies
rush update

cd app/

# Start demo
rushx start
# Or build
rushx build
```

## Lizenzierung

Dieses Repository verwendet **unterschiedliche Lizenzen für verschiedene Arten von Inhalten**:

- **Code**: Lizenziert unter der [MIT-Lizenz](./LICENSE) © 2025 Museum für Naturkunde Berlin.
- **Assets (Bilder, Videos, Modelle)**: Lizenziert unter
  [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International](./LICENSES/CC-BY-NC-ND-4.0.txt).
- **Text- und Audioinhalte** (Dokumentation, Beschreibungen, Artikel, Audiodateien): [Alle Rechte vorbehalten](./LICENSES/ALL-RIGHTS-RESERVED.txt).

### Ausnahmen

#### Lizenziert unter [CC-BY-SA](./LICENSES/CC-BY-SA.txt)

- [./app/public/audio/6_1_3.mp3](./app/public/audio/6_1_3.mp3)

#### Lizenziert unter [CC-BY](./LICENSES/CC-BY.txt) (Museum für Naturkunde Berlin)

- [scan_microct.jpg](./app/public/static/img/scan_microct.jpg)

#### Lizenziert unter [CC-BY](./LICENSES/CC-BY.txt) (Bernhard Schurian)

- [waldmistkaefer_hires_03.jpg](./app/public/static/img/waldmistkaefer_hires_03.jpg)
- [waldmistkaefer_hires_01.jpg](./app/public/static/img/waldmistkaefer_hires_01.jpg)
- [waldmistkaefer_hires_02.jpg](./app/public/static/img/waldmistkaefer_hires_02.jpg)
