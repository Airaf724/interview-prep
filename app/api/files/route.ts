import { pinata } from "@/utils/config";
import { db } from "@/firebase/admin";   // Import your Firebase admin
import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const userId = user?.id
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }

    // Upload file to Pinata
    const uploadData = await pinata.upload.public.file(file);
    
    // Get the public URL
    const url = await pinata.gateways.public.convert(uploadData.cid)
        
    // Update user document in Firestore
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      resumeUrl: url,
      resumeUploadedAt: new Date(),
      resumeFileName: file.name
    });
    
    // Return the URL in the expected format
    return NextResponse.json({ url }, { status: 200 });
  } catch (e) {
    console.error("Error during upload:", e);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: e instanceof Error ? e.message : "Unknown error" 
    }, { status: 500 });
  }
}