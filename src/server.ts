import Express from 'express';
import cors from 'cors';
import locationRoutes from './routes/location.route';
import padraoRoutes from './routes/padrao.route';
import impressoraRoutes from './routes/impressora.route'

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
};


const app = Express();
app.use(Express.json());
const PORT = process.env.PORT || 8001;

app.use(cors(corsOptions));

app.use('/location', locationRoutes);
app.use('/padrao', padraoRoutes)
app.use('/', impressoraRoutes);

const server = app.listen(PORT, () => {
    console.log(`Server is running ${PORT}`);
});

export { server };

export default app;


