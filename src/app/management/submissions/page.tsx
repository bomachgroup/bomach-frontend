"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getQuoteRequests,
  getContactMessages,
  getBookingRequests,
  deleteQuoteRequest,
  deleteContactMessage,
  deleteBookingRequest,
  markQuoteAsRead,
  markContactAsRead,
  markBookingAsRead,
  confirmBookingRequest,
  QuoteRequest,
  ContactMessage,
  BookingRequest,
} from "@/lib/api";
import {
  FileText,
  MessageSquare,
  Calendar,
  Trash2,
  Eye,
  CheckCircle,
  Loader2,
  X,
} from "lucide-react";

type TabType = "quotes" | "contacts" | "bookings";

export default function SubmissionsPage() {
  const { accessToken } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("quotes");
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<
    QuoteRequest | ContactMessage | BookingRequest | null
  >(null);

  useEffect(() => {
    if (accessToken) {
      loadData();
    }
  }, [accessToken]);

  async function loadData() {
    if (!accessToken) return;
    setLoading(true);
    try {
      const [quotesData, contactsData, bookingsData] = await Promise.all([
        getQuoteRequests(accessToken),
        getContactMessages(accessToken),
        getBookingRequests(accessToken),
      ]);
      setQuotes(quotesData);
      setContacts(contactsData);
      setBookings(bookingsData);
    } catch (err) {
      console.error("Failed to load submissions:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(
    type: TabType,
    id: number,
  ) {
    if (!accessToken || !confirm("Are you sure you want to delete this item?"))
      return;
    setDeleting(id);
    try {
      if (type === "quotes") {
        await deleteQuoteRequest(id, accessToken);
        setQuotes((prev) => prev.filter((q) => q.id !== id));
      } else if (type === "contacts") {
        await deleteContactMessage(id, accessToken);
        setContacts((prev) => prev.filter((c) => c.id !== id));
      } else {
        await deleteBookingRequest(id, accessToken);
        setBookings((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("Failed to delete item");
    } finally {
      setDeleting(null);
    }
  }

  async function handleMarkAsRead(type: TabType, id: number) {
    if (!accessToken) return;
    try {
      if (type === "quotes") {
        await markQuoteAsRead(id, accessToken);
        setQuotes((prev) =>
          prev.map((q) => (q.id === id ? { ...q, is_read: true } : q)),
        );
      } else if (type === "contacts") {
        await markContactAsRead(id, accessToken);
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, is_read: true } : c)),
        );
      } else {
        await markBookingAsRead(id, accessToken);
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, is_read: true } : b)),
        );
      }
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  }

  async function handleConfirmBooking(id: number) {
    if (!accessToken) return;
    try {
      await confirmBookingRequest(id, accessToken);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, is_confirmed: true } : b)),
      );
    } catch (err) {
      console.error("Failed to confirm booking:", err);
    }
  }

  const unreadQuotes = quotes.filter((q) => !q.is_read).length;
  const unreadContacts = contacts.filter((c) => !c.is_read).length;
  const unreadBookings = bookings.filter((b) => !b.is_read).length;

  const tabs = [
    {
      id: "quotes" as TabType,
      label: "Quote Requests",
      icon: FileText,
      count: quotes.length,
      unread: unreadQuotes,
    },
    {
      id: "contacts" as TabType,
      label: "Contact Messages",
      icon: MessageSquare,
      count: contacts.length,
      unread: unreadContacts,
    },
    {
      id: "bookings" as TabType,
      label: "Booking Requests",
      icon: Calendar,
      count: bookings.length,
      unread: unreadBookings,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-secondary-900">
          Form Submissions
        </h1>
        <p className="text-secondary-500 mt-1 text-sm sm:text-base">
          Manage quote requests, contact messages, and booking requests
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <nav className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-secondary-500 hover:text-secondary-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  activeTab === tab.id
                    ? "bg-primary-100 text-primary-600"
                    : "bg-secondary-100 text-secondary-600"
                }`}
              >
                {tab.count}
              </span>
              {tab.unread > 0 && (
                <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {tab.unread}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-secondary-200 shadow-sm overflow-hidden">
        {activeTab === "quotes" && (
          <QuotesList
            quotes={quotes}
            onDelete={(id) => handleDelete("quotes", id)}
            onMarkRead={(id) => handleMarkAsRead("quotes", id)}
            onView={setSelectedItem}
            deleting={deleting}
          />
        )}
        {activeTab === "contacts" && (
          <ContactsList
            contacts={contacts}
            onDelete={(id) => handleDelete("contacts", id)}
            onMarkRead={(id) => handleMarkAsRead("contacts", id)}
            onView={setSelectedItem}
            deleting={deleting}
          />
        )}
        {activeTab === "bookings" && (
          <BookingsList
            bookings={bookings}
            onDelete={(id) => handleDelete("bookings", id)}
            onMarkRead={(id) => handleMarkAsRead("bookings", id)}
            onConfirm={handleConfirmBooking}
            onView={setSelectedItem}
            deleting={deleting}
          />
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-secondary-200">
              <h3 className="font-semibold text-secondary-900">
                {selectedItem.hasOwnProperty("service")
                  ? "Quote Request"
                  : selectedItem.hasOwnProperty("date")
                    ? "Booking Request"
                    : "Contact Message"}
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-secondary-500" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {"name" in selectedItem && (
                <div>
                  <p className="text-xs text-secondary-500 uppercase tracking-wide">
                    Name
                  </p>
                  <p className="text-secondary-900">{selectedItem.name}</p>
                </div>
              )}
              {"email" in selectedItem && (
                <div>
                  <p className="text-xs text-secondary-500 uppercase tracking-wide">
                    Email
                  </p>
                  <p className="text-secondary-900">{selectedItem.email}</p>
                </div>
              )}
              {"phone" in selectedItem && (
                <div>
                  <p className="text-xs text-secondary-500 uppercase tracking-wide">
                    Phone
                  </p>
                  <p className="text-secondary-900">{selectedItem.phone}</p>
                </div>
              )}
              {"service" in selectedItem && (
                <>
                  <div>
                    <p className="text-xs text-secondary-500 uppercase tracking-wide">
                      Service
                    </p>
                    <p className="text-secondary-900">{selectedItem.service}</p>
                  </div>
                  {selectedItem.sub_service && (
                    <div>
                      <p className="text-xs text-secondary-500 uppercase tracking-wide">
                        Sub-service
                      </p>
                      <p className="text-secondary-900">
                        {selectedItem.sub_service}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-secondary-500 uppercase tracking-wide">
                      Location
                    </p>
                    <p className="text-secondary-900">
                      {selectedItem.location}
                    </p>
                  </div>
                </>
              )}
              {"property_name" in selectedItem && selectedItem.property_name && (
                <div>
                  <p className="text-xs text-secondary-500 uppercase tracking-wide">
                    Property
                  </p>
                  <p className="text-secondary-900">
                    {selectedItem.property_name}
                  </p>
                </div>
              )}
              {"date" in selectedItem && (
                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-secondary-500 uppercase tracking-wide">
                      Date
                    </p>
                    <p className="text-secondary-900">{selectedItem.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-500 uppercase tracking-wide">
                      Time
                    </p>
                    <p className="text-secondary-900">{selectedItem.time}</p>
                  </div>
                </div>
              )}
              {"message" in selectedItem && (
                <div>
                  <p className="text-xs text-secondary-500 uppercase tracking-wide">
                    Message
                  </p>
                  <p className="text-secondary-900 whitespace-pre-wrap">
                    {selectedItem.message}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-secondary-500 uppercase tracking-wide">
                  Submitted
                </p>
                <p className="text-secondary-600 text-sm">
                  {new Date(selectedItem.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QuotesList({
  quotes,
  onDelete,
  onMarkRead,
  onView,
  deleting,
}: {
  quotes: QuoteRequest[];
  onDelete: (id: number) => void;
  onMarkRead: (id: number) => void;
  onView: (item: QuoteRequest) => void;
  deleting: number | null;
}) {
  if (quotes.length === 0) {
    return (
      <div className="p-12 text-center">
        <FileText className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
        <p className="text-secondary-500">No quote requests yet</p>
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead className="bg-secondary-50 border-b border-secondary-200">
        <tr>
          <th className="text-left px-4 py-3 text-xs font-semibold text-secondary-600 uppercase tracking-wide">
            Name
          </th>
          <th className="text-left px-4 py-3 text-xs font-semibold text-secondary-600 uppercase tracking-wide hidden md:table-cell">
            Service
          </th>
          <th className="text-left px-4 py-3 text-xs font-semibold text-secondary-600 uppercase tracking-wide hidden sm:table-cell">
            Email
          </th>
          <th className="text-left px-4 py-3 text-xs font-semibold text-secondary-600 uppercase tracking-wide hidden lg:table-cell">
            Date
          </th>
          <th className="text-right px-4 py-3 text-xs font-semibold text-secondary-600 uppercase tracking-wide">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-secondary-100">
        {quotes.map((quote) => (
          <tr
            key={quote.id}
            className={quote.is_read ? "" : "bg-blue-50/30"}
          >
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                {!quote.is_read && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
                <span className="font-medium text-secondary-900">
                  {quote.name}
                </span>
              </div>
            </td>
            <td className="px-4 py-3 text-secondary-600 hidden md:table-cell">
              {quote.service}
            </td>
            <td className="px-4 py-3 text-secondary-600 hidden sm:table-cell">
              {quote.email}
            </td>
            <td className="px-4 py-3 text-secondary-500 text-sm hidden lg:table-cell">
              {new Date(quote.created_at).toLocaleDateString()}
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={() => onView(quote)}
                  className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                  title="View details"
                >
                  <Eye className="w-4 h-4 text-secondary-600" />
                </button>
                {!quote.is_read && (
                  <button
                    onClick={() => onMarkRead(quote.id)}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Mark as read"
                  >
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </button>
                )}
                <button
                  onClick={() => onDelete(quote.id)}
                  disabled={deleting === quote.id}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ContactsList({
  contacts,
  onDelete,
  onMarkRead,
  onView,
  deleting,
}: {
  contacts: ContactMessage[];
  onDelete: (id: number) => void;
  onMarkRead: (id: number) => void;
  onView: (item: ContactMessage) => void;
  deleting: number | null;
}) {
  if (contacts.length === 0) {
    return (
      <div className="p-12 text-center">
        <MessageSquare className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
        <p className="text-secondary-500">No contact messages yet</p>
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead className="bg-secondary-50 border-b border-secondary-200">
        <tr>
          <th className="text-left px-4 py-3 text-xs font-semibold text-secondary-600 uppercase tracking-wide">
            Name
          </th>
          <th className="text-left px-4 py-3 text-xs font-semibold text-secondary-600 uppercase tracking-wide hidden sm:table-cell">
            Email
          </th>
          <th className="text-left px-4 py-3 text-xs font-semibold text-secondary-600 uppercase tracking-wide hidden lg:table-cell">
            Message
          </th>
          <th className="text-right px-4 py-3 text-xs font-semibold text-secondary-600 uppercase tracking-wide">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-secondary-100">
        {contacts.map((contact) => (
          <tr
            key={contact.id}
            className={contact.is_read ? "" : "bg-blue-50/30"}
          >
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                {!contact.is_read && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
                <span className="font-medium text-secondary-900">
                  {contact.name}
                </span>
              </div>
            </td>
            <td className="px-4 py-3 text-secondary-600 hidden sm:table-cell">
              {contact.email}
            </td>
            <td className="px-4 py-3 text-secondary-600 hidden lg:table-cell max-w-xs truncate">
              {contact.message}
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={() => onView(contact)}
                  className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                  title="View details"
                >
                  <Eye className="w-4 h-4 text-secondary-600" />
                </button>
                {!contact.is_read && (
                  <button
                    onClick={() => onMarkRead(contact.id)}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Mark as read"
                  >
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </button>
                )}
                <button
                  onClick={() => onDelete(contact.id)}
                  disabled={deleting === contact.id}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function BookingsList({
  bookings,
  onDelete,
  onMarkRead,
  onConfirm,
  onView,
  deleting,
}: {
  bookings: BookingRequest[];
  onDelete: (id: number) => void;
  onMarkRead: (id: number) => void;
  onConfirm: (id: number) => void;
  onView: (item: BookingRequest) => void;
  deleting: number | null;
}) {
  if (bookings.length === 0) {
    return (
      <div className="p-12 text-center">
        <Calendar className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
        <p className="text-secondary-500">No booking requests yet</p>
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead className="bg-secondary-50 border-b border-secondary-200">
        <tr>
          <th className="text-left px-4 py-3 text-xs font-semibold text-secondary-600 uppercase tracking-wide">
            Name
          </th>
          <th className="text-left px-4 py-3 text-xs font-semibold text-secondary-600 uppercase tracking-wide hidden md:table-cell">
            Date & Time
          </th>
          <th className="text-left px-4 py-3 text-xs font-semibold text-secondary-600 uppercase tracking-wide hidden sm:table-cell">
            Phone
          </th>
          <th className="text-right px-4 py-3 text-xs font-semibold text-secondary-600 uppercase tracking-wide">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-secondary-100">
        {bookings.map((booking) => (
          <tr key={booking.id} className={booking.is_read ? "" : "bg-blue-50/30"}>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                {!booking.is_read && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
                <div>
                  <span className="font-medium text-secondary-900">
                    {booking.name}
                  </span>
                  {booking.property_name && (
                    <p className="text-xs text-secondary-500">
                      {booking.property_name}
                    </p>
                  )}
                </div>
              </div>
            </td>
            <td className="px-4 py-3 hidden md:table-cell">
              <div className="text-secondary-900">
                {booking.date} at {booking.time}
              </div>
              {booking.is_confirmed && (
                <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" /> Confirmed
                </span>
              )}
            </td>
            <td className="px-4 py-3 text-secondary-600 hidden sm:table-cell">
              {booking.phone}
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={() => onView(booking)}
                  className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                  title="View details"
                >
                  <Eye className="w-4 h-4 text-secondary-600" />
                </button>
                {!booking.is_confirmed && (
                  <button
                    onClick={() => onConfirm(booking.id)}
                    className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                    title="Confirm booking"
                  >
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </button>
                )}
                <button
                  onClick={() => onDelete(booking.id)}
                  disabled={deleting === booking.id}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
