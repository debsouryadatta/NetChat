import { ChatWrapper } from '@/components/ChatWrapper';
import { ragChat } from '@/lib/rag-chat';
import { redis } from '@/lib/redis';
import { cookies } from 'next/headers';
import { auth } from '@clerk/nextjs/server'
import { embedSiteAction } from '@/actions/rag';

interface PageProps {
    params: {
        url: string | string[] | undefined;
    }
}

function reconstructUrl({url}: {url: string[]}){
    const decodedComponents = url.map((component) => decodeURIComponent(component));
    return decodedComponents.join('/');
}

export default async function page({params}: PageProps) {
    const { userId, redirectToSignIn } = await auth()

    if (!userId) return redirectToSignIn()

    console.log(params);
    const reconstructedUrl = "https://info.cern.ch/hypertext/WWW/TheProject.html"
//     const reconstructedUrl = reconstructUrl({ url: params.url as string[] })

//     const sessionId = (reconstructedUrl + "--" + sessionCookie).replace(/\//g, ""); // replacing the slashes with empty string to avoid redis key errors

    const userIdUrlCombo = (userId + "--" + reconstructedUrl).replace(/\//g, ""); // replacing the slashes with empty string to avoid redis key errors
    const isAlreadyIndexed = await redis.sismember("indexed-urls", userIdUrlCombo);

    // if(!isAlreadyIndexed){
        await embedSiteAction(userId, reconstructedUrl)
        await redis.sadd("indexed-urls", userIdUrlCombo);
    // }

//     const initialMessages = await ragChat.history.getMessages({ amount: 10, sessionId });

    
//     if(!isAlreadyIndexed){
//         await ragChat.context.add({
//             type: "html",
//             source: reconstructedUrl,
//             config: {chunkOverlap: 50, chunkSize: 200},
//         })

//         await redis.sadd("indexed-urls", reconstructedUrl);
//     }


//   return <ChatWrapper sessionId={sessionId} initialMessages={initialMessages} />
}
