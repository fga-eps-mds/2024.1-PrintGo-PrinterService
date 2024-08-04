const cron = require('node-cron')
const { updatePrinterCounts } = require('../repository/Impressora.repository');

const schedulePrinterCountsUpdate = () => {
    cron.schedule('0 * * * *', async () => { // Every hour
        console.log('Iniciando a atualização das contagens de impressão...');
        const result = await updatePrinterCounts();
        if (result) {
            console.log('Contagens de impressão atualizadas com sucesso!');
        } else {
            console.log('Erro ao atualizar contagens de impressão.');
        }
    });
};

module.exports = {schedulePrinterCountsUpdate};
