export type Question = {
  id: string;
  part: number;
  prompt: string;
  hint: string;
  /** Warm, encouraging coaching tip shown in the "Need a nudge?" helper. */
  tip: string;
  /** A concrete sample answer the user can insert with one tap. */
  example: string;
  /** Three short tap-to-insert sentence starters. */
  starters: string[];
};

export type Part = {
  number: number;
  numeral: string;
  title: string;
  intro: string;
  /** Decorative illustration shown behind questions and on part intros. */
  image: string;
  /** Palette token name used to color this part's UI accents. */
  color: "sienna" | "sky-deep" | "grape" | "moss";
};

/**
 * V1 demo set: 24 of the planned 50–80 questions, in four movements.
 * Each question maps directly into a chapter of the generated book.
 */
export const PARTS: Part[] = [
  {
    number: 1,
    numeral: "I",
    title: "Where You Began",
    intro:
      "Every book opens somewhere. These questions return you to the places and people that made you, before you had any say in the matter.",
    image: "/illustrations/part-1.webp",
    color: "sienna",
  },
  {
    number: 2,
    numeral: "II",
    title: "The Shape of Your Days",
    intro:
      "A life is mostly made of ordinary days. Look closely at yours — what they hold, what they cost, what they quietly reveal.",
    image: "/illustrations/part-2.webp",
    color: "sky-deep",
  },
  {
    number: 3,
    numeral: "III",
    title: "What You Carry",
    intro:
      "Beliefs, fears, scars, gifts. The invisible luggage you bring into every room. Set it on the table and look at it.",
    image: "/illustrations/part-3.webp",
    color: "grape",
  },
  {
    number: 4,
    numeral: "IV",
    title: "The Person You're Becoming",
    intro:
      "The last questions face forward. Answer them honestly and the final chapter of your book will already be underway.",
    image: "/illustrations/part-4.webp",
    color: "moss",
  },
];

export const QUESTIONS: Question[] = [
  // Part I — Where You Began
  {
    id: "q1",
    part: 1,
    prompt: "Where did you grow up — and what did it look, sound, and smell like?",
    hint: "Streets, kitchens, weather, noise. The texture of the place.",
    tip: "There's no wrong answer here — even one small detail like a smell or a sound is perfect. Close your eyes for a second and step back inside the place. What's the first thing your senses find?",
    example:
      "I grew up in a small apartment above my parents' bakery — the whole stairwell smelled like warm bread, and the floor hummed when the mixers started at four in the morning.",
    starters: ["I grew up in…", "What I remember most is…", "The sounds I still hear are…"],
  },
  {
    id: "q2",
    part: 1,
    prompt: "Describe a moment from childhood you return to often.",
    hint: "It doesn't have to be important. It only has to be yours.",
    tip: "Trust the moment your memory hands you first — the small, odd ones are usually the truest. You don't need to explain why it matters; just describe what you can still see.",
    example:
      "I keep going back to a rainy afternoon when the power went out and my mother lit candles and told us ghost stories under the dining table. Nothing happened — and it was everything.",
    starters: ["The moment I return to is…", "I must have been about…", "I remember it because…"],
  },
  {
    id: "q3",
    part: 1,
    prompt: "Who shaped you most when you were young — and how?",
    hint: "A parent, a teacher, a neighbor, a stranger on a bus.",
    tip: "It doesn't have to be the person you loved most — just the one who left fingerprints on who you became. One small scene with them says more than a whole biography.",
    example:
      "My grandfather, who barely spoke. He'd hand me his tools and nod when I got it right, and somehow that nod taught me more than any lecture ever could.",
    starters: ["The person who shaped me most was…", "What they taught me was…", "I still hear them saying…"],
  },
  {
    id: "q4",
    part: 1,
    prompt: "What were you like as a child, in the words people used about you then?",
    hint: "“Shy.” “A handful.” “Always drawing.” What did they say?",
    tip: "Borrow other people's words for this one — what teachers wrote, what aunties said at parties. You can agree or disagree with them; both make a great answer.",
    example:
      "'A little dreamer,' my teachers wrote on every report card. My aunt called me 'the lawyer,' because I argued about bedtime like my whole future depended on it.",
    starters: ["People used to call me…", "My family always said I was…", "Looking back, they were right about…"],
  },
  {
    id: "q5",
    part: 1,
    prompt: "What did you want to be when you grew up — and what happened to that wish?",
    hint: "Did it fade, transform, or is it still waiting?",
    tip: "Old dreams never really disappear — they change shape. Be gentle with your younger self here; even a wish that faded tells us what you loved.",
    example:
      "I wanted to be a veterinarian until I learned the animals could get hurt. The wish quietly turned into nursing — different patients, same instinct to take care of things.",
    starters: ["When I was little, I wanted to be…", "That dream changed when…", "A piece of it is still alive in…"],
  },
  {
    id: "q6",
    part: 1,
    prompt: "What was one rule, spoken or unspoken, that your family lived by?",
    hint: "“We don't talk about money.” “Work comes first.” “Never leave angry.”",
    tip: "The unspoken rules are often the strongest ones — the things everyone simply did without being told. If you're stuck, think of what would have shocked your family.",
    example:
      "Sundays were sacred — no argument was allowed to survive past Sunday lunch. Nobody ever said it out loud, but everyone showed up at the table, even mid-fight.",
    starters: ["In our house, the rule was…", "Nobody ever said it, but…", "I only noticed the rule when…"],
  },

  // Part II — The Shape of Your Days
  {
    id: "q7",
    part: 2,
    prompt: "Walk through an ordinary day in your life right now.",
    hint: "From waking to sleeping. Don't tidy it up.",
    tip: "Resist the urge to make it sound impressive — the snoozed alarms and reheated coffee are the good stuff. An honest Tuesday is worth more than a polished highlight reel.",
    example:
      "The alarm goes off at 5:40 and I snooze it exactly once. Coffee in the same chipped mug, twenty emails before anyone's awake — then the day belongs to everyone but me until about nine at night.",
    starters: ["My day starts with…", "By the middle of the day…", "The last thing I do at night is…"],
  },
  {
    id: "q8",
    part: 2,
    prompt: "What part of your day feels most like you?",
    hint: "The moment you recognize yourself.",
    tip: "Look for the moment when you stop performing for anyone — even for five minutes. It's often something tiny: a walk, a song, the first sip of something warm.",
    example:
      "The half hour after dinner when I water the plants and the house goes quiet. Nobody needs anything from me, and I can feel myself come back into my own body.",
    starters: ["I feel most like myself when…", "It usually happens around…", "In that moment I…"],
  },
  {
    id: "q9",
    part: 2,
    prompt: "What is occupying your mind most these days?",
    hint: "The thought that's there when nothing else is.",
    tip: "You don't have to solve it here — just name it. Whatever shows up in the shower or right before sleep is exactly the thing this page is for.",
    example:
      "Whether to take the job in another city. It's the first thought in the shower and the last one before sleep — I keep packing and unpacking the decision in my head.",
    starters: ["Lately I keep thinking about…", "It shows up most when…", "What I haven't said out loud is…"],
  },
  {
    id: "q10",
    part: 2,
    prompt: "Who are the people you talk to most — and what do you talk about?",
    hint: "And what do you never talk about?",
    tip: "Both halves matter — the conversations you have and the ones you carefully avoid. Even naming one person and one untouchable topic paints a whole picture.",
    example:
      "My sister, almost daily — her kids, my deadlines, what we're each cooking. What we never talk about is Dad, and we both know exactly why.",
    starters: ["The person I talk to most is…", "We mostly talk about…", "What we never talk about is…"],
  },
  {
    id: "q11",
    part: 2,
    prompt: "What do you do when no one is watching and nothing is required of you?",
    hint: "The unobserved self has its own habits.",
    tip: "This is a judgment-free page — the sillier and more specific, the better. The private rituals nobody sees are some of the most lovable parts of a person.",
    example:
      "I put on old salsa records and cook far too much food for one person, dancing badly between the stove and the sink. The neighbors have definitely seen me.",
    starters: ["When no one's watching, I…", "My secret little ritual is…", "Nobody knows that I…"],
  },
  {
    id: "q12",
    part: 2,
    prompt: "What are you tolerating right now that you wish you weren't?",
    hint: "A situation, a habit, a silence.",
    tip: "Saying it on paper isn't the same as confronting it — this stays between you and your book. Start small if you need to; even naming it loosens its grip a little.",
    example:
      "A friendship that's been running on old memories for years. I keep showing up out of loyalty to who we were, not who we are now.",
    starters: ["I've been putting up with…", "If I'm honest, it costs me…", "I wish I could finally…"],
  },

  // Part III — What You Carry
  {
    id: "q13",
    part: 3,
    prompt: "What do you believe that most people around you don't?",
    hint: "A conviction you hold quietly, or loudly.",
    tip: "It doesn't have to be controversial — just genuinely yours. Think of a moment you stayed quiet in a conversation because your honest opinion would have surprised the room.",
    example:
      "I believe most people are doing their best with what they were given — even the ones who hurt me. It's not a popular opinion at my family's dinner table.",
    starters: ["I quietly believe that…", "Most people around me think the opposite, but…", "I came to believe this when…"],
  },
  {
    id: "q14",
    part: 3,
    prompt: "What is a fear that has quietly steered your decisions?",
    hint: "Not the dramatic kind. The kind that drives.",
    tip: "Look at your patterns instead of your feelings — the jobs not applied for, the calls not made. The fear is usually hiding right behind a habit. Naming it is brave, and it's enough.",
    example:
      "The fear of being a burden. It's why I learned to say 'I'm fine' in three languages, and why I've never once asked for help moving apartments.",
    starters: ["The fear that drives me is…", "It started back when…", "Because of it, I tend to…"],
  },
  {
    id: "q15",
    part: 3,
    prompt: "Describe a time you surprised yourself.",
    hint: "Courage, anger, tenderness, capability — any of it.",
    tip: "Think of a moment you did something and thought, 'Where did that come from?' It can be loud or quiet — staying calm in a storm counts just as much as jumping into one.",
    example:
      "When my father got sick, I expected to fall apart. Instead I became the one making lists, calling doctors, holding everyone steady — I didn't know that person lived in me.",
    starters: ["I surprised myself when…", "I always thought I was…", "What I did next was…"],
  },
  {
    id: "q16",
    part: 3,
    prompt: "What is the hardest thing you've lived through — and what did it leave behind?",
    hint: "Share only what you're ready to. This book is yours alone.",
    tip: "Go only as far as feels safe — a single sentence is a complete answer here. And if it helps, focus less on what happened and more on who walked out the other side.",
    example:
      "The year the marriage ended. It left behind a quieter, sturdier version of me — and an unshakeable knowledge of exactly how much I can carry.",
    starters: ["The hardest thing I've lived through is…", "At the time, I…", "What it left behind is…"],
  },
  {
    id: "q17",
    part: 3,
    prompt: "What do people thank you for?",
    hint: "Listen to the compliments you keep receiving.",
    tip: "If this feels like bragging, you're doing it right — let other people's gratitude do the talking. What's the compliment you keep brushing off?",
    example:
      "People thank me for remembering — birthdays, the name of their dog, the thing they mentioned three months ago. Apparently being truly listened to is rarer than I thought.",
    starters: ["People often thank me for…", "Just last week, someone said…", "I never thought it was special, but…"],
  },
  {
    id: "q18",
    part: 3,
    prompt: "What does love look like when you do it well?",
    hint: "Romantic or otherwise. The verb, not the noun.",
    tip: "Think in actions, not feelings — the soup delivered, the long drive, the text at exactly the right moment. How do the people you love know that you love them?",
    example:
      "Love, when I do it well, looks like showing up with soup before being asked. It's noticing the small storm on someone's face and making room for it.",
    starters: ["When I love someone well, I…", "It looks like…", "I learned this kind of love from…"],
  },

  // Part IV — The Person You're Becoming
  {
    id: "q19",
    part: 4,
    prompt: "If nothing changed, where would you be in ten years — and how does that sit with you?",
    hint: "Project the current trajectory honestly.",
    tip: "This one asks for honesty, not optimism — and however the picture makes you feel is useful information. Comfort and discomfort are both worth writing down.",
    example:
      "Same desk, same commute, ten more years of 'someday.' Writing that down makes my chest feel tight — which probably tells me everything I need to know.",
    starters: ["If nothing changed, I'd be…", "Honestly, that makes me feel…", "The part I can't accept is…"],
  },
  {
    id: "q20",
    part: 4,
    prompt: "What would you attempt if you knew the people you love would be proud of you even if you failed?",
    hint: "Permission, granted hypothetically.",
    tip: "Don't worry about whether it's realistic — this page runs on permission, not planning. Pick the dream you've described to yourself in the most detail.",
    example:
      "I'd open the little bookshop-café I've been designing in my head for a decade — mismatched chairs, a shelf just for secondhand poetry. Even the failure would smell like coffee and paper.",
    starters: ["I would finally try…", "I've held back because…", "Even if I failed, I'd still…"],
  },
  {
    id: "q21",
    part: 4,
    prompt: "What do you want more of in your life? And less of?",
    hint: "Two lists. Be specific.",
    tip: "Specific beats grand here — 'more slow mornings' says more than 'more happiness.' Even two or three items on each list makes a beautiful answer.",
    example:
      "More slow mornings, more saying yes to the lake, more phone calls with my brother. Less apologizing for resting, less scrolling, less saying 'it's fine' when it isn't.",
    starters: ["I want more…", "I want less…", "The first thing I'd change is…"],
  },
  {
    id: "q22",
    part: 4,
    prompt: "What is one conversation you've been postponing?",
    hint: "With someone else — or with yourself.",
    tip: "You don't have to have the conversation — just describe it. Who is it with, and what's the one sentence you'd need the courage to say first?",
    example:
      "The one with my mother about what happens when she can't live alone anymore. I rehearse it on every drive home and lose my nerve in her driveway.",
    starters: ["The conversation I keep postponing is…", "I've put it off because…", "What I really need to say is…"],
  },
  {
    id: "q23",
    part: 4,
    prompt: "How do you want to be remembered — not in general, but by one specific person?",
    hint: "Name them, if only to yourself.",
    tip: "Choosing one face makes this question easier, not harder. Picture them telling a story about you years from now — what do you hope the story is?",
    example:
      "By my daughter — as the one who always pulled over for sunsets. I want her to remember that I noticed things, and that she was the thing I noticed most.",
    starters: ["I want them to remember me as…", "The person I'm thinking of is…", "When they think of me, I hope…"],
  },
  {
    id: "q24",
    part: 4,
    prompt: "If your life were a book and the next chapter started today, what would it be called?",
    hint: "This will become the title of your final chapter.",
    tip: "Play with it — try a few titles out loud and keep the one that makes you sit up straighter. A little explanation of why is the perfect finishing touch.",
    example:
      "'The Year of the Open Door.' Because I've spent so long keeping things out — and the next chapter is about what I finally let in.",
    starters: ["I'd call it…", "Because lately…", "It's the chapter where I…"],
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;

export function questionsForPart(part: number): Question[] {
  return QUESTIONS.filter((q) => q.part === part);
}
