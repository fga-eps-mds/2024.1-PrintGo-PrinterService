import { Request, Response } from 'express';

export default {
    async listLocations(_request: Request, response: Response) {
        try {
            let result = mockLocations;
            return response.status(201).json({
                message: 'Sucesso: Localizações listadas com sucesso!',
                data: result
            });

        } catch (error) {
            return response.status(500).json({
                error: true,
                message: 'Erro: Ocorreu um erro ao listar as localizações.'
            });
        }
    },
};

const mockLocations = [
    {
        id: '1',
        name: 'Goiânia',
        state: 'GO',
        workstations: [
            {
                id: '101',
                name: 'Workstation A',
                phone: '1234-5678',
                ip: '192.168.0.1',
                gateway: '192.168.0.254',
                is_regional: true,
                vpn: true,
                parent_workstation: null,
                child_workstations: [
                    {
                        id: '102',
                        name: 'Workstation B',
                        phone: '2345-6789',
                        ip: '192.168.0.2',
                        gateway: '192.168.0.254',
                        is_regional: false,
                        vpn: true,
                        parent_workstation: { id: '101', name: 'Workstation A' },
                        child_workstations: []
                    }
                ]
            }
        ]
    },
    {
        id: '2',
        name: 'Anápolis',
        state: 'GO',
        workstations: [
            {
                id: '201',
                name: 'Workstation C',
                phone: '3456-7890',
                ip: '192.168.1.1',
                gateway: '192.168.1.254',
                is_regional: false,
                vpn: true,
                parent_workstation: null,
                child_workstations: []
            }
        ]
    },
    {
        id: '3',
        name: 'Aparecida de Goiânia',
        state: 'GO',
        workstations: [
            {
                id: '301',
                name: 'Workstation D',
                phone: '4567-8901',
                ip: '192.168.2.1',
                gateway: '192.168.2.254',
                is_regional: true,
                vpn: true,
                parent_workstation: null,
                child_workstations: [
                    {
                        id: '302',
                        name: 'Workstation E',
                        phone: '5678-9012',
                        ip: '192.168.2.2',
                        gateway: '192.168.2.254',
                        is_regional: false,
                        vpn: true,
                        parent_workstation: { id: '301', name: 'Workstation D' },
                        child_workstations: []
                    }
                ]
            }
        ]
    }
];

