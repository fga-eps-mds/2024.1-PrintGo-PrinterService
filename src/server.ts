import Express from 'express';
import cors from 'cors';
import locationRoutes from './routes/location.route';
import padraoRoutes from './routes/padrao.route';
import impressoraRoutes from './routes/impressora.route';
import reportRoutes from './routes/report.route';
import rotinaSnmpRoutes from './routes/rotinaSnmp.route';
import dashboardRoutes from './routes/dashboard.route';

// import locadoraRoutes from './routes/locadora.route';
import { reportSchedule } from './usecases/report/schedule.report';
import { carregaRotinasSnmp } from './snmp/cronJobs';

if (reportSchedule !== null)
    reportSchedule.start();

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
};


const app = Express();
app.use(Express.json());
const PORT = process.env.PORT || 8001;

app.use(cors(corsOptions));

// app.use('/locadora', locadoraRoutes);
app.use('/location', locationRoutes);
app.use('/report', reportRoutes);
app.use('/padrao', padraoRoutes)
app.use('/rotina', rotinaSnmpRoutes);
app.use('/', impressoraRoutes);
app.use('/dashboard', dashboardRoutes);

const server = app.listen(PORT, () => {
    console.log(`Server is running ${PORT}`);
});

carregaRotinasSnmp();

export { server };

export default app;
