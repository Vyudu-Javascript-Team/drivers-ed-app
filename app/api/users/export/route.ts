import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { parse } from "json2csv"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Fetch all users (excluding sensitive data)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Convert to CSV
    const csv = parse(users)

    // Set headers for CSV download
    const headers = {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="users-${new Date().toISOString()}.csv"`,
    }

    return new NextResponse(csv, { headers })
  } catch (error) {
    console.error("Error exporting users:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
