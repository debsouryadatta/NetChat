### Steps of Dev:
1. `pnpx create-next-app@latest .`
2. [...url] -> To get the URL passed after the domain name.
3. `pnpm install @upstash/rag-chat`
4. Setting up the ragChat upstash client in the rag-chat.ts
5. Using this in the [...url] page, grabbing the reconstructedUrl and passing it to the ragChat for pushing the splitted docs to the upstash vectordb.
6. Setting the UPSTASH_VECTOR_REST_URL, UPSTASH_VECTOR_REST_TOKEN in the .env file for vector db and also the QSTASH_TOKEN for the rag-chat.
7. For not pushing the content to upstash vector store if thats aldready done, following some steps -> 
    - Creating a upstash redis database
    - `pnpm i @upstash/redis`
    - Creating the redis database instance in the redis.ts
    - Adding the new urls in the redisdb in a set, next time if the url is already in the set, then not pushing the content to the upstash vector store.

8. Creating a ChatWrapper component, `pnpm i ai`, using the inbuilt ai sdk useChat hook for handling all the chat functionalities(like - {messages, handleInputChange, handleSubmit, input}).
9. Creating the "/api/chat-stream" route.ts, where the messages are handled and the response from the rag-chat is sent to the client.
10. Creating Messages.tsx and Message.tsx for displaying the messages, `pnpm i tailwind-merge clsx` -> to handle conditional tailwind classnames, exporting the cn func from the lib/utils.ts and using it in the Message.tsx
11. `pnpm i lucide-react` -> For icons, styling the Message and the Messages components.
12. Changing the layout.tsx to change the chat ui layout, also doing `npx shadcn@latest init` -> Not for the components, but for the css variables and their tailwind configurations.

13. `pnpm i @nextui-org/react` -> For the input component, Wrapping up the component with the Providers(NextUIProvider), also changing the tailwind config accordingly. [Unfortunately, the styles of the component was not working, so switched to shadcn components]
14. Creating the ChatInput component, defining the return types of the useChat hook(handleInputChange, handleSubmit, setInput) and using them in the ChatInput component.
15. Creating a middleware.ts file to set a random cookie before hitting the page if the request doesn't have any cookie.
16. Taking the cookie from the headers in the page.tsx and creating the a new sessionId which would contain even the reconstructedUrl.
17. Putting the redis instance into the rag-chat client so that it automatically saves the chats in the redis db according to the new sessionId.
18. Getting the initialMessages from the rag-chat history by just simply passing the sessionId and the amount of messages to be fetched(All the hard stuff are done under the hood by the rag-chat).
19. Also we can put Groq Api in the rag-chat client and use the other Open source models.