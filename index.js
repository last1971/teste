import App from './App';
import services from './services';



const app = new App(services());

app.start();

const { Product } = app.services.db.models;

app.services.db.connection.transaction((t) => {
    return Product.create({name: 'HZ1', producer_id: 1}).then((res) => {
        console.log(res)
    });
});



export default app;
