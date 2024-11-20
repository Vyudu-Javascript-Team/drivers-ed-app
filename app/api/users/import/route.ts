import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { parse } from "csv-parse/sync"
import { z } from "zod"

const userImportSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["STUDENT", "INSTRUCTOR", "ADMIN"]).default("STUDENT"),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return new NextResponse("No file provided", { status: 400 })
    }

    const csvText = await file.text()
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
    })

    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[],
    }

    for (const record of records) {
      try {
        const validatedData = userImportSchema.parse(record)

        await prisma.user.create({
          data: {
            ...validatedData,
            // Generate a random temporary password that must be changed on first login
            password: Math.random().toString(36).slice(-8),
            mustChangePassword: true,
          },
        })

        results.successful++
      } catch (error) {
        results.failed++
        if (error instanceof z.ZodError) {
          results.errors.push(`Row ${results.successful + results.failed}: ${error.errors.map(e => e.message).join(", ")}`)
        } else {
          results.errors.push(`Row ${results.successful + results.failed}: Unknown error`)
        }
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error importing users:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
