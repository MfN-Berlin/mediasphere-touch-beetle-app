[![Static Badge](https://img.shields.io/badge/lang-en-blue)](./README.md)
[![Static Badge](https://img.shields.io/badge/lang-de-grey)](./README.de.md)

# Responsive Touch Beetle

The starting point for the tactile model is a 3D scan of a dor beetle from the museum's collection. The 3D data had to be prepared by our project managers for reproduction as a model. Thanks to high-resolution photographs of the beetle, even the most delicate body parts could be matched with the digital twin to recreate the dor beetle as lifelike as possible.

[Learn more on WERK5's website.](https://werk5.com/en/projects/dor-beetle-responsive-tactile-model/)

## App

This app is a digital reproduction of the tactile Touch Beetle model.

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
  [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International](./LICENSES/ASSETS-CC-BY-NC-ND-4.0.txt).
- **Text Content** (documentation, descriptions, articles): All rights reserved
  by the Museum für Naturkunde Berlin.
  See [TEXT-ALL-RIGHTS-RESERVED](./LICENSES/TEXT-ALL-RIGHTS-RESERVED.txt).
