"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ClipboardList,
  Gift,
  LoaderCircle,
  Mail,
  MapPin,
  MessageCircle,
  PencilLine,
  Phone,
  Ruler,
  ShieldCheck,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import type { PublicLeadForm, PublicLeadQuestion } from "@/lib/campaignPage";

type Answers = Record<string, string | boolean | string[]>;

const CONTACT_QUESTION = "preferred_contact_method";
const CONSENT_QUESTION = "contact_consent";

function questionOptions(question: PublicLeadQuestion) {
  return (question.options || []).map((option) => typeof option === "string"
    ? { value: option, label: option }
    : { value: option.value, label: option.label || option.value });
}

function displayAnswer(question: PublicLeadQuestion, value: Answers[string] | undefined) {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  const options = questionOptions(question);
  const labelFor = (answer: string) => options.find((option) => option.value === answer)?.label || answer;
  if (Array.isArray(value)) return value.length ? value.map(labelFor).join(", ") : "Not provided";
  if (typeof value !== "string" || !value.trim()) return "Not provided";
  return labelFor(value);
}

function valueIsMissing(value: unknown) {
  return value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
}

function errorMessage(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(errorMessage).filter(Boolean).join(" ");
  if (typeof value === "object" && value !== null) {
    const object = value as Record<string, unknown>;
    if (object.detail) return errorMessage(object.detail);
    if (object.message) return errorMessage(object.message);
    return Object.entries(object).map(([key, message]) => `${key.replace(/_/g, " ")}: ${errorMessage(message)}`).join(" ");
  }
  return "We could not submit your enquiry. Please try again.";
}

function apiErrors(value: unknown, fieldKeys: Set<string>, questionLabels: Map<string, string>) {
  const errors: Record<string, string> = {};
  let message = "";
  const record = typeof value === "object" && value !== null ? value as Record<string, unknown> : {};
  const detailText = typeof record.detail === "string" ? record.detail : typeof record.message === "string" ? record.message : "";
  if (detailText) {
    for (const part of detailText.split(/;\s*/)) {
      const separator = part.indexOf(":");
      if (separator < 1) {
        message = message ? `${message} ${part}` : part;
        continue;
      }
      const key = part.slice(0, separator).trim();
      const text = part.slice(separator + 1).trim();
      if (fieldKeys.has(key)) {
        errors[key] = text;
      } else if (key === "answers") {
        const matchingQuestion = [...questionLabels.entries()].find(([, label]) => text.startsWith(`${label} `));
        if (matchingQuestion) errors[matchingQuestion[0]] = text;
        else message = message ? `${message} ${text}` : text;
      } else {
        message = message ? `${message} ${text}` : text;
      }
    }
    return { errors, message };
  }

  const nestedErrors = record.errors ?? record.field_errors;
  const source = nestedErrors && typeof nestedErrors === "object"
    ? nestedErrors as Record<string, unknown>
    : record.detail && typeof record.detail === "object"
      ? record.detail as Record<string, unknown>
      : record;

  for (const [rawKey, rawMessage] of Object.entries(source)) {
    const key = rawKey.startsWith("answers.") ? rawKey.slice("answers.".length) : rawKey;
    const fieldKey = fieldKeys.has(key) ? key : null;
    const text = errorMessage(rawMessage);
    if (fieldKey && text) errors[fieldKey] = text;
    else if (text && !["detail", "message"].includes(rawKey)) message = message ? `${message} ${text}` : text;
  }

  if (!Object.keys(errors).length && !message) message = errorMessage(value);
  return { errors, message };
}

const STEP_LABELS = ["Contact", "Plans", "Review"];

type Props = {
  form: PublicLeadForm | null
  location: string
  promotionPrice: string
  standardPrice: string
  promotionLimit: number
  plotSize: string
  bonusText: string
  contactPhone: string
  contactWhatsapp: string
};

export default function FortressCityLeadForm({
  form,
  location,
  promotionPrice,
  standardPrice,
  promotionLimit,
  plotSize,
  bonusText,
  contactPhone,
  contactWhatsapp,
}: Props) {
  const questions = useMemo(() => [...(form?.questions || [])].filter((question) => question.is_active).sort((a, b) => a.sort_order - b.sort_order), [form]);
  const contactQuestion = questions.find((question) => question.key === CONTACT_QUESTION);
  const consentQuestion = questions.find((question) => question.key === CONSENT_QUESTION);
  const interestQuestions = questions.filter((question) => question.key !== CONTACT_QUESTION && question.key !== CONSENT_QUESTION);
  const [step, setStep] = useState(0);
  const [fields, setFields] = useState({ full_name: "", phone: "", email: "", location: "" });
  const [answers, setAnswers] = useState<Answers>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const closeDialogRef = useRef<() => void>(() => {});
  const submittingRef = useRef(false);
  submittingRef.current = submitting;

  useEffect(() => {
    if (!form) return;

    const url = new URL(window.location.href);
    if (url.searchParams.get("enquire") === "1" || url.searchParams.get("lead") === "1" || url.hash === "#enquire") {
      setIsOpen(true);
    }

    function handleEnquiryLink(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>('a[href="#enquire"]');
      if (!link) return;
      event.preventDefault();
      returnFocusRef.current = link;
      setFormError("");
      setFieldErrors({});
      setIsOpen(true);
    }

    document.addEventListener("click", handleEnquiryLink, true);
    return () => document.removeEventListener("click", handleEnquiryLink, true);
  }, [form]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const initialFocus = dialogRef.current?.querySelector<HTMLElement>("[data-enquiry-initial-focus]");
    initialFocus?.focus({ preventScroll: true });

    function handleDialogKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !submittingRef.current) {
        event.preventDefault();
        closeDialogRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const items = [...dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]):not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )].filter((item) => item.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleDialogKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleDialogKeyDown);
    };
  }, [isOpen]);

  function setAnswer(key: string, value: string | boolean | string[]) {
    setAnswers((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
    setFormError("");
  }

  function setField(key: keyof typeof fields, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
    setFormError("");
  }

  function focusFirstInvalid(errors: Record<string, string>) {
    const firstKey = Object.keys(errors)[0];
    if (!firstKey) return;
    window.requestAnimationFrame(() => document.getElementById(`enquiry-${firstKey}`)?.focus());
  }

  function closeDialog() {
    if (submitting) return;
    setIsOpen(false);
    setFormError("");
    setFieldErrors({});
    const url = new URL(window.location.href);
    url.searchParams.delete("enquire");
    url.searchParams.delete("lead");
    if (url.hash === "#enquire") url.hash = "";
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    window.requestAnimationFrame(() => {
      const target = returnFocusRef.current || document.querySelector<HTMLElement>('a[href="#enquire"]');
      target?.focus();
    });
  }

  closeDialogRef.current = closeDialog;

  function validateStep() {
    const errors: Record<string, string> = {};
    if (step === 0) {
      if (!fields.full_name.trim()) errors.full_name = "Enter your full name.";
      if (!fields.phone.trim()) errors.phone = "Enter a phone or WhatsApp number.";
      if (fields.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
        errors.email = "Enter a valid email address.";
      }
      if (!fields.location.trim()) errors.location = "Enter your current city or location.";
      if (contactQuestion?.required && valueIsMissing(answers[contactQuestion.key])) {
        errors[contactQuestion.key] = "Choose how you would like us to contact you.";
      }
    }
    if (step === 1) {
      for (const question of interestQuestions) {
        if (question.required && valueIsMissing(answers[question.key])) {
          errors[question.key] = "Please answer this question.";
        }
      }
    }
    if (step === 2 && consentQuestion?.required && answers[consentQuestion.key] !== true) {
      errors[consentQuestion.key] = "Please confirm that we may contact you about this enquiry.";
    }
    setFieldErrors(errors);
    setFormError("");
    if (Object.keys(errors).length) {
      focusFirstInvalid(errors);
      return false;
    }
    return true;
  }

  function continueStep() {
    if (validateStep()) setStep((current) => Math.min(2, current + 1));
  }

  function previousStep() {
    setFormError("");
    setFieldErrors({});
    setStep((current) => Math.max(0, current - 1));
  }

  function editStep(target: 0 | 1) {
    setFormError("");
    setFieldErrors({});
    setStep(target);
    window.requestAnimationFrame(() => dialogRef.current?.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateStep() || !form?.public_key) return;
    setSubmitting(true);
    setFormError("");
    try {
      const response = await fetch(`/api/v1/public/lead-forms/${encodeURIComponent(form.public_key)}/submissions`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({
          ...fields,
          full_name: fields.full_name.trim(),
          phone: fields.phone.trim(),
          email: fields.email.trim(),
          location: fields.location.trim(),
          answers,
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        const knownFields = new Set(["full_name", "phone", "email", "location", ...questions.map((question) => question.key)]);
        const questionLabels = new Map(questions.map((question) => [question.key, question.label]));
        const result = apiErrors(body, knownFields, questionLabels);
        setFieldErrors(result.errors);
        if (Object.keys(result.errors).length) {
          const firstField = Object.keys(result.errors)[0];
          const targetStep = firstField === "contact_consent" ? 2 : interestQuestions.some((question) => question.key === firstField) ? 1 : 0;
          setStep(targetStep);
          window.requestAnimationFrame(() => document.getElementById(`enquiry-${firstField}`)?.focus());
        }
        setFormError(result.message);
        return;
      }
      setSubmitted(true);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "We could not submit your enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!form || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex h-[100dvh] w-full flex-col overflow-hidden bg-[#f4f5f7] text-slate-950" role="presentation">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="fortress-enquiry-title" aria-describedby="fortress-enquiry-description" className="flex min-h-0 flex-1 flex-col">
        <header className="z-20 flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-7 sm:py-4 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#101a35] font-display text-lg font-bold text-white sm:h-11 sm:w-11">B</span>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-bold uppercase tracking-[0.18em] text-red-700 sm:text-[11px]">Bomach Group</p>
              <p className="truncate text-sm font-semibold text-slate-900 sm:text-base">Fortress City enquiry</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden text-right sm:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Your progress</p>
              <p className="mt-0.5 text-xs font-semibold text-slate-700">{submitted ? "Complete" : `Step ${step + 1} of 3`}</p>
            </div>
            <button type="button" onClick={closeDialog} disabled={submitting} aria-label="Close enquiry form" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-400 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-700/15 disabled:opacity-50 sm:h-11 sm:w-11"><X size={20} /></button>
          </div>
        </header>
        <div aria-hidden="true" className="h-1 shrink-0 bg-gradient-to-r from-red-700 via-amber-400 to-blue-900" />

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto grid min-h-full w-full max-w-7xl items-stretch gap-5 p-3 sm:gap-7 sm:p-6 lg:grid-cols-[minmax(18rem,0.78fr)_minmax(0,1.22fr)] lg:gap-10 lg:p-10">
            <aside className="hidden min-h-[34rem] flex-col justify-between rounded-[1.75rem] bg-[#101a35] p-8 text-white shadow-xl shadow-slate-950/10 lg:flex xl:p-10">
              <div>
                <p className="inline-flex items-center rounded-full border border-amber-200/25 bg-amber-200/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-200">Fortress City Estate</p>
                <h2 className="mt-6 max-w-sm font-display text-3xl font-bold leading-tight xl:text-4xl">A stronger start for your build.</h2>
                <p className="mt-3 flex items-center gap-2 text-sm text-slate-300"><MapPin size={16} className="text-amber-300" />{location}</p>
              </div>

              <div className="my-8 rounded-2xl border border-white/10 bg-white/[0.06] p-5 xl:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-200">Promotional price</p>
                <p className="mt-1 font-display text-4xl font-bold tracking-tight xl:text-5xl">{promotionPrice}</p>
                <p className="mt-1 text-sm text-slate-300">Standard price <span className="line-through">{standardPrice}</span></p>
                <div className="my-5 h-px bg-white/10" />
                <p className="flex items-center gap-2 text-sm font-semibold text-white"><Ruler size={16} className="text-sky-300" />{plotSize} sqm plot</p>
                <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-white"><Gift size={16} className="mt-0.5 shrink-0 text-emerald-300" />{bonusText}</p>
                <p className="mt-4 rounded-xl bg-red-700/25 px-3 py-2 text-xs font-semibold text-red-100">Offer applies to the first {promotionLimit} plots.</p>
              </div>

              <p className="flex items-center gap-2 text-xs leading-relaxed text-slate-300"><ShieldCheck size={16} className="shrink-0 text-emerald-300" />Your information is used only to respond to your property enquiry.</p>
            </aside>

            <section className="flex min-w-0 items-center justify-center py-1 sm:py-2">
              {submitted ? (
                <div className="w-full max-w-2xl rounded-[1.75rem] border border-emerald-200 bg-white p-6 shadow-xl shadow-slate-950/5 sm:p-10" role="status" aria-live="polite">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800"><Check size={28} strokeWidth={2.5} /></div>
                  <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">Enquiry received</p>
                  <h1 id="fortress-enquiry-title" className="mt-2 font-display text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">Thank you, {fields.full_name}.</h1>
                  <p id="fortress-enquiry-description" className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">Our team will follow up using your preferred contact method and help you with the next steps.</p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <a href={`tel:${contactPhone.replace(/[^+\d]/g, "")}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#101a35] px-5 text-sm font-bold text-white transition hover:bg-slate-800"><Phone size={16} />Call our team</a>
                    <a href={contactWhatsapp} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 text-sm font-bold text-emerald-900 transition hover:bg-emerald-100"><MessageCircle size={17} />Continue on WhatsApp</a>
                  </div>
                  <button type="button" onClick={closeDialog} className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900">Return to promotion <ArrowRight size={16} /></button>
                </div>
              ) : (
                <form onSubmit={submit} className="flex w-full max-w-3xl flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-xl shadow-slate-950/5 sm:rounded-[1.75rem]">
                  <div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8 sm:py-7">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-red-700 sm:text-xs">Private property enquiry</p>
                        <h1 id="fortress-enquiry-title" className="mt-2 max-w-xl font-display text-2xl font-bold leading-tight text-slate-950 sm:text-3xl lg:text-4xl">Tell us about your plans.</h1>
                        <p id="fortress-enquiry-description" className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">A few details help our team give you a relevant response about this offer.</p>
                      </div>
                      <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] font-bold text-slate-600 sm:px-3 sm:text-xs">0{step + 1} / 03</span>
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-3" role="group" aria-label={`Step ${step + 1} of 3: ${STEP_LABELS[step]}`}>
                      {STEP_LABELS.map((label, index) => (
                        <div key={label} aria-current={index === step ? "step" : undefined}>
                          <span aria-hidden="true" className={`block h-1.5 rounded-full transition-colors ${index <= step ? "bg-red-700" : "bg-slate-200"}`} />
                          <span className={`mt-1.5 block text-[10px] font-semibold sm:text-xs ${index === step ? "text-red-800" : index < step ? "text-slate-700" : "text-slate-400"}`}>{label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-slate-500 lg:hidden">
                      <span>{location}</span><span aria-hidden="true">·</span><span>{promotionPrice}</span><span aria-hidden="true">·</span><span>{plotSize} sqm</span>
                    </div>
                  </div>

                  <div className="min-h-[17rem] flex-1 space-y-4 px-5 pb-32 pt-5 sm:space-y-5 sm:px-8 sm:pt-7 lg:pb-7">
                    {step === 0 && (
                      <>
                        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-5">
                          <TextInput id="enquiry-full_name" label="Full name" autoComplete="name" required value={fields.full_name} error={fieldErrors.full_name} onChange={(value) => setField("full_name", value)} initialFocus />
                          <TextInput id="enquiry-phone" label="Phone / WhatsApp number" type="tel" autoComplete="tel" required value={fields.phone} error={fieldErrors.phone} onChange={(value) => setField("phone", value)} />
                          <TextInput id="enquiry-email" label="Email address" type="email" autoComplete="email" value={fields.email} error={fieldErrors.email} onChange={(value) => setField("email", value)} />
                          <TextInput id="enquiry-location" label="Current city / location" autoComplete="address-level2" required value={fields.location} error={fieldErrors.location} onChange={(value) => setField("location", value)} />
                        </div>
                        {contactQuestion && <QuestionField id={`enquiry-${contactQuestion.key}`} question={contactQuestion} value={answers[contactQuestion.key]} error={fieldErrors[contactQuestion.key]} portalContainer={dialogRef.current} onChange={(value) => setAnswer(contactQuestion.key, value)} />}
                      </>
                    )}

                    {step === 1 && <div className="space-y-5">
                      <div><h2 className="font-display text-lg font-bold text-slate-950 sm:text-xl">Your property plans</h2><p className="mt-1 text-sm leading-relaxed text-slate-600">Choose the answers that best describe where you are today.</p></div>
                      {interestQuestions.map((question) => <QuestionField key={question.key} id={`enquiry-${question.key}`} question={question} value={answers[question.key]} error={fieldErrors[question.key]} portalContainer={dialogRef.current} onChange={(value) => setAnswer(question.key, value)} />)}
                    </div>}

                    {step === 2 && <div className="space-y-4">
                      <div className="rounded-2xl bg-gradient-to-br from-[#101a35] to-[#1b2b52] p-4 text-white sm:p-5">
                        <div className="flex items-start gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-200"><BadgeCheck size={21} /></span>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-200">Final check</p>
                            <h2 className="mt-1 font-display text-lg font-bold sm:text-xl">Review your enquiry</h2>
                            <p className="mt-1 text-sm leading-relaxed text-slate-300">Check your details and property choices before sending them to our team.</p>
                          </div>
                        </div>
                      </div>

                      <section aria-labelledby="review-contact-heading" className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5">
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-800"><UserRound size={19} /></span>
                            <div className="min-w-0"><h3 id="review-contact-heading" className="font-semibold text-slate-950">Contact details</h3><p className="text-xs text-slate-500">How our team can reach you</p></div>
                          </div>
                          <button type="button" onClick={() => editStep(0)} className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700/30"><PencilLine size={14} /> Edit</button>
                        </div>
                        <dl className="grid grid-cols-1 gap-2 border-t border-slate-100 bg-slate-50/70 p-3 sm:grid-cols-2 sm:p-4">
                          <ReviewDetail icon={UserRound} label="Full name" value={fields.full_name} />
                          <ReviewDetail icon={Phone} label="Phone / WhatsApp" value={fields.phone} />
                          {fields.email.trim() && <ReviewDetail icon={Mail} label="Email address" value={fields.email} />}
                          <ReviewDetail icon={MapPin} label="Current location" value={fields.location} />
                          {contactQuestion && <ReviewDetail icon={MessageCircle} label={contactQuestion.label} value={displayAnswer(contactQuestion, answers[contactQuestion.key])} />}
                        </dl>
                      </section>

                      <section aria-labelledby="review-plans-heading" className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5">
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-800"><ClipboardList size={19} /></span>
                            <div className="min-w-0"><h3 id="review-plans-heading" className="font-semibold text-slate-950">Property preferences</h3><p className="text-xs text-slate-500">Your selected answers</p></div>
                          </div>
                          <button type="button" onClick={() => editStep(1)} className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700/30"><PencilLine size={14} /> Edit</button>
                        </div>
                        <dl className="divide-y divide-slate-100 border-t border-slate-100 px-4 sm:px-5">
                          {interestQuestions.map((question, index) => <ReviewAnswer key={question.key} question={question} value={answers[question.key]} index={index} />)}
                        </dl>
                      </section>

                      {consentQuestion && <section aria-label="Contact permission" className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3 sm:p-4">
                        <div className="mb-3 flex items-center gap-3 px-1">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-800"><ShieldCheck size={19} /></span>
                          <div><h3 className="text-sm font-semibold text-slate-950">Permission to follow up</h3><p className="text-xs leading-relaxed text-slate-600">Your details will only be used to respond to this enquiry.</p></div>
                        </div>
                        <QuestionField id={`enquiry-${consentQuestion.key}`} question={consentQuestion} value={answers[consentQuestion.key]} error={fieldErrors[consentQuestion.key]} portalContainer={dialogRef.current} onChange={(value) => setAnswer(consentQuestion.key, value)} />
                      </section>}
                    </div>}

                    {formError && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-relaxed text-red-800" role="alert">{formError}</p>}
                  </div>

                  <div data-enquiry-action-bar="" className="fixed inset-x-0 bottom-0 z-30 flex flex-col-reverse items-stretch gap-2 border-t border-slate-200 bg-white px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-12px_32px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-8 sm:py-4 lg:sticky lg:bottom-0 lg:z-10 lg:rounded-b-[1.75rem] lg:shadow-none">
                    {step > 0 ? <button type="button" onClick={previousStep} disabled={submitting} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 disabled:opacity-50"><ArrowLeft size={16} /> Back</button> : <span className="text-[11px] leading-relaxed text-slate-500 sm:text-xs">Your details stay private and are used to respond to this enquiry.</span>}
                    {step < 2 ? (
                      <button type="button" onClick={continueStep} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-red-700 px-5 text-sm font-bold text-white transition hover:bg-red-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-700/20">Continue <ArrowRight size={16} /></button>
                    ) : (
                      <button type="submit" disabled={submitting} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-red-700 px-5 text-sm font-bold text-white transition hover:bg-red-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-700/20 disabled:cursor-wait disabled:opacity-60">{submitting ? <><LoaderCircle size={16} className="animate-spin" /> Sending...</> : <>Send enquiry <ArrowRight size={16} /></>}</button>
                    )}
                  </div>
                </form>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function TextInput({ id, label, value, onChange, type = "text", autoComplete, required = false, initialFocus = false, error }: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  autoComplete?: string
  required?: boolean
  initialFocus?: boolean
  error?: string
}) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="min-w-0 space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-800">{label}{required && <span className="text-red-700"> *</span>}</label>
      <input id={id} data-enquiry-initial-focus={initialFocus ? "true" : undefined} type={type} autoComplete={autoComplete} required={required} aria-invalid={error ? "true" : undefined} aria-describedby={errorId} value={value} onChange={(event) => onChange(event.target.value)} className="min-h-12 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition hover:border-slate-400 focus:border-red-700 focus:ring-4 focus:ring-red-700/10 aria-[invalid=true]:border-red-600" />
      {error && <p id={errorId} className="text-sm leading-relaxed text-red-700" role="status">{error}</p>}
    </div>
  );
}

function QuestionField({ id, question, value, error, portalContainer, onChange }: {
  id: string
  question: PublicLeadQuestion
  value: string | boolean | string[] | undefined
  error?: string
  portalContainer: HTMLElement | null
  onChange: (value: string | boolean | string[]) => void
}) {
  const errorId = error ? `${id}-error` : undefined;
  if (question.field_type === "checkbox") {
    return (
      <div className="space-y-1.5">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-start gap-3">
            <input id={id} type="checkbox" required={question.required} checked={value === true} aria-invalid={error ? "true" : undefined} aria-describedby={errorId} onChange={(event) => onChange(event.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-red-700" />
            <label htmlFor={id} className="cursor-pointer text-sm leading-relaxed text-slate-700">{question.label}{question.required && <span className="text-red-700"> *</span>}</label>
          </div>
          {question.help_text && <p className="ml-8 mt-2 text-xs leading-relaxed text-slate-500">{question.help_text}</p>}
        </div>
        {error && <p id={errorId} className="text-sm leading-relaxed text-red-700" role="status">{error}</p>}
      </div>
    );
  }

  const options = questionOptions(question);
  return (
    <div className="min-w-0 space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-800">{question.label}{question.required && <span className="text-red-700"> *</span>}</label>
      {question.field_type === "select" ? (
        <CampaignSelect id={id} value={typeof value === "string" ? value : ""} options={options} placeholder="Choose an option" required={question.required} invalid={Boolean(error)} describedBy={errorId} label={question.label} portalContainer={portalContainer} onChange={onChange} />
      ) : (
        <input id={id} type={question.field_type === "number" || question.field_type === "date" || question.field_type === "email" ? question.field_type : "text"} required={question.required} value={typeof value === "string" ? value : ""} aria-invalid={error ? "true" : undefined} aria-describedby={errorId} onChange={(event) => onChange(event.target.value)} className="min-h-12 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none focus:border-red-700 focus:ring-4 focus:ring-red-700/10 aria-[invalid=true]:border-red-600" />
      )}
      {error && <p id={errorId} className="text-sm leading-relaxed text-red-700" role="status">{error}</p>}
      {question.help_text && <p className="text-xs leading-relaxed text-slate-500">{question.help_text}</p>}
    </div>
  );
}

function ReviewDetail({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3">
      <dt className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500"><Icon size={14} className="shrink-0 text-slate-400" />{label}</dt>
      <dd className="mt-1.5 break-words text-sm font-semibold text-slate-900">{value || "Not provided"}</dd>
    </div>
  );
}

function ReviewAnswer({ question, value, index }: { question: PublicLeadQuestion; value: Answers[string] | undefined; index: number }) {
  const answer = displayAnswer(question, value);
  const unanswered = answer === "Not provided";
  return (
    <div className="flex min-w-0 items-start gap-3 py-3.5">
      <span aria-hidden="true" className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 font-mono text-[10px] font-bold text-slate-500">{String(index + 1).padStart(2, "0")}</span>
      <div className="min-w-0 flex-1">
        <dt className="text-xs font-medium leading-relaxed text-slate-600">{question.label}</dt>
        <dd className={`mt-1 text-sm font-semibold leading-relaxed ${unanswered ? "text-slate-400" : "text-slate-950"}`}>{answer}</dd>
      </div>
      {!unanswered && <Check size={16} aria-hidden="true" className="mt-1 shrink-0 text-emerald-700" />}
    </div>
  );
}

type SelectPosition = { top: number; left: number; width: number; maxHeight: number };

function CampaignSelect({ id, value, options, placeholder, required, invalid, describedBy, label, portalContainer, onChange }: {
  id: string
  value: string
  options: Array<{ value: string; label: string }>
  placeholder: string
  required: boolean
  invalid: boolean
  describedBy?: string
  label: string
  portalContainer: HTMLElement | null
  onChange: (value: string) => void
}) {
  const generatedId = useId();
  const listboxId = `${id}-${generatedId}-options`;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<SelectPosition | null>(null);
  const selectedIndex = options.findIndex((option) => option.value === value);

  const calculatePosition = useCallback((): SelectPosition | null => {
    const trigger = triggerRef.current;
    if (!trigger) return null;
    const rect = trigger.getBoundingClientRect();
    const desiredHeight = Math.min(240, options.length * 44 + 8);
    const actionBar = rootRef.current?.closest("[role='dialog']")?.querySelector<HTMLElement>("[data-enquiry-action-bar]");
    const bottomLimit = Math.min(window.innerHeight - 8, actionBar?.getBoundingClientRect().top ?? window.innerHeight);
    const spaceBelow = bottomLimit - rect.bottom - 6;
    const spaceAbove = rect.top - 8;
    const openAbove = spaceBelow < desiredHeight && spaceAbove > spaceBelow;
    const maxHeight = Math.max(48, Math.min(desiredHeight, openAbove ? spaceAbove : spaceBelow));
    const width = Math.min(rect.width, window.innerWidth - 16);
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
    return { top: openAbove ? rect.top - maxHeight - 6 : rect.bottom + 6, left, width, maxHeight };
  }, [options.length]);

  const close = useCallback((restoreFocus = false) => {
    setOpen(false);
    setPosition(null);
    if (restoreFocus) window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  function focusOption(index: number) {
    const available = options.map((_, optionIndex) => optionIndex);
    const targetIndex = available[index] ?? available.find((optionIndex) => options[optionIndex].value === value) ?? available[0];
    if (targetIndex !== undefined) optionRefs.current[targetIndex]?.focus();
  }

  function openMenu() {
    const nextPosition = calculatePosition();
    if (!nextPosition) return;
    setPosition(nextPosition);
    setOpen(true);
    window.requestAnimationFrame(() => focusOption(selectedIndex >= 0 ? selectedIndex : 0));
  }

  useLayoutEffect(() => {
    if (open) setPosition(calculatePosition());
  }, [calculatePosition, open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      close();
    };
    const reposition = () => setPosition(calculatePosition());
    document.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [calculatePosition, close, open, options.length]);

  function handleMenuKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const currentIndex = optionRefs.current.findIndex((option) => option === document.activeElement);
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close(true);
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex = currentIndex < 0 ? (direction > 0 ? 0 : options.length - 1) : (currentIndex + direction + options.length) % options.length;
      focusOption(nextIndex);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      focusOption(event.key === "Home" ? 0 : options.length - 1);
    } else if (event.key === "Tab") {
      event.preventDefault();
      close();
      const dialog = rootRef.current?.closest<HTMLElement>("[role='dialog']");
      const focusable = dialog ? [...dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]):not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )].filter((item) => item.offsetParent !== null) : [];
      const triggerIndex = focusable.indexOf(triggerRef.current as HTMLElement);
      const nextIndex = event.shiftKey ? triggerIndex - 1 : triggerIndex + 1;
      window.requestAnimationFrame(() => (focusable[nextIndex] ?? focusable[event.shiftKey ? focusable.length - 1 : 0])?.focus());
    }
  }

  const menu = open && position ? (
    <div ref={menuRef} id={listboxId} role="listbox" aria-label={label} onKeyDown={handleMenuKeyDown} className="overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_16px_40px_rgba(15,23,42,0.18)]" style={{ position: "fixed", top: position.top, left: position.left, width: position.width, maxHeight: position.maxHeight, overflowY: "auto", zIndex: 140 }}>
      {options.map((option, index) => {
        const selected = option.value === value;
        return (
          <button key={option.value} ref={(node) => { optionRefs.current[index] = node; }} type="button" role="option" aria-selected={selected} tabIndex={-1} className={`flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700/30 ${index > 0 ? "border-t border-slate-100" : ""} ${selected ? "bg-red-50 font-semibold text-red-800" : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"}`} onClick={() => { onChange(option.value); close(true); }}>
            <span aria-hidden="true" className={`flex h-5 w-5 shrink-0 items-center justify-center font-mono text-[10px] font-bold ${selected ? "text-red-800" : "text-slate-400"}`}>{String(index + 1).padStart(2, "0")}</span>
            <span className="min-w-0 flex-1 break-words">{option.label}</span>
            {selected && <Check size={14} aria-hidden="true" className="shrink-0" />}
          </button>
        );
      })}
    </div>
  ) : null;

  return (
    <div ref={rootRef} className="min-w-0">
      <button ref={triggerRef} id={id} type="button" role="combobox" aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? listboxId : undefined} aria-label={label} aria-required={required || undefined} aria-invalid={invalid || undefined} aria-describedby={describedBy} className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3 text-left text-base text-slate-950 outline-none transition hover:border-slate-400 focus-visible:ring-4 focus-visible:ring-red-700/10 ${invalid ? "border-red-600" : open ? "border-red-700" : "border-slate-300"}`} onClick={() => open ? close() : openMenu()} onKeyDown={(event: ReactKeyboardEvent<HTMLButtonElement>) => {
        if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
          event.preventDefault();
          if (open) focusOption(selectedIndex >= 0 ? selectedIndex : 0);
          else openMenu();
        } else if (event.key === "Escape" && open) {
          event.preventDefault();
          close(true);
        }
      }}>
        <span className={`min-w-0 flex-1 truncate ${selectedIndex < 0 ? "text-slate-500" : ""}`}>{selectedIndex >= 0 ? options[selectedIndex].label : placeholder}</span>
        <svg aria-hidden="true" viewBox="0 0 20 20" className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} fill="none"><path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {menu && createPortal(menu, portalContainer || document.body)}
    </div>
  );
}
