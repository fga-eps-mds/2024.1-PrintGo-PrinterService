# 2024.1-PrintGo-PrinterService

<div align="center">
     <img src="assets/logoPrintGo.svg" height="350px" width="350px">
</div>

## Quality Control

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=fga-eps-mds-1_2024-1-printgo-printerservice&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=fga-eps-mds-1_2024-1-printgo-printerservice)

<!-- Aplicação disponível em: [link da aplicação](?) -->

## Requisitos

- Node.js 18.18 (Latest em 10-05-2023)
- Docker
- Docker-compose

### Instalação

```bash
# 1. Clone o projeto
git clone https://github.com/fga-eps-mds/2024.1-PrintGo-PrinterService

# 2. Entre na pasta do projeto
cd 2024.1-PrintGo-PrinterService

docker-compose up --build
    # --build somente eh necessario na primeira vez que estiver rodando
    # depois `docker-compose up` ja resolve
    # em linux talvez seja necessario a execucao em modo root `sudo docker-compose up`
    # voce pode também caso queria adicionar um -d ao final para liberar o o terminal `docker-compose up -d`
    # Para finalizar o servico execute no root do projeto `docker-compose down`
```

## Contribuir

Para contribuir com esse projeto é importante seguir nosso [Guia de Contribuição](https://fga-eps-mds.github.io/2024.1-PrintGo-Doc/inicio/guia_contribuicao/).

## repositórios do projeto

[Api-Gateway](https://github.com/fga-eps-mds/2024.1-PrintGo-ApiGateway)  
[ContractService](https://github.com/fga-eps-mds/2024.1-PrintGo-ContractService)  
[Documentação](https://github.com/fga-eps-mds/2024.1-PrintGo-Doc)  
[FrontEnd](https://github.com/fga-eps-mds/2024.1-PrintGo-FrontEnd)  
[PrinterService](https://github.com/fga-eps-mds/2024.1-PrintGo-PrinterService)  
[UserService](https://github.com/fga-eps-mds/2024.1-PrintGo-UserService)  
