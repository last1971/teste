export default (Express) => {
    const router = Express.Router();
    router.get('/', function(req, res, next) { res.render('index') });
    return router;
}