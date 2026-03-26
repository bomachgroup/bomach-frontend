import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL || "https://backend.bomachgroup.com";

function buildTarget(path: string[], search: string): string {
  return `${BACKEND_URL}/api/${path.join("/")}${search}`;
}

function forwardHeaders(request: NextRequest): Record<string, string> {
  const headers: Record<string, string> = {};
  const auth = request.headers.get("Authorization");
  if (auth) headers["Authorization"] = auth;
  return headers;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const target = buildTarget(path, request.nextUrl.search);

  const res = await fetch(target, {
    headers: forwardHeaders(request),
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
  const target = buildTarget(path, request.nextUrl.search);

  const contentType = request.headers.get("Content-Type") || "";
  const isFormData = contentType.includes("multipart/form-data");
  const headers = forwardHeaders(request);
  if (!isFormData) headers["Content-Type"] = "application/json";

  const res = await fetch(target, {
    method: "POST",
    headers,
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
  const target = buildTarget(path, request.nextUrl.search);

  const res = await fetch(target, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...forwardHeaders(request),
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
  const target = buildTarget(path, request.nextUrl.search);

  const res = await fetch(target, {
    method: "DELETE",
    headers: forwardHeaders(request),
  });

  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
  });
}
