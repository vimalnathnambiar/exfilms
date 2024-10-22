![ExfilMS](./img/logo.png)\
[![NPM][npm-image]][npm-url]
[![License][license-image]][license-url]
[![CI/CD][cicd-image]][cicd-url]
[![CodeCov][codecov-image]][codecov-url]
[![Semantic-Release][semantic-image]][semantic-url]
[![Downloads][downloads-image]][downloads-url]
[![DOI-Zenodo][doi-zenodo-image]][doi-zenodo-url]

## Introduction

ExfilMS is a cross-platform, command line interface (CLI) tool that allows you to easily extract mass spectrometry (MS) data from mzML formatted files, with filtering capabilities.

<br>

## Features

1. MS data extraction (spectrum and chromatogram)

2. Precision value rounding

3. Spectra filtering (m/z and intensity)

   - Targeted (target file, m/z tolerance and ppm tolerance)
   - Range (minimum and maximum m/z)

4. Spectrum data filtering

   - Type (profile / centroid)
   - MS level (i.e., 1, 2, ..., n)
   - Polarity (positive / negative)
   - Exclude spectra (m/z and intensity)

<br>

## Supported MS Platforms

Data extraction and spectrum filtration have been tested on data files acquired on the following MS platforms:

<table>
   <tr>
      <th>Instrument Vendor</th>
      <th>MS Platform</th>
      <th>Status / Description</th>
   </tr>
   <tr>
      <td rowspan="4">Bruker</td>
      <td>EVOQ TQ-MS</td>
      <td>Untested (Conversion not supported by ProteoWizard)</td>
   </tr>
   <tr>
      <td>ImpactII QToF-MS</td>
      <td>Working</td>
   </tr>
   <tr>
      <td>solariX MRMS</td>
      <td>Working</td>
   </tr>
   <tr>
      <td>timsTOFPro TIMS-ToF-MS</td>
      <td>Not Working (File size > 2GB)</td>
   </tr>
   <tr>
      <td rowspan="3">Waters</td>
      <td>XEVOTQXS TQ-MS</td>
      <td>Working</td>
   </tr>
   <tr>
      <td>XEVOG2XSQTOF DESI-MS</td>
      <td>Working</td>
   </tr>
      <tr>
      <td>XEVOG2XSQTOF REIMS</td>
      <td>Working</td>
   </tr>
   <tr>
      <td>SCIEX</td>
      <td>QTRAP6500+ TQ-MS</td>
      <td>Working</td>
   </tr>
</table>

<br>

## Installation

> ExfilMS has been tested on Windows, macOS and Linux.

### CLI

> [!IMPORTANT]\
> Prerequisite: [Node.js®][nodejs-url]

`$ npm i -g exfilms`

<br>

### Docker

> [!IMPORTANT]\
> Prerequisite: [Docker][docker-url]

```md
# Clone repository

$ git clone https://github.com/vimalnathnambiar/exfilms.git

# Navigate into repository

$ cd exfilms

# Install dependencies

npm install

# Build Docker image

$ docker build -t exfilms .
```

<br>

## Usage

### CLI

```md
# Using command line flags

$ exfilms -i "/path/to/input/directory/containing/mzML/data/files/" ...

# Running interactive mode

$ exfilms -x
```

<br>

### Docker

```md
# Using command line flags

$ docker run --rm -it -v "/path/to/input/directory/":/inputDirectory -v "/path/to/output/directory/":/outputDirectory -v "/path/to/log/directory/":/logDirectory exfilms -i /inputDirectory -o /outputDirectory -l /logDirectory ....

# Running interactive mode

$ docker run --rm -it -v "/path/to/input/directory/":/inputDirectory -v "/path/to/output/directory/":/outputDirectory -v "/path/to/log/directory/":/logDirectory exfilms -x
```

> [!NOTE]\
> Running ExfilMS using Docker requires the use of volume mapping in the executed Docker command using `-v "/path/on/the/local/machine/":/mappedPath`. Once the volume mapping is done, you would then use the appropriate mapped path as the input where required.
>
> For the successful execution of ExfilMS, you are required to map the following paths:
>
> - Input directory (`-v "/path/to/input/directory/":/inputDirectory`)
> - Output directory (`-v "/path/to/output/directory/":/outputDirectory`)
> - Log directory (`-v "/path/to/log/directory/":/logDirectory`)

<br>

For more guidance on how to use ExfilMS, please refer to our available guides below:

- [Data Conversion to mzML using ProteoWizard](./docs/data-conversion-to-mzml-using-proteowizard.md)
- [How to ExfilMS: The Complete Guide](./docs/how-to-exfilms-the-complete-guide.md)
- [How to Create a Target File](./docs/how-to-create-a-target-file.md)

<br>

## Limitations

> [!WARNING]
>
> 1. Unable to extract MS data from Bruker EVOQ instruments (Unsupported file formats by ProteoWizard).
>
> 2. Unable to parse mzML data with a file size > 2GB.
>
> 3. Large MS data may cause Node environment to terminate abruptly due to memory limit exhaustion.
>
> 4. May have slow output write speed due to build architecture difference.
>
> 5. Unable to perform chromatogram filtering (work in progress).

<br>

## Citations

If you use ExfilMS in your work, please cite it using the following:

Nambiar, V., & Nambiar, S. (2024). ExfilMS (Version 1.3.1) [Computer software]. https://doi.org/10.5281/zenodo.10976761

<br>

## License

Please refer to our license information [here](./LICENSE).

<!-- URLs used in the markdown document -->

[npm-image]: https://img.shields.io/npm/v/exfilms.svg
[npm-url]: https://www.npmjs.com/package/exfilms
[license-image]: https://img.shields.io/badge/License-MIT-yellow.svg
[license-url]: https://github.com/vimalnathnambiar/exfilms/blob/main/LICENSE
[cicd-image]: https://github.com/vimalnathnambiar/exfilms/actions/workflows/build-publish.yml/badge.svg
[cicd-url]: https://github.com/vimalnathnambiar/exfilms/actions/workflows/build-publish.yml
[codecov-image]: https://codecov.io/gh/vimalnathnambiar/exfilms/graph/badge.svg?token=V8O80QXJ5S
[codecov-url]: https://codecov.io/gh/vimalnathnambiar/exfilms
[semantic-image]: https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release
[semantic-url]: https://github.com/semantic-release/semantic-release
[downloads-image]: https://img.shields.io/npm/dm/exfilms.svg
[downloads-url]: https://www.npmjs.com/package/exfilms
[doi-zenodo-image]: https://zenodo.org/badge/DOI/10.5281/zenodo.10976761.svg
[doi-zenodo-url]: https://doi.org/10.5281/zenodo.10976761
[nodejs-url]: https://nodejs.org/en/download/
[docker-url]: https://docs.docker.com/engine/install/
