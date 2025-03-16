# Supported MS Platforms

ExfilMS have been tested on data files acquired on the following MS platforms:

<table>
    <tr>
        <th rowspan=2>Vendor</th>
        <th rowspan=2>Platform</th>
        <th rowspan=2>Model</th>
        <th rowspan=2>Acquisition Software</th>
        <th colspan=2>Accepted Data Files</th>
        <th rowspan=2>Status</th>
    </tr>
    <tr>
        <th>Proprietary Format</th>
        <th>Open Format</th>
    </tr>
    <tr>
        <td rowspan=5>Bruker</td>
        <td rowspan=2>TQ</td>
        <td rowspan=2>EVOQ</td>
        <td>WSMS</td>
        <td rowspan=5>D</td>
        <td rowspan=11>mzML</td>
        <td rowspan=2>Not working:<br>Unsupported file format by ProteoWizard (reader failure).</td>
    </tr>
        <tr>
        <td>tqControl</td>
    </tr>
    <tr>
        <td>MRMS</td>
        <td>solariX</td>
        <td>ftmsControl</td>
        <td>Working</td>
    </tr>
    <tr>
        <td>QToF</td>
        <td>Impact II</td>
        <td>otofControl</td>
        <td>Working</td>
    </tr>
    <tr>
        <td>timsToF</td>
        <td>timsToF Pro</td>
        <td>timsControl</td>
        <td>Not working:<br>Node.js® I/O limitation to read files > 2 GB (<a href="https://github.com/nodejs/node/issues/55864">GitHub issue</a>).</td>
    </tr>
    <tr>
        <td rowspan=3>Waters</td>
        <td>TQ</td>
        <td>XEVO TQ-XS</td>
        <td rowspan=3>MassLynx</td>
        <td rowspan=3>RAW</td>
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
        <td>Analyst</td>
        <td rowspan=3>WIFF</td>
        <td>Working</td>
    </tr>
    <tr>
        <td rowspan=2>SCIEX OS</td>
        <td>Working</td>
    </tr>
    <tr>
        <td>QTRAP 7500</td>
        <td>Working</td>
    </tr>
</table>

<!-- Links -->
