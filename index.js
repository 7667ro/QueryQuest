const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const Question = require('./models/question');
const proxy = require('@grpc-web/proxy');
require('dotenv').config();
const { insertData } = require('./models/insertData');

// Load proto file
// for reference you can check out the official Grpc documentation

const PROTO_PATH = './proto/question.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const questionProto = grpc.loadPackageDefinition(packageDefinition);



// Configure gRPC server with increased message size limits
// I encountered a gRPC error with status code 8 (RESOURCE_EXHAUSTED), 
// which typically occurs when a message exceeds the default size limits.
// To resolve this issue, I increased the message size limits by setting the following options:
// - grpc.max_receive_message_length: Maximum size (in bytes) for messages that the server can receive.
// - grpc.max_send_message_length: Maximum size (in bytes) for messages that the server can send.
// Both limits are set to 50 MB (50 * 1024 * 1024 bytes) to support larger payloads.

const server = new grpc.Server({
  'grpc.max_receive_message_length': 50 * 1024 * 1024, // 50 MB
  'grpc.max_send_message_length': 50 * 1024 * 1024,   // 50 MB
});

// Define gRPC service methods
server.addService(questionProto.question.QuestionService.service, {
  SearchQuestions: async (call, callback) => {
    const { query, page, limit } = call.request;

    try {
      const questions = await Question.find({
        title: { $regex: query, $options: 'i' },
      })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Question.countDocuments({
        title: { $regex: query, $options: 'i' },
      });

      callback(null, {
        questions: questions.map((q) => ({
          id: q._id.toString(),
          title: q.title,
          type: q.type,
          options: q.options || [],
          blocks: q.blocks || [],
        })),
        total,
      });
    } catch (err) {
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  },

  GetSuggestions: async (call, callback) => {
    const { query } = call.request;

    try {
      const suggestions = await Question.find({
        title: { $regex: query, $options: 'i' },
      })
        .limit(5)
        .select('title');

      callback(null, { suggestions: suggestions.map((s) => s.title) });
    } catch (err) {
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  },
});

// Start gRPC server
async function startGrpcServer() {
  return new Promise((resolve, reject) => {
    server.bindAsync(
      '0.0.0.0:50051',
      grpc.ServerCredentials.createInsecure(),
      (err) => {
        if (err) return reject(err);
        server.start();
        console.log('gRPC server running on port 50051');
        resolve();
      }
    );
  });
}

// Start gRPC-Web proxy server
async function startGrpcWebProxy() {
  return new Promise((resolve) => {
    proxy({ target: 'http://localhost:50051' }).listen(8082, () => {
      console.log('gRPC-Web proxy running on port 8082');
      resolve();
    });
  });
}

// Start both servers and connect to MongoDB
async function startServers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Uncomment this line to insert data into the database once.
    // After the data is inserted, comment out the `insertData` call to prevent duplicate entries
    // every time the server restarts. This ensures that the insertion logic is only executed 
    // when explicitly needed during development or testing.
    // await insertData();
    // console.log('Data inserted successfully');

    // Start gRPC server and gRPC-Web proxy
    await startGrpcServer();
    await startGrpcWebProxy();
  } catch (err) {
    console.error('Failed to start servers:', err);
    process.exit(1);
  }
}

startServers();
