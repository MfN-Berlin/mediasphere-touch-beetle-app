[![Static Badge](https://img.shields.io/badge/lang-en-blue)](./README.md)
[![Static Badge](https://img.shields.io/badge/lang-de-blue)](./README-DE.md)

# Responsiver Tastkäfer

Ausgangsbasis für das taktile Modell ist der 3D-Scan eines Waldmistkäfers aus Sammlung des Museums. Die 3D-Daten mussten von unseren Projektleiter*innen für die Reproduktion als Modell aufbereitet werden. Dank hochaufgelöster Fotografien des Käfers konnten auch filigranste Körperstellen mit dem digitalen Zwilling abgeglichen werden, um den Waldmistkäfer möglichst lebensecht nachzubauen.

[Mehr erfahren auf der Website von WERK5.](https://werk5.com/projekte/responsiver_tastkaefer/)

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