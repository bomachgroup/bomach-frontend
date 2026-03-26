"use client";

import { useState } from "react";
import { submitContact } from "@/lib/api";

export default function PropertyContactForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await submitContact(data as Record<string, unknown>);
      setStatus("success");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to send message."
      );
    }
    setTimeout(() => setStatus("idle"), 8000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="tp-contact-form">
        <div className="row custom-mar-20">
          <div className="col-md-6 custom-pad-20">
            <div className="tp-contact-form-field mb-20">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Your Name"
                required
              />
            </div>
          </div>
          <div className="col-md-6 custom-pad-20">
            <div className="tp-contact-form-field mb-20">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Your Email"
                required
              />
            </div>
          </div>
          <div className="col-md-6 custom-pad-20">
            <div className="tp-contact-form-field mb-20">
              <input
                type="text"
                name="phone"
                className="form-control"
                placeholder="Your Phone"
                required
              />
            </div>
          </div>
          <div className="col-md-6 custom-pad-20">
            <div className="tp-contact-form-field mb-20">
              <input
                type="text"
                name="location"
                className="form-control"
                placeholder="Your Location"
              />
            </div>
          </div>
          <div className="col-md-12 custom-pad-20">
            <div className="tp-contact-form-field mb-20">
              <textarea
                name="message"
                className="form-control"
                placeholder="Write your message"
                rows={5}
              ></textarea>
            </div>
          </div>
          <div className="col-md-12 custom-pad-20">
            <div className="tp-contact-form-field">
              <button
                type="submit"
                className="theme-btn home2-btn btn-before"
                disabled={status === "loading"}
              >
                <i className="fal fa-angle-double-right"></i>{" "}
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>
            </div>
          </div>
        </div>
        {status === "success" && (
          <div className="alert alert-success mt-3">
            Message sent successfully!
          </div>
        )}
        {status === "error" && (
          <div className="alert alert-danger mt-3">{errorMsg}</div>
        )}
      </div>
    </form>
  );
}
