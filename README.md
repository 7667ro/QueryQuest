# QueryQuest
QueryQuest is a search tool designed to efficiently find questions, providing pagination and suggestions using gRPC. This project involves both frontend and backend setup, with Express, Mongoose, gRPC, and gRPC Web Proxy for communication.

## Backend



### Prerequisites

_A guide on how to install the tools needed for running the project._


### 1. Initialize the Node.js Project
Start by initializing a new Node.js project. This will create a package.json file to manage your dependencies.

```bash
npm init -y
```
### 2. Install the Required Dependencies
Install the necessary backend dependencies for the project:

Express: Web framework for handling HTTP requests.

Mongoose: MongoDB object modeling to interact with the database.

Nodemon: Automatically restart the server during development.

gRPC and Proto-Loader: For implementing gRPC communication with the frontend.

gRPC Web Proxy: For handling gRPC Web requests (useful especially on Windows).

Run the following commands to install these dependencies:

```bash
npm install express mongoose
npm install -g nodemon
npm install @grpc/grpc-js @grpc/proto-loader @grpc-web/proxy
```

### 3. Set Up gRPC with proto File
Define the structure of the data exchanged between the frontend and the backend using gRPC. This is done by creating a .proto file.

The .proto file defines the gRPC service (e.g., SearchQuestions, GetSuggestions) and the data structures involved in the communication.

Checkout my ./proto/question.proto

Define your request and response message structures.
Define the QuestionService with methods like SearchQuestions and GetSuggestions.

### 4. Install Protocol Buffers Compiler (protoc)
To work with gRPC and generate client and server code, you need the Protocol Buffers Compiler (protoc).

Download protoc version 3.15.8 from the official GitHub releases:

Link - [protoc](https://github.com/protocolbuffers/protobuf/releases/tag/v3.15.8)

* Disclaimer - May the newer version creates issues for node while .js file so with this version

Add protoc to your system's PATH to make it accessible globally in the terminal.

Check if protoc is installed correctly by running:
```bash
protoc --version
```
### 5. Set Up gRPC Server with Express and Proxy
Express will serve as the HTTP server.

@grpc/proxy will handle gRPC Web requests and forward them to the gRPC server.

The gRPC server will handle requests such as SearchQuestions and GetSuggestions.

### 6. Start the Backend Servers

Once you have set up the servers, run:
```bash
npm run dev
```
## Frontend
### 1. Create a React App
Create the React application to serve as the frontend for your project:
```bash
npx create-react-app frontend
```
### 3. Install Frontend Dependencies
In the frontend, install the necessary gRPC Web dependencies:

```bash
cd frontend
npm install @grpc/grpc-web google-protobuf grpc-web
```
### 4. Generate gRPC Client Code
To interact with the backend via gRPC, you need to generate client code from the question.proto file.

Steps to Generate gRPC Client Code:
1. Install the protoc-gen-grpc-web Plugin:

     Install the protoc-gen-grpc-web plugin globally by running the following command:
   ```bash
     npm install -g protoc-gen-grpc-web
   ```
 2. Generate Client Code from .proto File:

    Use protoc to generate the necessary gRPC Web client code. This will allow you to call gRPC services from the frontend.

    Run the following command from the root of your frontend project:

      ```bash
         protoc --proto_path=frontend/src/grpc \
       --js_out=import_style=commonjs,binary:frontend/src/grpc \
     --grpc-web_out=import_style=typescript,mode=grpcwebtext:frontend/src/grpc \
       frontend/src/grpc/question.proto
      ```
### 5. Start the Frontend
To run the frontend application, execute:
   ```bash
     npm start
   ```

## Deployment Details

Deployed on Render 

[queryQuest](https://queryquest-speakx.onrender.com/)

* Disclamer -
Please wait for a few minutes for suggestions and results (takes time to load).

## Documentation

[Official Documentation](https://grpc.io/)

                                               Thankyou

                                           
