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
  
  // Forward other useful headers
  const userAgent = request.headers.get("User-Agent");
  if (userAgent) headers["User-Agent"] = userAgent;

  const accept = request.headers.get("Accept");
  if (accept) headers["Accept"] = accept;

  return headers;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const target = buildTarget(path, request.nextUrl.search);

  try {
    const res = await fetch(target, {
      headers: forwardHeaders(request),
    });

    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
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
    // Only use streaming for FormData; buffer for other types (JSON/text)
    // to avoid issue with backend servers that don't support chunked transfer well.
    const fetchOptions: RequestInit = {
      method: "POST",
      headers,
    };

    if (isFormData) {
      // @ts-ignore - duplex is required for streaming in Node fetch
      fetchOptions.duplex = "half";
      fetchOptions.body = request.body;
    } else {
      fetchOptions.body = await request.text();
    }

    const res = await fetch(target, fetchOptions);

    const data = await res.text();
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
    // For PUT, usually it's JSON; if it's large, we might consider streaming,
    // but buffering is safer for backend compatibility.
    const contentType = request.headers.get("Content-Type") || "";
    const isFormData = contentType.includes("multipart/form-data");

    const fetchOptions: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...forwardHeaders(request),
      },
    };

    if (isFormData) {
      // @ts-ignore
      fetchOptions.duplex = "half";
      fetchOptions.body = request.body;
      // Preserve boundary in PUT if isFormData
      if (fetchOptions.headers) {
        (fetchOptions.headers as any)["Content-Type"] = contentType;
      }
    } else {
      fetchOptions.body = await request.text();
    }

    const res = await fetch(target, fetchOptions);

    const data = await res.text();
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
