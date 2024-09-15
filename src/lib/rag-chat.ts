import { RAGChat, upstash, groq } from "@upstash/rag-chat";
import { redis } from "./redis";

export const ragChat = new RAGChat({
    // model: upstash("meta-llama/Meta-Llama-3-8B-Instruct"),
    model: groq("llama-3.1-70b-versatile",{apiKey: process.env.GROQ_API_KEY}),
    redis: redis,
})