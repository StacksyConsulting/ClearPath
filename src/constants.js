// ─── STAKEHOLDER TYPES ────────────────────────────────────────────────────────

export const STAKEHOLDER_TYPES = {
  worker:   { label: 'Injured Worker',        color: '#0EA5E9', description: 'Empathetic, plain language'  },
  employer: { label: 'Employer / HR',          color: '#10B981', description: 'Practical, outcomes-focused' },
  medical:  { label: 'Medical Provider',       color: '#8B5CF6', description: 'Clinical, precise'           },
  legal:    { label: 'Legal Representative',   color: '#F59E0B', description: 'Neutral, factual'            },
}

// ─── C.A.R.E. PILLARS ─────────────────────────────────────────────────────────

export const CARE_PILLARS = {
  C: {
    label: 'Capacity',
    description: 'Medical status & functional ability',
    color: '#0EA5E9',
    bg: '#EFF6FF',
    keywords: ['diagnosis','doctor','treatment','physio','surgery','specialist','functional',
               'duties','work','recovery','pain','restriction','certificate','medical'],
  },
  A: {
    label: 'Alignment',
    description: 'Employer support & accommodations',
    color: '#10B981',
    bg: '#ECFDF5',
    keywords: ['employer','manager','workplace','modified','duties','hr','accommodation',
               'return','role','team','supervisor','support','job'],
  },
  R: {
    label: 'Recovery Barriers',
    description: 'Psychosocial & compliance obstacles',
    color: '#F59E0B',
    bg: '#FFFBEB',
    keywords: ['stress','anxiety','worried','afraid','financial','money','legal','lawyer',
               'fear','motivation','family','personal','relationship','struggle'],
  },
  E: {
    label: 'Engagement',
    description: 'Cooperation level & red flags',
    color: '#EF4444',
    bg: '#FEF2F2',
    keywords: ['appointment','attend','cooperative','agree','plan','engaged','contact',
               'willing','committed','next steps','review'],
  },
}

// ─── SUGGESTED QUESTIONS ──────────────────────────────────────────────────────
// Each question has a `signals` array — keywords that indicate this topic has
// already been discussed in the transcript. If any signal appears in the full
// transcript text, the question is marked as covered and sorted to the bottom.

export const QUESTIONS = {
  C: {
    worker: [
      {
        text: "Can you walk me through what your treating doctor has told you about your recovery so far?",
        signals: ['treating doctor', 'dr ', 'doctor told', 'doctor said', 'doctor has'],
      },
      {
        text: "Are there any activities you can currently do comfortably, even if limited?",
        signals: ['activities', 'comfortably', 'what i can do', 'able to do', 'manage to do'],
      },
      {
        text: "Has your doctor given you any indication of a timeframe for returning to work?",
        signals: ['timeframe', 'six weeks', 'few weeks', 'when i can return', 'return date', 'weeks if'],
      },
      {
        text: "What treatment are you currently receiving, and how is it going?",
        signals: ['physio', 'physiotherapy', 'treatment', 'anti-inflam', 'medication', 'surgery'],
      },
    ],
    employer: [
      {
        text: "What modified or alternative duties could you realistically offer in the short term?",
        signals: ['modified duties', 'alternative duties', 'light duties', 'admin', 'packing', 'available role'],
      },
      {
        text: "Are there any safety considerations around a graded return for this worker?",
        signals: ['safety', 'risk', 'hazard', 'graded return', 'safe to return'],
      },
      {
        text: "Has the treating doctor provided any guidance on suitable duties?",
        signals: ['doctor said', 'medical clearance', 'restrictions', 'kilograms', 'sedentary', 'light duties'],
      },
    ],
    medical: [
      {
        text: "What is the current functional capacity for this worker?",
        signals: ['functional capacity', 'capacity', 'lifting', 'kilograms', 'sedentary', 'light duties', 'restricted'],
      },
      {
        text: "Are there any barriers to a graded return-to-work from a medical perspective?",
        signals: ['barrier', 'graded return', 'medical perspective', 'from my perspective'],
      },
      {
        text: "What milestones need to be achieved before we consider modified duties?",
        signals: ['milestones', 'four weeks', 'weeks of physio', 'before signing off', 'before we consider'],
      },
      {
        text: "What is the expected treatment trajectory over the next four to six weeks?",
        signals: ['trajectory', 'treatment plan', 'next few weeks', 'strengthening', 'pain management'],
      },
    ],
    legal: [
      {
        text: "Can you confirm the worker's current medical status as documented?",
        signals: ['certified', 'medical status', 'unfit', 'suitable for alternative', 'documented'],
      },
      {
        text: "What is the treating practitioner's formal position on capacity for work?",
        signals: ['formal position', 'practitioner', 'capacity for work', 'pre-injury role'],
      },
    ],
  },
  A: {
    worker: [
      {
        text: "Have you had any contact with your employer since the injury?",
        signals: ['contact with', 'heard from', 'spoke to', 'my manager', 'employer since', 'message from'],
      },
      {
        text: "How do you feel your manager has responded to the situation?",
        signals: ['manager', 'supervisor', 'how they responded', 'how he responded', 'how she responded'],
      },
      {
        text: "Do you feel the workplace would be supportive of a gradual return?",
        signals: ['workplace', 'supportive', 'gradual return', 'going back', 'environment', 'warehouse'],
      },
    ],
    employer: [
      {
        text: "How has the team responded to the worker's absence?",
        signals: ['team', 'colleagues', 'covering', 'shifts', 'absence', 'responded'],
      },
      {
        text: "Is HR aware of the situation and the return-to-work obligations?",
        signals: ['hr', 'human resources', 'obligations', 'aware', 'notified'],
      },
      {
        text: "What is the earliest you could have modified duties available?",
        signals: ['earliest', 'available', 'within a week', 'ready', 'when could'],
      },
      {
        text: "Are there any industrial relations concerns I should be aware of?",
        signals: ['industrial relations', 'union', 'dispute', 'grievance', 'ir concern'],
      },
    ],
    medical: [
      {
        text: "From your perspective, is the employer likely to be supportive of a graded return?",
        signals: ['employer', 'supportive', 'workplace', 'graded return'],
      },
      {
        text: "Have you had any direct communication with the employer about suitable duties?",
        signals: ['communication with employer', 'spoken to employer', 'contacted employer', 'suitable duties'],
      },
    ],
    legal: [
      {
        text: "Has the employer been formally notified of their suitable duties obligations?",
        signals: ['formally notified', 'obligations', 'suitable duties', 'employer notified'],
      },
    ],
  },
  R: {
    worker: [
      {
        text: "Is there anything outside the injury itself that has been making things harder?",
        signals: ['outside the injury', 'making things harder', 'other than the injury', 'beyond the injury', 'financial', 'mortgage', 'stress'],
      },
      {
        text: "How are you feeling about the idea of eventually returning to work?",
        signals: ['feeling about', 'going back', 'returning to work', 'idea of returning', 'anxious', 'worried about'],
      },
      {
        text: "Have there been any financial pressures as a result of the injury?",
        signals: ['financial', 'money', 'mortgage', 'payments', 'income', 'bills', 'tight'],
      },
      {
        text: "How are you finding the claims process so far?",
        signals: ['claims process', 'paperwork', 'insurer', 'overwhelming', 'finding the process'],
      },
      {
        text: "Is there anything about the workplace environment that concerns you?",
        signals: ['workplace environment', 'environment', 'warehouse', 'same situation', 're-injur', 'concerns about'],
      },
    ],
    employer: [
      {
        text: "Are you aware of any personal or financial stressors the worker may be dealing with?",
        signals: ['personal', 'stressor', 'financial difficulty', 'aware of any'],
      },
      {
        text: "Has there been any tension between the worker and colleagues or management?",
        signals: ['tension', 'conflict', 'dispute', 'issue with', 'relationship with'],
      },
    ],
    medical: [
      {
        text: "Are there any psychosocial factors that may be impacting recovery?",
        signals: ['psychosocial', 'psychological', 'flat', 'mood', 'mental health', 'psych'],
      },
      {
        text: "Has the worker expressed any concerns about returning to the workplace?",
        signals: ['expressed concern', 'worried about returning', 'concerns about workplace', 'anxious about'],
      },
    ],
    legal: [
      {
        text: "Are there any disputes that may be affecting the worker's engagement with treatment?",
        signals: ['dispute', 'affecting engagement', 'treatment engagement', 'compliance'],
      },
    ],
  },
  E: {
    worker: [
      {
        text: "Are you managing to attend all your appointments consistently?",
        signals: ['appointment', 'attending', 'missed', 'consistently', 'showing up', 'haven\'t missed'],
      },
      {
        text: "Would you be open to discussing a gradual return once your doctor gives the go-ahead?",
        signals: ['open to', 'gradual return', 'go-ahead', 'willing to', 'ready to return'],
      },
      {
        text: "What would need to happen for you to feel ready to take the next step?",
        signals: ['feel ready', 'next step', 'what would', 'clear plan', 'need to happen'],
      },
    ],
    employer: [
      {
        text: "Are you committed to implementing a suitable duties plan once one is drafted?",
        signals: ['committed', 'implementing', 'suitable duties plan', 'once drafted'],
      },
      {
        text: "Is there a contact person we should liaise with directly on the return-to-work plan?",
        signals: ['contact person', 'liaise with', 'point of contact', 'who should we'],
      },
    ],
    medical: [
      {
        text: "Is the worker engaging well with treatment and following your recommendations?",
        signals: ['engaging well', 'following recommendations', 'compliance', 'engaging with treatment'],
      },
      {
        text: "Are there any compliance concerns I should be aware of?",
        signals: ['compliance', 'not following', 'non-compliance', 'concern about engagement'],
      },
    ],
    legal: [
      {
        text: "Is your client willing to participate in the return-to-work process at this stage?",
        signals: ['willing to participate', 'participate in', 'rtw process', 'at this stage'],
      },
    ],
  },
}

// ─── WORKER RESPONSE MAP (demo only) ─────────────────────────────────────────

export const WORKER_RESPONSES = {
  'treating doctor':            "Dr Patel has been pretty good. She said the physio is helping but I still have a lot of pain in the mornings.",
  'timeframe for returning':    "She mentioned maybe six weeks if things keep improving. No certificate for any duties yet though.",
  'activities you can':         "I can walk around the block and do some light things at home, but bending and lifting are still really hard.",
  'treatment are you':          "Physio twice a week. I'm also on some anti-inflammatories. No surgery planned, which is a relief.",
  'contact with your employer': "Not really. My manager sent a message early on but I haven't replied. I didn't know what to say.",
  'manager has responded':      "Honestly I haven't really spoken to him. I felt a bit embarrassed about the whole thing.",
  'workplace would be':         "I'm not sure. The warehouse environment is pretty physical. I'm worried about being expected to do the same job.",
  'outside the injury':         "The financial side is pretty stressful. I've got a mortgage and payments are getting tight.",
  'returning to work':          "Honestly a bit anxious. Being in that warehouse again — I'm worried about re-injuring myself.",
  'financial pressures':        "Yeah, the mortgage is the main thing. And my partner had to reduce their hours too to help out at home.",
  'claims process':             "It's a bit overwhelming. There's a lot of paperwork and I'm not always sure what I'm supposed to do next.",
  'workplace environment':      "I just worry about being put in the same situation that caused the injury. Nothing has changed there as far as I know.",
  'attending all your':         "I haven't missed one. I know it's important to show up.",
  'open to discussing':         "Yes, as long as the doctor says it's okay. I don't want to rush it and make things worse.",
  'feel ready to take':         "I think if I had a clear plan and knew what the duties would look like, that would help a lot.",
}

// ─── RED FLAG PATTERNS ────────────────────────────────────────────────────────

export const RED_FLAGS = [
  { pattern: /lawyer|legal|solicitor|litigation|compensation claim/i,
    message: 'Legal representation detected — document carefully and avoid assumptions.' },
  { pattern: /not going back|refuse|won't return|don't want to/i,
    message: 'Worker expressing resistance to return — explore barriers.' },
  { pattern: /haven't heard|no contact|not responding|avoiding/i,
    message: 'Engagement concern — follow up on communication gap.' },
  { pattern: /surgery|operation|specialist|pending/i,
    message: 'Medical review pending — confirm timeline before progressing RTW plan.' },
  { pattern: /suicid|harm|crisis|mental health emergency/i,
    message: 'Wellbeing concern raised — follow escalation protocol immediately.' },
]

// ─── DEMO SCRIPT ──────────────────────────────────────────────────────────────

export const INITIAL_LINES = {
  worker: [
    { speaker: 'CM',     text: "Hi, this is Alex calling from ReturnPath Insurance. Am I speaking with Jamie?" },
    { speaker: 'Worker', text: "Yeah, hi Alex. Yes, it's Jamie." },
  ],
  employer: [
    { speaker: 'CM',       text: "Hi, thanks for making time today. I'm calling about Jamie's return-to-work plan." },
    { speaker: 'Employer', text: "Of course. We want to support the process as much as we can." },
  ],
  medical: [
    { speaker: 'CM',      text: "Good morning, thanks for speaking with me. I'm the case manager for Jamie's workers' comp claim." },
    { speaker: 'Medical', text: "Yes, I've been treating Jamie for about three weeks now." },
  ],
  legal: [
    { speaker: 'CM',    text: "Good afternoon. I understand you're representing Jamie in relation to their claim." },
    { speaker: 'Legal', text: "That's correct. My client has asked me to be present for all case management communications going forward." },
  ],
}

export const DEMO_PAIRS = {
  worker: [
    {
      cm:       "Thanks for picking up Jamie. How are you feeling today?",
      response: "Oh, you know. Still sore. The back is giving me a lot of trouble in the mornings.",
    },
    {
      cm:       "I'm sorry to hear that. Have you been able to see your treating doctor recently?",
      response: "Yeah, I saw Dr Patel last Thursday. She said the physio is helping but slowly. She wants me to keep going twice a week.",
    },
    {
      cm:       "That's good. Did she give you any idea on a timeframe for returning to work?",
      response: "She said maybe six weeks if things keep improving. But she hasn't given me a certificate yet for any duties.",
    },
    {
      cm:       "Understood. How are you feeling about the idea of eventually going back?",
      response: "Honestly, a bit anxious. I'm worried about being in that warehouse environment again. It's a physical job.",
    },
    {
      cm:       "That makes sense. Is there anything outside the injury itself that's been making things harder for you?",
      response: "Yeah, the financial side is stressful. I've got a mortgage. The payments have been tight.",
    },
    {
      cm:       "I hear you. Have you had much contact with your employer since the injury?",
      response: "Not directly. My manager sent a message early on but I haven't replied. I didn't know what to say.",
    },
  ],
  employer: [
    {
      cm:       "Can you tell me a bit about the roles you have available at the moment?",
      response: "We've got some admin and light packing work that wouldn't involve any heavy lifting.",
    },
    {
      cm:       "That's helpful. Is HR across the return-to-work obligations on this claim?",
      response: "HR is aware and supportive. We just need to know what restrictions we're working with.",
    },
    {
      cm:       "What's the earliest you could have a modified duties position ready?",
      response: "We could have something available within a week once we get the medical clearance.",
    },
    {
      cm:       "Good. How has the team responded to the worker's absence?",
      response: "The team is fine. We've been covering the shifts. There's no pressure from our side.",
    },
  ],
  medical: [
    {
      cm:       "Can you give me an overview of their current functional capacity?",
      response: "Currently restricted from any heavy lifting over five kilograms. Sedentary to light duties only at this stage.",
    },
    {
      cm:       "Is there any surgical intervention being considered?",
      response: "No surgical intervention planned. The main goal is pain management and gradual strengthening.",
    },
    {
      cm:       "What milestones would you want to see before signing off on a graded return?",
      response: "I'd want to see four more weeks of consistent physio before signing off on anything beyond light duties.",
    },
    {
      cm:       "Are there any psychosocial factors that might be affecting recovery?",
      response: "Jamie seems a bit flat psychosocially. Worth monitoring — I haven't referred to psych yet but may consider it.",
    },
  ],
  legal: [
    {
      cm:       "Can you confirm the current medical position as documented by the treating practitioner?",
      response: "The treating doctor has certified Jamie as unfit for the pre-injury role but potentially suitable for alternative duties.",
    },
    {
      cm:       "Is your client willing to participate in the return-to-work process at this stage?",
      response: "My client is willing to participate provided suitable duties are genuinely available.",
    },
    {
      cm:       "We'll be putting together a suitable duties plan shortly. How would you like us to communicate that?",
      response: "We'll need all proposed suitable duties plans provided in writing before my client commits to anything.",
    },
  ],
}
