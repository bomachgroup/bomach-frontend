import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  CircleHelp,
  Compass,
  LandPlot,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import BaleInventoryExplorer from "./BaleInventoryExplorer";

export const metadata: Metadata = {
  title: "BALE | Own a Piece of the City",
  description:
    "Discover BALE, Bomach Group's land-ownership campaign. Learn what to consider, explore participating estates, and get clear information before you decide.",
  alternates: { canonical: "/bale" },
};

const campaignPrinciples = [
  {
    number: "01",
    title: "Make the decision understandable",
    description:
      "Land ownership is a significant choice. BALE puts the key questions in view so you can understand what is being offered before taking a next step.",
    Icon: Compass,
  },
  {
    number: "02",
    title: "Look at the details, not just the headline",
    description:
      "Consider the estate, the specific property, its size, location and current listed price. The right choice depends on your plans and the information you verify.",
    Icon: LandPlot,
  },
  {
    number: "03",
    title: "Ask, check and confirm",
    description:
      "Before making a commitment, speak with Bomach about current terms, the documents available for review, payment instructions and the steps that apply to your chosen property.",
    Icon: ShieldCheck,
  },
];

const decisionQuestions = [
  "What is the current price and what payment terms have been approved?",
  "Which estate and specific property am I considering, and what is its current availability?",
  "What documents can I review, and how can I verify them with Bomach?",
  "What are the official next steps and payment channels?",
];

const buyerJourney = [
  {
    number: "01",
    title: "Start with your plans",
    description:
      "Think about why you are considering land and what matters most to you: location, size, intended use or timing.",
  },
  {
    number: "02",
    title: "Explore the participating estates",
    description:
      "Review the current catalogue to see which estates and properties are published for BALE, along with the details available for each.",
  },
  {
    number: "03",
    title: "Talk it through before deciding",
    description:
      "Contact Bomach to confirm current availability, approved commercial terms and the verification steps for the property you are considering.",
  },
];

export default function BalePage() {
  return (
    <main className="overflow-hidden bg-white">
      <section className="relative isolate overflow-hidden bg-secondary-950 text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_44%,rgba(63,63,149,.36),transparent_42%),radial-gradient(ellipse_at_4%_100%,rgba(253,1,0,.19),transparent_36%)]" />
        <div className="absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.3)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />

        <div className="container-custom grid items-center gap-8 py-10 sm:gap-12 sm:py-16 lg:min-h-[620px] lg:grid-cols-[1.1fr_.9fr] lg:gap-16 lg:py-20">
          <div className="relative z-10 max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.22em] text-white/70 sm:text-xs">
              <span className="h-px w-8 bg-primary-500 sm:w-10" />
              Bomach Group presents{" "}
              <span className="text-primary-400">BALE</span>
            </p>
            <h1 className="max-w-[13ch] text-[2.7rem] font-black leading-[.98] tracking-[-.055em] text-white sm:text-6xl lg:text-7xl">
              Become a landlord{" "}
              <span className="text-primary-400">with ease.</span>
            </h1>
            <p className="mt-5 max-w-2xl font-display text-xl font-bold leading-tight text-white sm:mt-7 sm:text-2xl lg:text-3xl">
              Own a piece of the city.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-secondary-200 sm:mt-5 sm:text-lg sm:leading-8">
              BALE is Bomach Group&apos;s land-ownership campaign. It is a
              clearer place to learn about the offer, explore participating
              estates, ask questions and get current information before you
              decide.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Link
                href="#about-bale"
                className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-primary-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary-950/30 transition hover:-translate-y-0.5 hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:w-auto sm:px-6"
              >
                Discover the BALE approach
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#estates"
                className="inline-flex min-h-11 items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-white/75 transition hover:text-white sm:py-3"
              >
                Explore participating estates <ArrowDown className="h-4 w-4" />
              </a>
            </div>
          </div>

          <aside
            aria-label="BALE campaign identity"
            className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/[.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-sm sm:rounded-[2rem] sm:p-8"
          >
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-white/10 sm:h-72 sm:w-72" />
            <div className="absolute -right-7 -top-10 h-40 w-40 rounded-full border border-primary-500/35 sm:h-52 sm:w-52" />
            <div className="relative">
              <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-5 sm:pb-7">
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-white/55 sm:text-xs">
                  The campaign
                </p>
                <span className="rounded-full border border-primary-400/30 bg-primary-500/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.14em] text-primary-200 sm:text-[10px]">
                  A Bomach initiative
                </span>
              </div>
              <p className="mt-6 font-display text-[4.5rem] font-black leading-none tracking-[-.08em] text-white sm:mt-8 sm:text-8xl">
                BALE<span className="text-primary-500">.</span>
              </p>
              <p className="mt-3 max-w-sm text-sm font-semibold leading-6 text-white/75 sm:text-base">
                Become a Landlord with Ease
              </p>
              <div className="mt-7 flex items-center gap-3 sm:mt-9">
                <span className="h-1 w-12 rounded-full bg-primary-500" />
                <p className="text-[10px] font-bold uppercase tracking-[.18em] text-white/60 sm:text-xs">
                  Land · Place · Possibility
                </p>
              </div>
              <p className="mt-5 max-w-sm border-l border-white/20 pl-4 text-xs leading-5 text-white/55 sm:mt-6 sm:text-sm sm:leading-6">
                A campaign to make the journey to land ownership easier to
                understand, one informed decision at a time.
              </p>
            </div>
          </aside>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </section>

      <section
        id="about-bale"
        className="scroll-mt-20 bg-white py-12 sm:scroll-mt-24 sm:py-20 lg:py-24"
      >
        <div className="container-custom">
          <div className="grid gap-5 pb-10 sm:gap-8 sm:pb-14 lg:grid-cols-[.9fr_1.1fr] lg:items-end lg:gap-20">
            <div>
              <p className="section-subtitle mb-5">More than a listing</p>
              <h2 className="max-w-lg text-3xl font-black leading-[1.08] tracking-tight text-secondary-950 sm:text-4xl lg:text-5xl">
                A considered path to land ownership.
              </h2>
            </div>
            <p className="max-w-2xl border-l-2 border-primary-500 pl-4 text-base leading-7 text-secondary-600 sm:pl-6 sm:text-lg sm:leading-8">
              Buying land is a meaningful decision, not a quick click. BALE
              brings the campaign message and participating Bomach estates
              together, with space to understand what is available, ask for the
              information you need and make your own decision. The aim is
              clarity and confidence, not pressure or promises about future
              returns.
            </p>
          </div>

          <div className="border-t border-secondary-200">
            {campaignPrinciples.map(({ number, title, description, Icon }) => (
              <article
                key={number}
                className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-4 gap-y-3 border-b border-secondary-200 py-6 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-x-6 sm:py-8 lg:grid-cols-[7rem_.9fr_1.1fr] lg:items-center lg:gap-x-10 lg:py-9"
              >
                <div className="row-span-2 flex flex-col items-start gap-1 lg:row-span-1">
                  <span className="font-display text-3xl font-black leading-none tracking-tight text-primary-700 sm:text-4xl">
                    {number}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[.16em] text-secondary-400 sm:text-[10px]">
                    BALE principle
                  </span>
                </div>
                <h3 className="flex items-start gap-3 font-display text-lg font-bold leading-snug text-secondary-950 sm:text-xl">
                  <Icon
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary-600"
                    aria-hidden="true"
                  />
                  {title}
                </h3>
                <p className="col-start-2 text-sm leading-6 text-secondary-600 sm:text-base sm:leading-7 lg:col-start-auto">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-secondary-50 py-14 sm:py-20 lg:py-24">
        <div className="container-custom">
          <div className="mb-8 flex flex-col gap-5 sm:mb-11 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <div className="max-w-2xl">
              <p className="section-subtitle">A practical way to begin</p>
              <h2 className="max-w-xl text-3xl font-black leading-[1.08] tracking-tight text-secondary-950 sm:text-4xl lg:text-5xl">
                Your plans first. The property details next.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-secondary-600 sm:text-base sm:leading-7">
                Whether you are exploring land for the first time or comparing
                options, take the process one question at a time. There is no
                need to decide from a headline alone.
              </p>
            </div>
            <Link
              href="/contact"
              className="group inline-flex min-h-11 w-fit shrink-0 items-center gap-2 border-b border-secondary-300 pb-1 text-sm font-bold text-secondary-950 transition-colors hover:border-primary-600 hover:text-primary-700"
            >
              Speak with Bomach
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <ol className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
            {buyerJourney.map(({ number, title, description }) => (
              <li
                key={number}
                className="flex min-h-52 flex-col rounded-2xl border border-secondary-200 border-t-[3px] border-t-primary-600 bg-white p-5 shadow-sm sm:min-h-60 sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl font-black tracking-tight text-primary-700 sm:text-4xl">
                    {number}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[.17em] text-secondary-400 sm:text-[10px]">
                    Step {number}
                  </span>
                </div>
                <h3 className="mt-5 max-w-xs font-display text-lg font-bold leading-snug text-secondary-950 sm:mt-7 sm:text-xl">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-secondary-600 sm:mt-3 sm:text-base sm:leading-7">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20 lg:py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-subtitle">Before you commit</p>
            <h2 className="text-3xl font-black leading-[1.08] tracking-tight text-secondary-950 sm:text-4xl lg:text-5xl">
              Good questions make for clearer decisions.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-secondary-600 sm:text-base sm:leading-7">
              Use these prompts when reviewing a property or speaking with the
              Bomach team. Confirm the details that matter to you through
              official channels.
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-5xl gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4">
            {decisionQuestions.map((question, index) => (
              <article
                key={question}
                className="flex min-h-28 gap-4 rounded-2xl border border-secondary-200 bg-secondary-50/60 p-5 sm:min-h-32 sm:items-start sm:p-6"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-primary-700 ring-1 ring-secondary-200">
                  <CircleHelp className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[.16em] text-secondary-400 sm:text-[10px]">
                    Question {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1.5 text-sm font-semibold leading-6 text-secondary-900 sm:text-base">
                    {question}
                  </h3>
                </div>
              </article>
            ))}
          </div>

          <div className="mx-auto mt-5 flex max-w-5xl flex-col gap-4 rounded-2xl border border-secondary-200 bg-secondary-950 p-5 text-white sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3 sm:items-center">
              <BadgeCheck
                className="mt-0.5 h-5 w-5 shrink-0 text-primary-400 sm:mt-0"
                aria-hidden="true"
              />
              <p className="max-w-3xl text-sm leading-6 text-white/75">
                Listings and availability can change. Confirm current details,
                approved terms and official payment instructions with Bomach
                before taking action.
              </p>
            </div>
            <Link
              href="/contact"
              className="group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold text-white transition hover:border-white/50 hover:bg-white/10"
            >
              Ask Bomach a question <MessageCircle className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <BaleInventoryExplorer />

      <section className="relative overflow-hidden bg-secondary-950 py-12 text-white sm:py-16">
        <div className="absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_90%_50%,rgba(253,1,0,.2),transparent_38%)]" />
        <div className="container-custom relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-primary-300 sm:text-xs">
              BALE · Become a Landlord with Ease
            </p>
            <h2 className="mt-3 text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
              Take the next step with clear information.
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/65 sm:text-base">
              Have a question about an estate or property? Contact Bomach to
              discuss the current details before you decide.
            </p>
          </div>
          <Link
            href="/contact"
            className="group inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-3 rounded-full bg-primary-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:w-auto"
          >
            Contact Bomach
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}
