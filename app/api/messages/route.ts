import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const DEFAULT_MESSAGES_BATCH = 10;
const MAX_MESSAGES_BATCH = 100;

export async function GET(
  req: Request
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");
    const requestedBatchSize = searchParams.get("limit");
    const batchSize = requestedBatchSize === null
      ? DEFAULT_MESSAGES_BATCH
      : Number(requestedBatchSize);

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > MAX_MESSAGES_BATCH) {
      return new NextResponse("Invalid message limit", { status: 400 });
    }

    const messages = await db.message.findMany({
      take: batchSize + 1,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      where: {
        channelId,
      },
      include: {
        member: {
          include: {
            profile: true,
          }
        }
      },
      orderBy: [
        { createdAt: "desc" },
        { id: "desc" },
      ],
    });

    const hasMore = messages.length > batchSize;
    const items = messages.slice(0, batchSize).reverse();
    const nextCursor = hasMore ? items[0]?.id ?? null : null;

    return NextResponse.json({
      items,
      nextCursor
    });
  } catch (error) {
    console.log("[MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}