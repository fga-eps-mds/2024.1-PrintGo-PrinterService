import htmlPdf from 'html-pdf';
import fs from 'fs';
import { format } from 'date-fns';
import { RelatorioData as ReportData } from '../../types/Relatorio.type';

export async function createReport(reportData: ReportData): Promise<Buffer> {
    const {
        newReportDate,
        lastReportDate,
        printerSerial,
        contractNumber,
        installationDate,
        blackWhiteCountDiff,
        colorCountDiff,
        location,
        model,
        previousGrowth,
        currentGrowth,
    } = reportData;
    console.log(blackWhiteCountDiff, colorCountDiff);

    const reportDateString = format(newReportDate, 'dd/MM/yyyy');
    const lastDateString = format(lastReportDate, 'dd/MM/yyyy');
    const installationDateString = format(installationDate, 'dd/MM/yyyy');

    const blackWhiteBarWidth = Math.min((blackWhiteCountDiff / 2000) * 100, 100);
    const colorBarWidth = Math.min((colorCountDiff / 2000) * 100, 100);

    let htmlTemplate = fs.readFileSync("./templates/report.html", 'utf-8');
    htmlTemplate = htmlTemplate
        .replace('{{reportDate}}', reportDateString)
        .replace('{{lastReportDate}}', lastDateString)
        .replace('{{installationDate}}', installationDateString)
        .replace('{{printerSerial}}', printerSerial)
        .replace('{{contractNumber}}', contractNumber)
        .replace('{{installationDate}}', installationDateString)
        .replace('{{location}}', location)
        .replace('{{model}}', model)
        .replace('{{blackWhiteCount}}', blackWhiteCountDiff.toString())
        .replace('{{blackWhiteCountChart}}', blackWhiteCountDiff.toString())
        .replace('{{colorCount}}', colorCountDiff.toString())
        .replace('{{colorCountChart}}', colorCountDiff.toString())
        .replace('{{previousGrowth}}', previousGrowth.toFixed(2))
        .replace('{{currentGrowth}}', currentGrowth.toFixed(2))
        .replace('{{currentGrowthChart}}', currentGrowth.toFixed(2))
        .replace('{{blackWhiteBarWidth}}', blackWhiteBarWidth.toString())
        .replace('{{colorBarWidth}}', colorBarWidth.toString())

    return new Promise((resolve, reject) => {
        htmlPdf.create(htmlTemplate).toBuffer((err, buffer) => {
            if (err) return reject(err);
            resolve(buffer);
        });
    });
}

