# How to Create a Target File

> [!NOTE]\
> To create the target file, it is highly recommend to use Google Sheets. This will enable you to easily save and/or publish the sheet to the web as tsv with ease.

### Table of Contents

1. [File Layout](#file-layout)

2. [Save to Local Device](#save-to-local-device)

3. [Publish to Web](#publish-to-web)

<br>

## File Layout

The targeted m/z filtering method provided by ExfilMS for spectra filtering requires a target file. The target file consists of the following data:

- Compound Name (compoundName)

- Compound Type (compoundType)

  - Mass Calibration Reference
  - Internal Standard
  - Endogenous Analyte
  - Product

- m/z Value (mzValue)

- Retention Time (retentionTime)

- MS Level (msLevel)

- Internal Standard (internalStandard)

- Products (product)

<br>

To create the target file, you must follow the layout shown below.

![layout](../img/targetFile/layout.png)

> [!IMPORTANT]\
> The header names must match the headers displayed in the layout.

<br>

## Save to Local Device

To save the newly created target file as a tsv file to a local path on your device, you can do the following:

`File` > `Download` > `Tab Separated Values (.tsv)`

![save-local](../img/targetFile/save-local.png)

<br>

## Publish to Web

To publish the newly created target file as a tsv file to the web, you can do the following:

`File` > `Share` > `Publish to web`

![publish-web-1](../img/targetFile/publish-web-1.png)

Once you select the option, you will be prompted a pop-up box allowing you to specify how you would like to publish your content to the web. You can then use the options provided to link or embed your document.

<br>

For the purpose of ExfilMS, you should do the following:

1. Click on Link

2. Choose the sheet that you would like to publish from the dropdown options

3. Choose TSV format from the dropdown options

4. Publish

<br>

![publish-web-2](../img/targetFile/publish-web-2.png)

> [!NOTE]\
> Once you publish the sheet, you will be provided a link that you can then use as the input while using the `--targetFile` flag when running the targeted m/z filtering method for spectra filtering.

<!-- URLs used in the markdown document -->
