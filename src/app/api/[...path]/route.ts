import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL || "https://backend.bomachgroup.com";

function buildTarget(path: string[], search: string): string {
  let targetPath = path.join("/");
  // Only append trailing slash if it's a single segment path (likely a collection)
  // or it already had one (though Next.js strips it, we can guess based on path length)
  // Endpoints like 'properties/upload-file' should NOT have a trailing slash if they didn't before.
  if (path.length === 1 && targetPath && !targetPath.includes(".")) {
    targetPath += "/";
  }
  return `${BACKEND_URL}/api/${targetPath}${search}`;
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

  const range = request.headers.get("Range");
  const headers = forwardHeaders(request);
  if (range) {
    headers["Range"] = range;
  }

  try {
    const res = await fetch(target, {
      headers,
    });

    const responseHeaders: Record<string, string> = {
      "Content-Type": res.headers.get("Content-Type") || "application/json",
    };

    // Forward streaming/range headers to enable video seek/stream
    const contentRange = res.headers.get("Content-Range");
    if (contentRange) responseHeaders["Content-Range"] = contentRange;
    
    const acceptRanges = res.headers.get("Accept-Ranges");
    if (acceptRanges) responseHeaders["Accept-Ranges"] = acceptRanges;
    
    const contentLength = res.headers.get("Content-Length");
    if (contentLength) responseHeaders["Content-Length"] = contentLength;

    return new NextResponse(res.body, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error(`[API Proxy GET] Error fetching ${target}:`, error);
    const isTimeout = error.name === 'AbortError' || error.code === 'UND_ERR_CONNECT_TIMEOUT' || error.message.includes('timeout');
    return new NextResponse(JSON.stringify({
      error: isTimeout ? "Gateway Timeout" : "Internal Server Error",
      detail: error.message
    }), {
      status: isTimeout ? 504 : 502,
      headers: { "Content-Type": "application/json" },
    });
  }
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
  if (isFormData) {
    // Forward the full Content-Type including the boundary
    headers["Content-Type"] = contentType;
  } else {
    headers["Content-Type"] = "application/json";
  }

  try {
    const res = await fetch(target, {
      method: "POST",
      headers,
      body: isFormData ? request.body : await request.text(),
      // @ts-ignore
      duplex: isFormData ? "half" : undefined,
    });

    const data = await res.text();
    
    if (!res.ok) {
      console.error(`[API Proxy POST] Backend error ${res.status} for ${target}:`, data.substring(0, 500));
    }

    return new NextResponse(data, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
    });
  } catch (error: any) {
    console.error(`[API Proxy POST] Error fetching ${target}:`, error);
    const isTimeout = error.name === 'AbortError' || error.code === 'UND_ERR_CONNECT_TIMEOUT' || error.message.includes('timeout');
    return new NextResponse(JSON.stringify({
      error: isTimeout ? "Gateway Timeout" : "Internal Server Error",
      detail: error.message
    }), {
      status: isTimeout ? 504 : 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const target = buildTarget(path, request.nextUrl.search);

  try {
    const contentType = request.headers.get("Content-Type") || "";
    const isFormData = contentType.includes("multipart/form-data");
    const headers = {
      ...forwardHeaders(request),
      "Content-Type": isFormData ? contentType : "application/json"
    };

    const res = await fetch(target, {
      method: "PUT",
      headers,
      body: isFormData ? request.body : await request.text(),
      // @ts-ignore
      duplex: isFormData ? "half" : undefined,
    });

    const data = await res.text();
    
    if (!res.ok) {
      console.error(`[API Proxy PUT] Backend error ${res.status} for ${target}:`, data.substring(0, 500));
    }

    return new NextResponse(data, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
    });
  } catch (error: any) {
    console.error(`[API Proxy PUT] Error fetching ${target}:`, error);
    const isTimeout = error.name === 'AbortError' || error.code === 'UND_ERR_CONNECT_TIMEOUT' || error.message.includes('timeout');
    return new NextResponse(JSON.stringify({
      error: isTimeout ? "Gateway Timeout" : "Internal Server Error",
      detail: error.message
    }), {
      status: isTimeout ? 504 : 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const target = buildTarget(path, request.nextUrl.search);

  try {
    const res = await fetch(target, {
      method: "DELETE",
      headers: forwardHeaders(request),
    });

    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
    });
  } catch (error: any) {
    console.error(`[API Proxy DELETE] Error fetching ${target}:`, error);
    const isTimeout = error.name === 'AbortError' || error.code === 'UND_ERR_CONNECT_TIMEOUT' || error.message.includes('timeout');
    return new NextResponse(JSON.stringify({
      error: isTimeout ? "Gateway Timeout" : "Internal Server Error",
      detail: error.message
    }), {
      status: isTimeout ? 504 : 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
