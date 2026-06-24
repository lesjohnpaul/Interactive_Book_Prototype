import { QUESTIONS } from "./questions";
import type { User } from "./store";

export type Section =
  | { kind: "prose"; text: string }
  | { kind: "quote"; text: string; source: string }
  | { kind: "reflection"; text: string }
  | { kind: "ornament" };

export type Chapter = {
  numeral: string;
  title: string;
  epigraph?: string;
  sections: Section[];
};

export type Book = {
  title: string;
  subtitle: string;
  dedication: string;
  foreword: string[];
  chapters: Chapter[];
  closing: string[];
};

/**
 * V1 generation engine: composes the book deterministically from the
 * reader's own answers. Designed so the chapter plan and weaving logic
 * can later be handed to an LLM (one prompt per chapter) without
 * changing the Book shape the reader consumes.
 */

function answer(user: User, id: string): string {
  return user.answers[id]?.text.trim() ?? "";
}

function firstSentence(text: string): string {
  const m = text.match(/^[^.!?]+[.!?]?/);
  return (m ? m[0] : text).trim();
}

function lcFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function stripEndPunct(text: string): string {
  return text.replace(/[.!?]+$/, "");
}

function snippet(text: string, maxWords = 14): string {
  const words = stripEndPunct(firstSentence(text)).split(/\s+/);
  if (words.length <= maxWords) return words.join(" ");
  return words.slice(0, maxWords).join(" ") + "…";
}

function firstNameOf(user: User): string {
  return user.name.split(/\s+/)[0];
}

export function generateBook(user: User): Book {
  const name = firstNameOf(user);
  const a = (id: string) => answer(user, id);

  const chapterFourTitle = a("q24")
    ? stripEndPunct(firstSentence(a("q24")))
    : "The Unwritten Chapter";

  const dedication = `For ${user.name} — written from your own words, ${new Date(
    user.bookGeneratedAt ?? Date.now()
  ).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.`;

  const foreword = [
    `This is not a book about someone else. Every example in these pages, every case study, every turning point belongs to you, ${name}. You wrote it without noticing, one honest answer at a time.`,
    `Read it slowly. Some of what follows you said in passing; seen in print, it may say more than you intended. That is the point. A life examined at the right distance starts to look like what it has been all along — a story, with an author who is still holding the pen.`,
  ];

  /* ── Chapter I — Where You Began ─────────────────────────── */
  const ch1: Chapter = {
    numeral: "I",
    title: "Where You Began",
    epigraph: a("q6") ? `“${stripEndPunct(firstSentence(a("q6")))}.”` : undefined,
    sections: [],
  };

  if (a("q1")) {
    ch1.sections.push({
      kind: "prose",
      text: `Every story is rooted somewhere, and yours begins in a particular place. ${a("q1")}`,
    });
    ch1.sections.push({
      kind: "reflection",
      text: `Notice the details you chose to remember. Of everything that place contained, your memory kept these. What we retain is rarely an accident — it is the first draft of who we become.`,
    });
  }

  if (a("q2")) {
    ch1.sections.push({
      kind: "quote",
      text: snippet(a("q2"), 22),
      source: "A moment you return to",
    });
    ch1.sections.push({
      kind: "prose",
      text: `You return to that moment often — your words, not ours. The memories we revisit are the ones still doing work in us. Whatever that moment holds, it is not finished with you yet, which means there is still something in it you need.`,
    });
  }

  if (a("q3")) {
    ch1.sections.push({
      kind: "prose",
      text: `Then there are the people. Asked who shaped you most, you didn't hesitate: ${lcFirst(a("q3"))} The people who form us early set the questions we spend decades answering. Some of what you'll read in later chapters traces directly back to this influence — watch for it.`,
    });
  }

  if (a("q4")) {
    ch1.sections.push({
      kind: "prose",
      text: `The world had words for you before you had words for yourself. ${a("q4")} Childhood labels are half observation, half assignment. Part of growing up is deciding which of those words to keep and which were never really yours.`,
    });
  }

  if (a("q5")) {
    ch1.sections.push({
      kind: "prose",
      text: `And there was a wish. ${a("q5")} Early dreams rarely die; they change clothes. As you read the chapters ahead, ask whether that early wish is still visible in the shape of your current days — it usually is, once you know to look.`,
    });
  }

  /* ── Chapter II — The Shape of Your Days ────────────────── */
  const ch2: Chapter = {
    numeral: "II",
    title: "The Shape of Your Days",
    epigraph: a("q8") ? `“${snippet(a("q8"), 16)}.”` : undefined,
    sections: [],
  };

  if (a("q7")) {
    ch2.sections.push({
      kind: "prose",
      text: `Here is an ordinary day in your life, as you describe it: ${a("q7")}`,
    });
    ch2.sections.push({
      kind: "reflection",
      text: `Read your day back as a stranger would. Where does the energy go? Who gets the best hours? An ordinary day, repeated, is not a detail of a life — it is the life.`,
    });
  }

  if (a("q8")) {
    ch2.sections.push({
      kind: "prose",
      text: `Within that routine, one moment stands apart. You said the part of the day that feels most like you is ${lcFirst(stripEndPunct(a("q8")))}. Hold onto that. It is a compass needle, and most plans for the future are really attempts to build more of that moment into more of the day.`,
    });
  }

  if (a("q9")) {
    ch2.sections.push({
      kind: "quote",
      text: snippet(a("q9"), 22),
      source: "What occupies your mind these days",
    });
    ch2.sections.push({
      kind: "prose",
      text: `That is the thought waiting for you when nothing else is. Preoccupations are unscheduled appointments with ourselves; this one will keep rescheduling until it is met directly. Chapter IV returns to it.`,
    });
  }

  if (a("q11")) {
    ch2.sections.push({
      kind: "prose",
      text: `When no one is watching and nothing is required, you turn to this: ${lcFirst(a("q11"))} The unobserved self is the most honest witness in this book. What it chooses, freely and repeatedly, is as close to a definition of you as these pages will get.`,
    });
  }

  if (a("q12")) {
    ch2.sections.push({
      kind: "prose",
      text: `And yet something in the current arrangement chafes. In your words: ${lcFirst(a("q12"))} Naming what we tolerate is the first act of refusing it. You have now named it in writing.`,
    });
  }

  /* ── Chapter III — What You Carry ───────────────────────── */
  const ch3: Chapter = {
    numeral: "III",
    title: "What You Carry",
    epigraph: a("q13") ? `“${snippet(a("q13"), 16)}.”` : undefined,
    sections: [],
  };

  if (a("q13")) {
    ch3.sections.push({
      kind: "prose",
      text: `Everyone carries a private constitution — articles of belief that the people around them may not share. Yours includes this: ${a("q13")} Convictions held against the grain cost something to keep. That you have paid the cost says as much about you as the belief itself.`,
    });
  }

  if (a("q14")) {
    ch3.sections.push({
      kind: "prose",
      text: `You also carry a quieter passenger. ${a("q14")} Fear of this kind doesn't announce itself; it steers from the back seat, one small decision at a time. Seeing your own hand name it on a page is the beginning of taking the wheel back.`,
    });
  }

  if (a("q15")) {
    ch3.sections.push({
      kind: "quote",
      text: snippet(a("q15"), 22),
      source: "A time you surprised yourself",
    });
    ch3.sections.push({
      kind: "prose",
      text: `Keep that surprise close. It is evidence — admissible, first-hand evidence — that your own forecast of yourself runs conservative. Whatever you believe your limits are, you have already been wrong about them at least once.`,
    });
  }

  if (a("q16")) {
    ch3.sections.push({
      kind: "prose",
      text: `There is weight in this chapter, too, and you did not look away from it. ${a("q16")} What hard seasons leave behind is rarely only damage. Often it is also instruction — and an authority to speak about survival that cannot be acquired any other way.`,
    });
  }

  if (a("q17") || a("q18")) {
    const thanks = a("q17")
      ? `Listen to what people thank you for: ${lcFirst(a("q17"))} Gratitude, repeated, is the world telling you where your gift sits.`
      : "";
    const love = a("q18")
      ? ` And when love is asked of you and you do it well, it looks like this: ${lcFirst(a("q18"))}`
      : "";
    ch3.sections.push({ kind: "prose", text: `${thanks}${love}`.trim() });
    ch3.sections.push({
      kind: "reflection",
      text: `Set these side by side — the believing, the fearing, the surviving, the giving. This is the luggage you bring into every room. Most of it, it turns out, is worth carrying.`,
    });
  }

  /* ── Chapter IV — the reader's own title ────────────────── */
  const ch4: Chapter = {
    numeral: "IV",
    title: chapterFourTitle,
    epigraph: `The title of this chapter is yours. You wrote it.`,
    sections: [],
  };

  if (a("q19")) {
    ch4.sections.push({
      kind: "prose",
      text: `Begin with the honest forecast. If nothing changed, you said, ${lcFirst(a("q19"))} A projection like that is not a verdict — it is a draft shown to the author early enough to revise.`,
    });
  }

  if (a("q20")) {
    ch4.sections.push({
      kind: "quote",
      text: snippet(a("q20"), 22),
      source: "What you would attempt, with permission to fail",
    });
    ch4.sections.push({
      kind: "prose",
      text: `Read that again, slowly. The only condition you required was the continued pride of people who — almost certainly — would be proud of you for attempting it at all. The permission you were waiting for has, in other words, already been granted.`,
    });
  }

  if (a("q21")) {
    ch4.sections.push({
      kind: "prose",
      text: `You already know the direction of travel. More and less, in your own accounting: ${lcFirst(a("q21"))} Most plans fail by being vague. This one has the rare advantage of being specific.`,
    });
  }

  if (a("q22")) {
    ch4.sections.push({
      kind: "prose",
      text: `One thing stands between this chapter and the next, and you named it without being asked twice: ${lcFirst(a("q22"))} Postponed conversations gather interest. The cost of having it is fixed; the cost of waiting compounds.`,
    });
  }

  if (a("q23")) {
    ch4.sections.push({
      kind: "prose",
      text: `And when you imagine being remembered — not in general, but by one particular person — this is what you hope for: ${lcFirst(a("q23"))} That sentence is the quiet thesis of this entire book. Every chapter before it has been an argument in its favor.`,
    });
    ch4.sections.push({
      kind: "reflection",
      text: `A title, a direction, a postponed conversation, a person to be remembered by. That is not a questionnaire result. That is a plan.`,
    });
  }

  const closing = [
    `You have reached the end of this book, ${name}, but you will have noticed that it has no real ending — the final chapter is titled and outlined, and its author is reading this sentence.`,
    `Answer the questions again in a year and this book will be different, because you will be. That is the only promise SOURCE makes: the story is yours, and it is still being written.`,
  ];

  const chapters = [ch1, ch2, ch3, ch4].filter((c) => c.sections.length > 0);

  return {
    title: `The Story of ${name}`,
    subtitle: "Your very own storybook in four chapters, told in your own words",
    dedication,
    foreword,
    chapters,
    closing,
  };
}

export function answeredEnough(user: User): boolean {
  return QUESTIONS.filter((q) => user.answers[q.id]?.text.trim()).length >= 8;
}
