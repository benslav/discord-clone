import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { DirectMessage } from "@prisma/client";
import { NextResponse } from "next/server";

// const DEFAULT_MESSAGES_BATCH = 10;
// const MAX_MESSAGES_BATCH = 100;
const MESSAGES_BATCH = 10;

export async function GET(
  req: Request
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!conversationId) {
      return new NextResponse("Conversation ID missing", { status: 400 });
    }

    // if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > MAX_MESSAGES_BATCH) {
    //   return new NextResponse("Invalid message limit", { status: 400 });
    // }

    let messages: DirectMessage[] = [];

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            }
          }
        },
        orderBy: {
          createdAt: "desc",
        }
      })
    } else {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            }
          }
        },
        orderBy: {
          createdAt: "desc",
        }
      });
    }

    // const messages = await db.message.findMany({
    //   take: batchSize + 1,
    //   ...(cursor && {
    //     skip: 1,
    //     cursor: { id: cursor },
    //   }),
    //   where: {
    //     channelId,
    //   },
    //   include: {
    //     member: {
    //       include: {
    //         profile: true,
    //       }
    //     }
    //   },
    //   orderBy: [
    //     { createdAt: "desc" },
    //     { id: "desc" },
    //   ],
    // });

    // const hasMore = messages.length > batchSize;
    // const items = messages.slice(0, batchSize).reverse();
    // const nextCursor = hasMore ? items[0]?.id ?? null : null;

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor
    });
  } catch (error) {
    console.log("[MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}