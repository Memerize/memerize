import { NotificationModel } from "@/models/NotificationModel";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return new Response("Username is required", { status: 400 });
  }

  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  };

  const stream = new ReadableStream({
    async start(controller) {
      const sendNotification = (notification) => {
        controller.enqueue(`data: ${JSON.stringify(notification)}\n\n`);
      };

      const interval = setInterval(async () => {
        // Fetch all unseen notifications without the time filter for testing
        const newNotifications = await NotificationModel.findUnseenByUsername(
          username
        );

        if (newNotifications.length > 0) {
          sendNotification(newNotifications);
        }
      }, 5000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, { headers });
}
