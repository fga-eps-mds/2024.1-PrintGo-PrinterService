import { updatePrinterCounts } from '../repository/Impressora.repository';

const runUpdatePrinterCounts = async () => {
    const result = await updatePrinterCounts();
    if (result) {
        console.log('Contagens de impressão atualizadas com sucesso!');
    } else {
        console.error('Erro ao atualizar contagens de impressão.');
    }
};

runUpdatePrinterCounts();
