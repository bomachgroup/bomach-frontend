"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getNewsletterEmails } from "@/lib/api";
import { Mail, Users, Download, Loader2 } from "lucide-react";

export default function AdminNewsletterPage() {
  const { accessToken } = useAuth();
  const [emails, setEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (accessToken) {
      loadEmails();
    }
  }, [accessToken]);

  async function loadEmails() {
    try {
      const data = await getNewsletterEmails(accessToken!);
      setEmails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load emails");
    } finally {
      setLoading(false);
    }
  }

  function downloadEmails() {
    const csvContent = "Email\n" + emails.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
        <div>
          <h1 className='font-display text-3xl font-bold text-secondary-900'>
            Newsletter Subscribers
          </h1>
          <p className='text-secondary-500 mt-1'>
            Manage newsletter subscriptions and export subscriber emails.
          </p>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={downloadEmails}
            disabled={emails.length === 0}
            className='inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-50'>
            <Download className='w-4 h-4' /> Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className='rounded-xl bg-red-50 border border-red-100 text-red-700 px-4 py-3'>
          {error}
        </div>
      )}

      {loading ? (
        <div className='flex items-center justify-center h-56'>
          <Loader2 className='w-8 h-8 text-primary-600 animate-spin' />
        </div>
      ) : emails.length === 0 ? (
        <div className='rounded-xl border border-dashed border-secondary-300 p-8 text-center'>
          <Mail className='mx-auto w-10 h-10 text-secondary-300 mb-3' />
          <p className='text-secondary-500'>No newsletter subscribers yet.</p>
        </div>
      ) : (
        <div className='space-y-4'>
          <div className='flex items-center gap-2 text-secondary-600'>
            <Users className='w-5 h-5' />
            <span className='font-medium'>{emails.length} subscribers</span>
          </div>

          <div className='bg-white rounded-2xl border border-secondary-100 shadow-sm overflow-hidden'>
            <div className='p-6 border-b border-secondary-100'>
              <h2 className='font-display text-lg font-bold text-secondary-900'>
                Subscriber Emails
              </h2>
            </div>
            <div className='max-h-96 overflow-y-auto'>
              {emails.map((email, index) => (
                <div
                  key={email}
                  className={`px-6 py-3 flex items-center gap-3 ${
                    index !== emails.length - 1
                      ? "border-b border-secondary-50"
                      : ""
                  }`}>
                  <Mail className='w-4 h-4 text-secondary-400' />
                  <span className='text-secondary-900'>{email}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
