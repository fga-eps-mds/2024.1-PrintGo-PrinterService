import { Response } from 'express';
import fs from 'fs';

export const sendFile = (response: Response, filePath: string, numSerie: string): Promise<Response> => {
    return new Promise<Response>((resolve, reject) => {
        response.download(filePath, `relatorio_${numSerie}.pdf`, (err) => {
            if (err) {
                console.error('Erro ao enviar o arquivo:', err);
                reject(response.status(500).json({ error: "Erro ao enviar o relatório" }));
            } else {
                fs.unlink(filePath, (unlinkErr: any) => {
                    if (unlinkErr) {
                        console.error('Erro ao deletar o arquivo:', unlinkErr);
                    } else {
                        console.log('Arquivo deletado com sucesso:', filePath);
                    }
                });
                resolve(response);
            }
        });
    });
}


