import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads directory (Ensure this dir exists in a real scenario)
    const filename = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;
    const uploadPath = path.join(process.cwd(), "public/uploads", filename);
    
    await writeFile(uploadPath, buffer);

    // In a real app, update the database with this URL
    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}
