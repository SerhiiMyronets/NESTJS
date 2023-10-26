// import { MongoMemoryServer } from 'mongodb-memory-server';
// import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
//
// let mongod: MongoMemoryServer;
//
// export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
//   MongooseModule.forRootAsync({
//     useFactory: async () => {
//       mongod = new MongoMemoryServer();
//       const mongoUri = mongod.getUri();
//       return {
//         uri: mongoUri,
//         ...options,
//       };
//     },
//   });
//
// export const closeInMongodConnection = async () => {
//   if (mongod) await mongod.stop();
// };
