# ![ExfilMS][logo]

[![npm][npm-badge]][npm]
[![docker][docker-badge]][docker]
[![license][license-badge]][license]
[![codecov][codecov-badge]][codecov]
[![cicd][cicd-badge]][cicd]
[![semantic-release][semantic-release-badge]][semantic-release]
[![commitizen][commitizen-badge]][commitizen]
[![doi-zenodo][doi-zenodo-badge]][doi-zenodo]

A command-line interface tool to extract, filter, and standardise mass spectrometry data.

## Installation

> _*Prerequisites:* [Node.js®][nodejs] and [Docker][docker]_

```bash
sudo npm install -g exfilms
```

## Usage

```bash
exfilms -h
```

For more information, please refer to our user guide [here][user-guide].

## License

Please refer to our license information [here][license].

## Citation

If you use this software in your work, please cite it using the following metadata:

Nambiar, V., Schiemer, T., Nambiar, S., Whiley, L., Wong, K. W., Wang, G., Holmes, E., & Wist, J. (2025). ExfilMS (Version 2.0.0) [Computer software]. Zenodo. https://doi.org/10.5281/zenodo.10976761

<!-- Links -->

[logo]: resources/img/logo.png
[npm]: https://www.npmjs.com/package/exfilms
[npm-badge]: https://img.shields.io/npm/v/exfilms.svg?sort=semver&logo=npm&logoColor=darkred&color=darkred
[docker]: https://hub.docker.com/r/vimalnathnambiar/exfilms
[docker-badge]: https://img.shields.io/docker/v/vimalnathnambiar/exfilms.svg?sort=semver&logo=docker&label=docker&color=%231D63ED
[license]: LICENSE
[license-badge]: https://img.shields.io/badge/License-MIT-yellow.svg
[codecov]: https://codecov.io/github/vimalnathnambiar/exfilms
[codecov-badge]: https://codecov.io/github/vimalnathnambiar/exfilms/graph/badge.svg?token=V8O80QXJ5S
[cicd]: https://github.com/vimalnathnambiar/exfilms/actions/workflows/build-publish.yml
[cicd-badge]: https://github.com/vimalnathnambiar/exfilms/actions/workflows/build-publish.yml/badge.svg
[semantic-release]: https://github.com/semantic-release/semantic-release
[semantic-release-badge]: https://img.shields.io/badge/semantic--release-angular-e10079.svg?logo=semantic-release&logoColor=%23E10079
[commitizen]: http://commitizen.github.io/cz-cli/
[commitizen-badge]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[doi-zenodo]: https://doi.org/10.5281/zenodo.10976761
[doi-zenodo-badge]: https://img.shields.io/badge/Zenodo-10.5281/zenodo.10976761-blue.svg?logo=doi&logoColor=blue
[nodejs]: https://nodejs.org/en/download/
[docker]: https://docs.docker.com/engine/install/
[user-guide]: resources/docs/exfilms.md
