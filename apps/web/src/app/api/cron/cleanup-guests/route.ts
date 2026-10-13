import { NextResponse } from "next/server";
import db from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - 48);

    const result = await db.user.deleteMany({
      where: {
        isAnonymous: true,
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    console.log(
      `Deleted ${result.count} anonymous users inactive for 48+ hours`,
    );

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Error cleaning up anonymous users:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
};
