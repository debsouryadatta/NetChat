import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

export function chunkText(text: string, maxChunkSize: number = 1000, minChunkSize: number = 100, overlap: number = 200): string[] {
    const chunks: string[] = [];
    let start = 0;
    const textLength = text.length;

    while (start < textLength) {
        // Calculate end position
        let end = Math.min(start + maxChunkSize, textLength);

        // If we're at the end of the text, just take what's left
        if (end >= textLength) {
            const finalChunk = text.slice(start).trim();
            if (finalChunk.length >= minChunkSize) {
                chunks.push(finalChunk);
            } else if (chunks.length > 0) {
                // Append to the last chunk if it's too small
                chunks[chunks.length - 1] += ' ' + finalChunk;
            } else {
                // If it's the only chunk, keep it despite being small
                chunks.push(finalChunk);
            }
            break;
        }

        // Try to find a code block boundary first (```)
        const chunk = text.slice(start, end);
        const codeBlock = chunk.lastIndexOf('```');
        if (codeBlock !== -1 && codeBlock > minChunkSize) {
            end = start + codeBlock;
        }
        // If no code block, try to break at a paragraph
        else if (chunk.includes('\n\n')) {
            // Find the last paragraph break
            const lastBreak = chunk.lastIndexOf('\n\n');
            if (lastBreak > minChunkSize) {
                end = start + lastBreak;
            }
        }
        // If no paragraph break, try to break at a sentence
        else if (chunk.includes('. ')) {
            // Find the last sentence break
            const lastPeriod = chunk.lastIndexOf('. ');
            if (lastPeriod > minChunkSize) {
                end = start + lastPeriod + 1;
            }
        }

        // Extract chunk and clean it up
        const currentChunk = text.slice(start, end).trim();
        if (currentChunk.length >= minChunkSize) {
            chunks.push(currentChunk);
        }

        // Move start position for next chunk, accounting for overlap
        start = Math.max(start + 1, end - overlap);
    }

    return chunks;
}

export async function generateEmbeddings(chunks: string[]) {
    const model = genAI.getGenerativeModel({
        model: "text-embedding-004"
    })

    return await Promise.all(chunks.map(async (chunk) => {
        const result = await model.embedContent(chunk);
        const embedding = result.embedding
        return embedding.values
    }))
}

export async function generatePageSummary(pageContent: string) {
    try {
        const result = await model.generateContent({
            contents: [
                {
                    role: 'system',
                    parts: [
                        {
                            text: `
    You are a precise and comprehensive summarization assistant. Analyze the given content and create a detailed, structured summary following these guidelines:

1. Structure the summary in the following format:
   - MAIN TOPIC: Capture the primary subject/theme
   - KEY POINTS: List major points, concepts, and arguments
   - SUPPORTING DETAILS: Include relevant examples, data, or evidence
   - CONCLUSIONS: Summarize main takeaways or results
   
2. Ensure the summary:
   - Maintains original content's meaning and context
   - Uses clear, concise language
   - Preserves technical terms and specific data
   - Follows a logical flow
   - Includes numerical data and statistics if present
   
3. Format Requirements:
   - Use bullet points for better readability
   - Keep sentences focused and direct
   - Maintain hierarchical structure
   - Include section headers
    ` }]
                },
                {
                    role: 'user',
                    parts: [{
                        text: pageContent,
                    }],
                }
            ],
            generationConfig: {
                temperature: 0.3,
                topK: 40,
                topP: 0.8,
                maxOutputTokens: 4096,
            }
        });

        return result.response.text();
    } catch (error) {
        console.error("Error generating summary:", error);
        throw new Error("Failed to generate summary");
    }
}

