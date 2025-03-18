# ExfilMS: The Complete Guide

#### Table of Contents

- [Installation][installation]

- [Usage][usage]

  - [Interactive Mode][interactive-mode]

  - [Command-Line][command-line]

- [Uninstallation][uninstallation]

## Installation

> _Prerequisites: [Node.js®][nodejs] and [Docker®][docker]_

To install ExfilMS, run:

```bash
sudo npm install -g exfilms
```

## Usage

To use ExfilMS, you can configure its parameters using one of the following approaches:

### Interactive Mode

To configure via interactive mode, run:

```bash
exfilms -x
```

### Command-Line

To configure via the command-line:

```bash
$ exfilms <options> <suboptions>
```

#### Options

`-i`, `--input-directory` **_\*Required_**

Set input directory path.

Input directory should contain MS data files for extraction. To extract from specific data files, you can define the file names using `--file-list` (space-separated) [Default: "all"].

> _Please refer to our list of supported MS platforms [here][supported-ms-platforms]._

Example:

```bash
# To extract from specific MS data files
$ exfilms -i "input directory path" --file-list "file 1.mzML" "file 2.mzML"
```

`-o`, `--output-directory`

Set output directory path.

Default: "/user home directory/exfilms/input directory name/"

Example:

```bash
# To define output directory path
$ exfilms -i "input directory path" -o "output directory path"
```

`-f`, `--output-format`

Set output format.

Default: "JSON" | Choices: "JSON"

Example:

```bash
# To write output in JSON
$ exfilms -i "input directory path" -f "JSON"
```

`-p`, `--precision`

Set number of decimal places to round precision values to.

Precision values include scan time points, m/z values, and intensities.

Default: "original=NaN"

> _Requires NaN or a numeric value greater than or equal to zero (>=0)._

Example:

```bash
# To round precision values to 4 decimal places
$ exfilms -i "input directory path" -p 4
```

`-m`, `metadata`

Exclude spectrum array.

Spectrum array (m/z and intensity values) will be replaced with empty arrays when being written into the output file.

Default: false

Example:

```bash
# To exclude spectrum array
$ exfilms -i "input directory path" -m
```

##### Spectrum Data Filtering

To filter the spectrum data, use `-s`, `--filter-spectrum-data` [Default: false] to configure filtering parameters of the following data properties:

`--ms-level`

Set MS level to filter for (space-separated).

Default: "all=NaN"

> _Requires NaN or numeric values greater than zero (>0)._

Example:

```bash
# To filter for MS1 and MS2 spectrum
$ exfilms -i "input directory path" -s --ms-level 1 2
```

`--spectrum-type`

Set spectrum type to filter for (space-separated).

Default: All | Choices: "profile", "centroid"

Example:

```bash
# To filter for profile and centroid spectrum type
$ exfilms -i "input directory path" -s --spectrum-type "profile" "centroid"
```

`--spectrum-polarity`

Set spectrum polarity to filter for (space-separated).

Default: All | Choices: "positive", "negative"

Example:

```bash
# To filter for positive and negative spectrum polarity
$ exfilms -i "input directory path" -s --spectrum-polarity "positive" "negative"
```

###### Spectrum Array Filtering

With spectrum data filtering enabled, you can also filter the spectrum array (m/z and intensity values) using one of the following approaches:

`--spectrum-array-target`

Filter spectrum array for a target list of m/z values by defining a TSV `--target-file` path (local or remote URL) and the accepted `--target-tolerance` (mz=? ppm=?) [Default: "mz=0.005", "ppm=5"].

Default: false

> _**--target-file** requires a local path or remote URL to a TSV file with a defined layout. Please refer to our list of available templates [here][target-file-templates]._\
> _**--target-tolerance** requires the use of "mz=" and "ppm=" to define a numeric value respectively._

Example:

```bash
# To filter for a target list of m/z values
$ exfilms -i "input directory path" -s --spectrum-array-target --target-file "target file.tsv" --target-tolerance mz=0.005 ppm=5
```

`--spectrum-array-range`

Filter spectrum array for a range of m/z values by defining the `--mz-range` (min=? max?) [Default: "min=0", "max=NaN"].

Default: false

> _**--mz-range** requires the use of "min=" and "max=" to define a value respectively. "min=" requires a numeric value greater than or equal to zero (>=0) and "max=" requires a NaN or a numeric value greater than "min=". To filter to the end of the m/z range, set "max=NaN"._

Example:

```bash
# To filter for a range of m/z values
$ exfilms -i "input directory path" -s --spectrum-array-range --mz-range min=0 max=NaN
```

## Uninstallation

To uninstall ExfilMS, run:

```bash
sudo npm uninstall -g exfilms
```

<!-- Links -->

[installation]: exfilms.md#installation
[usage]: exfilms.md#usage
[interactive-mode]: exfilms.md#interactive-mode
[command-line]: exfilms.md#command-line
[uninstallation]: exfilms.md#uninstallation
[nodejs]: https://nodejs.org/en/download/
[docker]: https://docs.docker.com/engine/install/
[supported-ms-platforms]: supported-ms-platforms.md
[target-file-templates]: target-file-templates.md
