import { DbPopulator } from "./populateDb";
import dotenv from 'dotenv'

dotenv.config()
const args = process.argv.slice(2);

async function run() {
    if (process.env.MONGO_URI || args[0]) {
        try {
            let uri = process.env.MONGO_URI
            if (args[0]) {
                uri = args[0]
            }
            await new DbPopulator(uri as string).populate()
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