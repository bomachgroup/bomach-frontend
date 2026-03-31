"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  createAnnouncement,
  getAnnouncementChoices,
  type AnnouncementChoices,
} from "@/lib/api";
import { Loader2, ArrowLeft } from "lucide-react";

export default function CreateAnnouncementPage() {
  const { accessToken } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("general");
  const [priority, setPriority] = useState("medium");
  const [publishAt, setPublishAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [choices, setChoices] = useState<AnnouncementChoices | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    getAnnouncementChoices(accessToken)
      .then(setChoices)
      .catch(() => {
        // Use sensible defaults if choices endpoint fails
        setChoices({
          types: [
            { value: "general", label: "General" },
            { value: "policy", label: "Policy" },
            { value: "event", label: "Event" },
            { value: "maintenance", label: "Maintenance" },
            { value: "hr", label: "HR" },
          ],
          priorities: [
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
            { value: "urgent", label: "Urgent" },
          ],
        });
      });
  }, [accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await createAnnouncement(
        {
          title: title.trim(),
          content: content.trim(),
          type,
          priority,
          publish_at: publishAt || null,
          expires_at: expiresAt || null,
        },
        accessToken,
      );
      router.push("/management/announcements");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create announcement",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/management/announcements"
          className="p-2 rounded-xl hover:bg-secondary-100 text-secondary-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold text-secondary-900">
            New Announcement
          </h1>
          <p className="text-secondary-500 mt-1">
            Create an announcement for employees.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-secondary-100 rounded-2xl p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            placeholder="Announcement title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full px-4 py-2.5 rounded-xl border border-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-y"
            placeholder="Write the announcement content..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white">
              {(
                choices?.types || [
                  { value: "general", label: "General" },
                  { value: "policy", label: "Policy" },
                  { value: "event", label: "Event" },
                  { value: "maintenance", label: "Maintenance" },
                  { value: "hr", label: "HR" },
                ]
              ).map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white">
              {(
                choices?.priorities || [
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                  { value: "urgent", label: "Urgent" },
                ]
              ).map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Publish At{" "}
              <span className="text-secondary-400 font-normal">
                (optional)
              </span>
            </label>
            <input
              type="datetime-local"
              value={publishAt}
              onChange={(e) => setPublishAt(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Expires At{" "}
              <span className="text-secondary-400 font-normal">
                (optional)
              </span>
            </label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Publishing..." : "Publish Announcement"}
          </button>
          <Link
            href="/management/announcements"
            className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-secondary-100 text-secondary-700 hover:bg-secondary-200">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
