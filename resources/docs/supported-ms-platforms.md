# Supported MS Platforms

ExfilMS have been tested on data files acquired on the following MS platforms:

<table>
    <tr>
        <th rowspan=2>Vendor</th>
        <th rowspan=2>Platform</th>
        <th rowspan=2>Model</th>
        <th colspan=2>Accepted Data Files</th>
        <th rowspan=2>Status</th>
    </tr>
    <tr>
        <th>Proprietary Format</th>
        <th>Open Format</th>
    </tr>
    <tr>
        <td rowspan=6>Bruker</td>
        <td rowspan=2>TQ</td>
        <td rowspan=2>EVOQ</td>
        <td>WSMS .d</td>
        <td rowspan=12>.mzML</td>
        <td rowspan=2>Not working: Unsupported file format for mzML conversion using msConvert by ProteoWizard.
        </td>
    </tr>
    <tr>
        <td>tqControl .d</td>
    </tr>
    <tr>
        <td>MRMS</td>
        <td>solariX</td>
        <td>ftmsContol .d</td>
        <td>Working</td>
    </tr>
        <tr>
        <td>QToF</td>
        <td>Impact II</td>
        <td rowspan=2>otofControl .d</td>
        <td>Working</td>
    </tr>
    <tr>
        <td rowspan=2>timsToF</td>
        <td rowspan=2>timsToF Pro</td>
        <td rowspan=2>Not working: Node.js® I/O unable to read files > 2 GB (<a href="https://github.com/nodejs/node/issues/55864">GitHub issue</a>).
        </td>
    </tr>
    <tr>
        <td>timsControl .d</td>
    </tr>
    <tr>
        <td rowspan=3>Waters</td>
        <td>TQ</td>
        <td>XEVO TQ-XS</td>
        <td rowspan=3>MassLynx .raw</td>
        <td>Working</td>
    </tr>
    <tr>
        <td>DESI</td>
        <td>XEVO G2-XS QTOF</td>
        <td>Working</td>
    </tr>
    <tr>
        <td>REIMS</td>
        <td>XEVO G2-XS QTOF</td>
        <td>Working</td>
    </tr>
    <tr>
        <td rowspan=3>SCIEX</td>
        <td rowspan=3>TQ</td>
        <td rowspan=2>QTRAP 6500+</td>
        <td>Analyst .wiff</td>
        <td rowspan=2>Working</td>
    </tr>
    <tr>
        <td rowspan=2>SCIEX OS .wiff</td>
    </tr>
    <tr>
        <td>QTRAP 7500</td>
        <td>Working</td>
    </tr>
</table>

<!-- Links -->
