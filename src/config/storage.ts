import dotenv from 'dotenv';
dotenv.config();

const storage = {
  oss: {
    region: process.env.ALIYUN_OSS_REGION,
    accessKeyId: process.env.ALIYUN_OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.ALIYUN_OSS_ACCESS_KEY_SECRET,
    bucket: process.env.ALIYUN_OSS_BUCKET,
    endpoint: process.env.ALIYUN_OSS_ENDPOINT,
  },

  mongodb: {
    uri: process.env.MONGODB_URI,
  },

  // rabbitmq: {
  //     url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  //     exchanges: {
  //         product: 'product_exchange',
  //     },
  //     queues: {
  //         productCreated: 'product.created',
  //         productUpdated: 'product.updated',
  //         productDeleted: 'product.deleted',
  //         stockUpdated: 'product.stock.updated',
  //     },
  // },

  // redis: {
  //     url: process.env.REDIS_URL || 'redis://localhost:6379',
  //     ttl: 3600, // 1 hour
  // },

  // elasticsearch: {
  //     node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
  //     index: 'products',
  // },
};

export default storage;
