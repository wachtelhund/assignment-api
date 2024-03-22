import { DbPopulator } from "./populateDb";
import dotenv from 'dotenv'

dotenv.config()

async function run() {
    if (process.env.MONGO_URI) {
        try {
            await new DbPopulator(process.env.MONGO_URI).populate()
            console.log('Database populated');
        } catch (error) {
            console.log(error);
        }
        process.exit(0)
    } else {
        throw new Error('No connection string provided for populator.')
    }
}

run()