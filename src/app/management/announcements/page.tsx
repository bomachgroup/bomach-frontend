"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAnnouncements,
  deleteAnnouncement,
  type Announcement,
} from "@/lib/api";
import { Loader2, Plus, Trash2, Megaphone, Eye } from "lucide-react";

const priorityColors: Record<string, string> = {
  low: "bg-secondary-100 text-secondary-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

const typeColors: Record<string, string> = {
  general: "bg-secondary-100 text-secondary-700",
  policy: "bg-purple-100 text-purple-700",
  event: "bg-green-100 text-green-700",
  maintenance: "bg-yellow-100 text-yellow-700",
  hr: "bg-pink-100 text-pink-700",
};

export default function AnnouncementsPage() {
  const { accessToken } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewingId, setViewingId] = useState<number | null>(null);

  const loadAnnouncements = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const data = await getAnnouncements(accessToken, { page, size: 20 });
      setAnnouncements(data.items);
      setTotalPages(data.pages);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load announcements",
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken, page]);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  const handleDelete = async (id: number) => {
    if (!accessToken) return;
    if (
      !confirm(
        "Are you sure you want to delete this announcement? This action cannot be undone.",
      )
    )
      return;

    setDeletingId(id);
    try {
      await deleteAnnouncement(id, accessToken);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert("Failed to delete announcement. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const viewedAnnouncement = announcements.find((a) => a.id === viewingId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-secondary-900">
            Announcements
          </h1>
          <p className="text-secondary-500 mt-1">
            Manage company announcements for employees.
          </p>
        </div>
        <Link
          href="/management/announcements/create"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-primary-600 text-white hover:bg-primary-700">
          <Plus className="w-4 h-4" /> New Announcement
        </Link>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-56">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="rounded-xl border border-dashed border-secondary-300 p-8 text-center">
          <Megaphone className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
          <p className="text-secondary-500">
            No announcements yet. Create one to get started.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white border border-secondary-100 rounded-2xl p-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h2 className="text-lg font-semibold text-secondary-900">
                        {announcement.title}
                      </h2>
                      {!announcement.is_active && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary-200 text-secondary-600">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[announcement.type] || typeColors.general}`}>
                        {announcement.type}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[announcement.priority] || priorityColors.low}`}>
                        {announcement.priority}
                      </span>
                      <span className="text-xs text-secondary-400">
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </span>
                      {announcement.expires_at && (
                        <span className="text-xs text-secondary-400">
                          Expires:{" "}
                          {new Date(
                            announcement.expires_at,
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-secondary-600 text-sm line-clamp-2">
                      {announcement.content.replace(/<[^>]*>/g, "")}
                    </p>
                    {(announcement.branches?.length > 0 ||
                      announcement.departments?.length > 0) && (
                      <div className="flex items-center gap-2 flex-wrap mt-2">
                        {announcement.branches?.map((b) => (
                          <span
                            key={b.id}
                            className="text-xs px-2 py-0.5 rounded-full bg-secondary-50 text-secondary-500">
                            {b.name}
                          </span>
                        ))}
                        {announcement.departments?.map((d) => (
                          <span
                            key={d.id}
                            className="text-xs px-2 py-0.5 rounded-full bg-secondary-50 text-secondary-500">
                            {d.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() =>
                        setViewingId(
                          viewingId === announcement.id
                            ? null
                            : announcement.id,
                        )
                      }
                      className="text-primary-600 text-sm hover:text-primary-700"
                      title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/management/announcements/${announcement.id}/edit`}
                      className="text-secondary-700 text-sm hover:text-primary-600">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      disabled={deletingId === announcement.id}
                      className="text-red-600 text-sm hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                      {deletingId === announcement.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                {viewingId === announcement.id && (
                  <div className="mt-4 pt-4 border-t border-secondary-100">
                    <div
                      className="prose prose-sm max-w-none text-secondary-700"
                      dangerouslySetInnerHTML={{
                        __html: announcement.content,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm rounded-lg bg-secondary-100 text-secondary-700 hover:bg-secondary-200 disabled:opacity-50">
                Previous
              </button>
              <span className="text-sm text-secondary-500">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg bg-secondary-100 text-secondary-700 hover:bg-secondary-200 disabled:opacity-50">
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
