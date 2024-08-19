import { createReport } from '../../src/usecases/report/generate.pdf';
import { RelatorioData as ReportData } from '../../src/types/Relatorio.type';
import htmlPdf from 'html-pdf';
import fs from 'fs';

jest.mock('html-pdf', () => ({
  create: jest.fn().mockReturnValue({
    toBuffer: jest.fn().mockImplementation((cb) => cb(null, Buffer.from('test'))),
  }),
}));

jest.mock('fs', () => ({
  readFileSync: jest.fn().mockReturnValue('{{reportDate}}{{lastReportDate}}{{installationDate}}{{printerSerial}}{{contractNumber}}{{installationDate}}{{location}}{{model}}{{blackWhiteCount}}{{blackWhiteCountChart}}{{colorCount}}{{colorCountChart}}{{previousGrowth}}{{currentGrowth}}{{currentGrowthChart}}{{blackWhiteBarWidth}}{{colorBarWidth}}'),
}));

describe('createReport', () => {
  it('should generate a report', async () => {
    const reportData: ReportData = {
      newReportDate: new Date(),
      lastReportDate: new Date(),
      printerSerial: '123',
      contractNumber: '456',
      installationDate: new Date(),
      blackWhiteCountDiff: 100,
      colorCountDiff: 200,
      location: 'test location',
      model: 'test model',
      previousGrowth: 1.23,
      currentGrowth: 4.56,
      blackWhiteCount: 100,
      colorCount: 200,
    };

    const result = await createReport(reportData);
    expect(result).toEqual(Buffer.from('test'));
    expect(htmlPdf.create).toHaveBeenCalled();
    expect(fs.readFileSync).toHaveBeenCalled();
  });
});

