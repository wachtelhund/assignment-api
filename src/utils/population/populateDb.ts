import csvParser from 'csv-parser';
import { connect } from 'mongoose';
import { createReadStream } from 'fs';
import WeightModel from '../../api/v1/model/mongoose/schemas/weight.model';
import hiveData from './data/hives.json';
import HiveModel from '../../api/v1/model/mongoose/schemas/hive.model';
import HiveStatusModel from '../../api/v1/model/mongoose/schemas/hiveStatus.model';
import TemperatureModel from '../../api/v1/model/mongoose/schemas/temperature.model';
import HumidityModel from '../../api/v1/model/mongoose/schemas/humidity.model';
import HiveFlowModel from '../../api/v1/model/mongoose/schemas/hiveFlow.model';

export class DbPopulator {
    csvWeightPath = './src/utils/population/data/weight_2017.csv';
    csvTemperaturePath = './src/utils/population/data/temperature_2017.csv';
    csvHumidityPath = './src/utils/population/data/humidity_2017.csv';
    csvHiveFlowPath = './src/utils/population/data/flow_2017.csv';

    weightsJson: any[] = [];
    temperaturesJson: any[] = [];
    humiditiesJson: any[] = [];
    hiveFlowsJson: any[] = [];

    dbConnectionString = 'mongodb://localhost:27017/hive';

    constructor(dbConnectionString: string) {
        this.dbConnectionString = dbConnectionString;
    }

    public async populate() {
        await connect(this.dbConnectionString)
        console.log('Population connection OK!');
        

        await HiveModel.deleteMany({});
        await HiveStatusModel.deleteMany({});
        await WeightModel.deleteMany({});
        await TemperatureModel.deleteMany({});
        await HumidityModel.deleteMany({});
        await HiveFlowModel.deleteMany({});

        await HiveModel.insertMany(hiveData);

        const newHives = await HiveModel.find({});

        const hiveIds = newHives.map(hive => hive.id);

        await this.importWeightData();
        await this.importTemperatureData();
        await this.importHumidityData();
        await this.importHiveFlowData();

        for (let i = 0; i < 100; i++) {
            const weight = this.weightsJson[i];
            const temperature = this.temperaturesJson[i];
            const humidity = this.humiditiesJson[i];
            const hiveFlow = this.hiveFlowsJson[i];
            const randomHiveIndex = Math.floor(Math.random() * hiveIds.length);
            
            const hiveId = hiveIds[randomHiveIndex];

            await HiveFlowModel.create({
                hive_flow: hiveFlow.hive_flow,
                createdAt: hiveFlow.timestamp,
                parent_hive: hiveId
            });

            await WeightModel.create({
                weight: weight.weight,
                createdAt: weight.timestamp,
                parent_hive: hiveId
            });

            await TemperatureModel.create({
                temperature: temperature.temperature,
                createdAt: temperature.timestamp,
                parent_hive: hiveId
            });

            await HumidityModel.create({
                humidity: humidity.humidity,
                createdAt: humidity.timestamp,
                parent_hive: hiveId
            });
        }

        for (const hive of await HiveModel.find({})) {
            const temperature = await TemperatureModel.findOne({ parent_hive: hive.id }).sort({ createdAt: -1 });
            const humidity = await HumidityModel.findOne({ parent_hive: hive.id }).sort({ createdAt: -1 });
            const weight = await WeightModel.findOne({ parent_hive: hive.id }).sort({ createdAt: -1 });
            const hiveFlow = await HiveFlowModel.findOne({ parent_hive: hive.id }).sort({ createdAt: -1 });

            await HiveStatusModel.create({
                temperature: temperature?.temperature,
                humidity: humidity?.humidity,
                weight: weight?.weight,
                hive_flow: hiveFlow?.hive_flow,
                parent_hive: hive.id
            });
        }
    }

    importWeightData() {
        return new Promise<void>((resolve, reject) => {
            createReadStream(this.csvWeightPath)
                .pipe(csvParser())
                .on('data', (row) => {
                    const { timestamp, weight } = row;
                    this.weightsJson.push({
                        timestamp: new Date(timestamp),
                        weight: parseFloat(weight),
                    });
                })
                .on('end', () => {
                    console.log('CSV file successfully processed.');
                    resolve();
                })
                .on('error', (error) => {
                    console.error('Error reading or processing the CSV file:', error);
                    reject()
                });

        })
    }

    importTemperatureData() {
        return new Promise<void>((resolve, reject) => {
            createReadStream(this.csvTemperaturePath)
                .pipe(csvParser())
                .on('data', (row) => {
                    const { timestamp, temperature } = row;
                    this.temperaturesJson.push({
                        timestamp: new Date(timestamp),
                        temperature: parseFloat(temperature),
                    });
                })
                .on('end', () => {
                    console.log('CSV file successfully processed.');
                    resolve();
                })
                .on('error', (error) => {
                    console.error('Error reading or processing the CSV file:', error);
                    reject();
                });
        })
    }

    importHumidityData() {
        return new Promise<void>((resolve, reject) => {
            createReadStream(this.csvHumidityPath)
                .pipe(csvParser())
                .on('data', (row) => {
                    const { timestamp, humidity } = row;
                    this.humiditiesJson.push({
                        timestamp: new Date(timestamp),
                        humidity: parseFloat(humidity),
                    });
                })
                .on('end', () => {
                    console.log('CSV file successfully processed.');
                    resolve();
                })
                .on('error', (error) => {
                console.error('Error reading or processing the CSV file:', error);
                    reject()
                });
        })
    }

    importHiveFlowData() {
        return new Promise<void>((resolve, reject) => {
            createReadStream(this.csvHiveFlowPath)
                .pipe(csvParser())
                .on('data', (row) => {
                    const { timestamp, flow } = row;
                    this.hiveFlowsJson.push({
                        timestamp: new Date(timestamp),
                        hive_flow: parseFloat(flow),
                    });
                })
                .on('end', () => {
                    console.log('CSV file successfully processed.');
                    resolve();
                })
                .on('error', (error) => {
                    console.error('Error reading or processing the CSV file:', error);
                    reject();
                });

        })
    }

}
