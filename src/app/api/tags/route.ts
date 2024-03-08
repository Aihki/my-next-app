import { requireAuth } from "@/lib/authActions";
import { fetchAllTags, postTag } from "@/models/tagModel";
import { MediaItemTag } from "@/types/DBTypes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    requireAuth();
  try {
    const tagData = (await request.json()) as {book_id: number, tag_name: string};

    if (!tagData.book_id || !tagData.tag_name) {
      return new NextResponse('book_id and tag_name are required', { status: 400 });
    }

    const postResult = await postTag(tagData.tag_name, tagData.book_id);

    if (!postResult) {
      return new NextResponse('Error adding tag to database', { status: 500 });
    }

    return new NextResponse(JSON.stringify(postResult), { status: 200 });

  } catch (error) {
    return new NextResponse('Error adding tag to database', { status: 500 });
  }

}

export async function GET(request: NextRequest) {
  try {
  const tagData = await fetchAllTags();
  return new NextResponse(JSON.stringify(tagData), { status: 200 });
  }
  catch (error) {
    return new NextResponse('Error fetching tags', { status: 500 });
  }
} 