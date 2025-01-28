import { db } from "@/lib/db";
import { chunkText, generateEmbeddings, generatePageSummary } from "@/lib/rag";
import { chunk } from 'llm-chunk';

export const embedSiteAction = async (userId: string, url: string) => {
    try {
        let siteContent: any = await fetch(`${process.env.CRAWL4AI_BE_URL}/crawl?url=${url}`)
        siteContent = await siteContent.json()
        console.log("Site content:", siteContent);

        const pageSummary = await generatePageSummary(siteContent.markdown)
        console.log("Summary:", pageSummary);

        const website = await db.website.create({
            data: {
                url: url,
                content: siteContent.markdown,
                title: url,
                summary: pageSummary,
                lastScraped: new Date(),
                userId: userId,
            }
        })

        const chunks = chunkText(siteContent.markdown)
        console.log("Chunks:", chunks);
        const allEmbeddings = await generateEmbeddings(chunks)
        console.log("Embeddings:", allEmbeddings);

        await Promise.allSettled(allEmbeddings.map(async (embedding, index) => {
            console.log(`processing ${index} of ${allEmbeddings.length}`);

            if (!embedding) return

            console.log("inserting ...");

            const websiteContentEmbedding = await db.websiteContentEmbedding.create({
                data: {
                    content: chunks[index],
                    websiteId: website.id,

                }
            })
            await db.$executeRaw`
            UPDATE "WebsiteContentEmbedding" 
            SET "embedding" = ${embedding}::vector
            WHERE "id" = ${websiteContentEmbedding.id}; 
        `

            console.log("inserted !");
        }))


    } catch (error) {
        console.log("Error embedding site:", error);
        throw error
    }
}


    // const model = genAI.getGenerativeModel({
    //     model: "text-embedding-004"
    // })
    // const result = await model.embedContent(summary);

    // const embedding = result.embedding
    // return embedding.values