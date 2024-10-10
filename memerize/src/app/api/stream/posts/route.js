import { PostModel } from "@/models/PostModel";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(
    (async function* () {
      let lastPostCount = await PostModel.collection().countDocuments();

      while (true) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const newPostCount = await PostModel.collection().countDocuments();

        if (newPostCount > lastPostCount) {
          yield `data: ${newPostCount - lastPostCount} new posts available\n\n`;
          lastPostCount = newPostCount;
        }
      }
    })(),
    {
      headers: {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
      },
    }
  );
}
