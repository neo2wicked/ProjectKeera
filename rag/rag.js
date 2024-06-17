import { OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { PromptTemplate } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

import dotenv from 'dotenv';
dotenv.config();

/*const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
const namespace = "langchain.test";
const [dbName, collectionName] = namespace.split(".");
const collection = client.db(dbName).collection(collectionName);

const vectorStore = new MongoDBAtlasVectorSearch(new OpenAIEmbeddings(), {
    collection,
    indexName: "default", // The name of the Atlas search index. Defaults to "default"
    textKey: "text", // The name of the collection field containing the raw content. Defaults to "text"
    embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
  });*/


  //const response = await llm.invoke("Why is the sky blue?");
  //console.log(response.content);

  async function generate(question) {
    const llm = new ChatAnthropic({
      model: "claude-3-haiku-20240307",
      temperature: 0,
      apiKey: process.env.OPENAI_API_KEY,
    });
  
    const prompt = PromptTemplate.fromTemplate(
      "You are a change management consultant hired to analyze user feedback and provide insights into the direction the user is trying to move and what change management strategies would be appropriate.\
       Given document: {context} \
       - The document/data containing user responses, feedback, comments etc.\
       Tasks:\
       1. Carefully review and analyze the user responses in the provided document.\
       2. Identify recurring themes, pain points, desired changes, and goals expressed by the users.\
       3. Based on your analysis, provide insights into the overarching direction or change that the users seem to be driving towards.\
       4. Recommend suitable change management strategies, approaches, and best practices to effectively navigate and manage the identified change.\
       5. Highlight potential challenges, risks, and resistance points that may arise during the change process, and suggest mitigation strategies.\
       6. Emphasize the importance of stakeholder involvement, communication, training, and continuous improvement throughout the change lifecycle.\
       Your response should be structured, well-reasoned, and actionable, providing clear guidance to support successful change implementation aligning with user needs and objectives.\
       Please let me know if you need any clarification or additional context before proceeding with the analysis."
    );
  
    const loader = new PDFLoader("Response 1_ Awareness of Changes.pdf");
    const docs = await loader.load();
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splits = await textSplitter.splitDocuments(docs);
    const vectorStore = await MemoryVectorStore.fromDocuments(splits, new OpenAIEmbeddings());
    const retriever = vectorStore.asRetriever();
  
    const ragChain = await createStuffDocumentsChain({ llm, prompt });
    const retrievedDocs = await retriever.invoke(question);
    const response = await ragChain.invoke({ question: question, context: retrievedDocs });
  
    return response;
  }

  const question = "What are some insights from the surveys/user responses that can be used to bring in change management?";
  const answer = await generate(question);
  console.log(answer);