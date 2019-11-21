import { inspect } from 'util';
import Sequelize from 'sequelize';

export default function DatabaseConnection (config, logger, namespace) {

    const logging = (...args) => {
        args = args.map((arg) => {
            return inspect(arg);
        });

        logger.debug(...args);
    };


    Sequelize.useCLS(namespace);
    return new Sequelize(config.db
        /*{
        logging,
        define: {
            underscored: true,
        }}*/
    );
}