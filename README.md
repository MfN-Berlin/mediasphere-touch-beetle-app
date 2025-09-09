# Digital reproduction of responsive Beetle

[![Static Badge](https://img.shields.io/badge/lang-en-blue)](./README.md)
[![Static Badge](https://img.shields.io/badge/lang-de-grey)](./README.de.md)

The starting point for this project is a 3D scan of a dor beetle from the collection of the Natural History in Berlin. The museum has a huge collection of around 30 million objects. Half of these can be found in the insect collection. The museum has set itself the goal of not only preserving and digitizing its collection, but also using it for innovative reuse purposes, e.g. for artistic endeavours or product developments in collaboration with industry.

One of these cooperation projects brought Mediasphere For Nature (the museum lab for digital media) together with the model building company werk5. Together they have created a responsive tactile model of a dor beetle that is also suitable for blind and visually impaired people.

The goal of the digital reproduction is to expand access to the project and to enable additional accessibility feature, e.g. through sign language videos.

For this, the 3D data had to be prepared by our project managers for reproduction as a model. Thanks to high-resolution photographs of the beetle, even the most delicate body parts could be matched with the digital twin to recreate the dor beetle as lifelike as possible.

[Learn more about the development of the tactile model on the werk5 website.](https://werk5.com/en/projects/dor-beetle-responsive-tactile-model/)

## App

This app is a digital reproduction of the tactile model of a dor beetle.

### Development

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

## Licensing

This repository uses **different licenses for different types of content**:

- **Code**: Licensed under the [MIT License](./LICENSE) © 2025 Museum für Naturkunde Berlin.
- **Assets (Images, Videos, Models)**: Licensed under
  [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International](./LICENSES/CC-BY-NC-ND-4.0.txt).
- **Text and Audio Content** (documentation, descriptions, articles, audiofiles): [All rights reserved](./LICENSES/ALL-RIGHTS-RESERVED.txt).

### Exceptions

#### Licensed under [CC-BY-SA](./LICENSES/CC-BY-SA.txt)

- [6_1_3.mp3](./app/public/audio/6_1_3.mp3)

#### Licensed under [CC-BY](./LICENSES/CC-BY.txt) (Museum für Naturkunde Berlin)

- [scan_microct.jpg](./app/public/static/img/scan_microct.jpg)

#### Licensed under [CC-BY](./LICENSES/CC-BY.txt) (Bernhart Schurian)

- [waldmistkaefer_hires_03.jpg](./app/public/static/img/waldmistkaefer_hires_03.jpg)
- [img/waldmistkaefer_hires_01.jpg](./app/public/static/img/waldmistkaefer_hires_01.jpg)
- [img/waldmistkaefer_hires_02.jpg](./app/public/static/img/waldmistkaefer_hires_02.jpg)
