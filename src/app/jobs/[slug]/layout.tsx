import type { Metadata } from "next";
import { getJobBySlug } from "@/lib/api";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bomachgroup.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const job = await getJobBySlug(slug);
    const description =
      `Apply for ${job.title} at Bomach Group. Join our team of professionals shaping construction, engineering, and real estate in Nigeria.`;
    const url = `${SITE_URL}/jobs/${slug}`;

    return {
      title: job.title,
      description,
      alternates: { canonical: `/jobs/${slug}` },
      openGraph: {
        type: "article",
        title: `${job.title} — Bomach Group Careers`,
        description,
        url,
        siteName: "Bomach Group",
      },
      twitter: {
        card: "summary_large_image",
        title: `${job.title} — Bomach Group Careers`,
        description,
      },
    };
  } catch {
    return { title: "Career Opportunity" };
  }
}

export default function JobLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
