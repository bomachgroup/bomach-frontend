import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL || "https://backend.bomachgroup.com";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const target = `${BACKEND_URL}/api/${path.join("/")}${request.nextUrl.search}`;

  const res = await fetch(target, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const target = `${BACKEND_URL}/api/${path.join("/")}${request.nextUrl.search}`;

  const contentType = request.headers.get("Content-Type") || "";
  const isFormData = contentType.includes("multipart/form-data");

  const res = await fetch(target, {
    method: "POST",
    headers: {
      ...(request.headers.get("Authorization")
        ? { Authorization: request.headers.get("Authorization")! }
        : {}),
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    },
    body: isFormData ? await request.arrayBuffer() : await request.text(),
  });

  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const target = `${BACKEND_URL}/api/${path.join("/")}${request.nextUrl.search}`;

  const res = await fetch(target, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(request.headers.get("Authorization")
        ? { Authorization: request.headers.get("Authorization")! }
        : {}),
    },
    body: await request.text(),
  });

  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const target = `${BACKEND_URL}/api/${path.join("/")}${request.nextUrl.search}`;

  const res = await fetch(target, {
    method: "DELETE",
    headers: {
      ...(request.headers.get("Authorization")
        ? { Authorization: request.headers.get("Authorization")! }
        : {}),
    },
  });

  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
  });
}
