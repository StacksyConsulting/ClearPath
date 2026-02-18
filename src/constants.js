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

export const QUESTIONS = {
  C: {
    worker: [
      "Can you walk me through what your treating doctor has told you about your recovery so far?",
      "Are there any activities you can currently do comfortably, even if limited?",
      "Has your doctor given you any indication of a timeframe for returning to work?",
      "What treatment are you currently receiving, and how is it going?",
    ],
    employer: [
      "What modified or alternative duties could you realistically offer in the short term?",
      "Are there any safety considerations around a graded return for this worker?",
      "Has the treating doctor provided any guidance on suitable duties?",
    ],
    medical: [
      "What is the current functional capacity for this worker?",
      "Are there any barriers to a graded return-to-work from a medical perspective?",
      "What milestones need to be achieved before we consider modified duties?",
      "What is the expected treatment trajectory over the next four to six weeks?",
    ],
    legal: [
      "Can you confirm the worker's current medical status as documented?",
      "What is the treating practitioner's formal position on capacity for work?",
    ],
  },
  A: {
    worker: [
      "Have you had any contact with your employer since the injury?",
      "How do you feel your manager has responded to the situation?",
      "Do you feel the workplace would be supportive of a gradual return?",
    ],
    employer: [
      "How has the team responded to the worker's absence?",
      "Is HR aware of the situation and the return-to-work obligations?",
      "What is the earliest you could have modified duties available?",
      "Are there any industrial relations concerns I should be aware of?",
    ],
    medical: [
      "From your perspective, is the employer likely to be supportive of a graded return?",
      "Have you had any direct communication with the employer about suitable duties?",
    ],
    legal: [
      "Has the employer been formally notified of their suitable duties obligations?",
    ],
  },
  R: {
    worker: [
      "Is there anything outside the injury itself that has been making things harder?",
      "How are you feeling about the idea of eventually returning to work?",
      "Have there been any financial pressures as a result of the injury?",
      "How are you finding the claims process so far?",
      "Is there anything about the workplace environment that concerns you?",
    ],
    employer: [
      "Are you aware of any personal or financial stressors the worker may be dealing with?",
      "Has there been any tension between the worker and colleagues or management?",
    ],
    medical: [
      "Are there any psychosocial factors that may be impacting recovery?",
      "Has the worker expressed any concerns about returning to the workplace?",
    ],
    legal: [
      "Are there any disputes that may be affecting the worker's engagement with treatment?",
    ],
  },
  E: {
    worker: [
      "Are you managing to attend all your appointments consistently?",
      "Would you be open to discussing a gradual return once your doctor gives the go-ahead?",
      "What would need to happen for you to feel ready to take the next step?",
    ],
    employer: [
      "Are you committed to implementing a suitable duties plan once one is drafted?",
      "Is there a contact person we should liaise with directly on the return-to-work plan?",
    ],
    medical: [
      "Is the worker engaging well with treatment and following your recommendations?",
      "Are there any compliance concerns I should be aware of?",
    ],
    legal: [
      "Is your client willing to participate in the return-to-work process at this stage?",
    ],
  },
}

// ─── WORKER RESPONSE MAP (demo only) ─────────────────────────────────────────
// Keys are substrings matched against the CM question (lowercase).

export const WORKER_RESPONSES = {
  'treating doctor':           "Dr Patel has been pretty good. She said the physio is helping but I still have a lot of pain in the mornings.",
  'timeframe for returning':   "She mentioned maybe six weeks if things keep improving. No certificate for any duties yet though.",
  'activities you can':        "I can walk around the block and do some light things at home, but bending and lifting are still really hard.",
  'treatment are you':         "Physio twice a week. I'm also on some anti-inflammatories. No surgery planned, which is a relief.",
  'contact with your employer':"Not really. My manager sent a message early on but I haven't replied. I didn't know what to say.",
  'manager has responded':     "Honestly I haven't really spoken to him. I felt a bit embarrassed about the whole thing.",
  'workplace would be':        "I'm not sure. The warehouse environment is pretty physical. I'm worried about being expected to do the same job.",
  'outside the injury':        "The financial side is pretty stressful. I've got a mortgage and payments are getting tight.",
  'returning to work':         "Honestly a bit anxious. Being in that warehouse again — I'm worried about re-injuring myself.",
  'financial pressures':       "Yeah, the mortgage is the main thing. And my partner had to reduce their hours too to help out at home.",
  'claims process':            "It's a bit overwhelming. There's a lot of paperwork and I'm not always sure what I'm supposed to do next.",
  'workplace environment':     "I just worry about being put in the same situation that caused the injury. Nothing has changed there as far as I know.",
  'attending all your':        "I haven't missed one. I know it's important to show up.",
  'open to discussing':        "Yes, as long as the doctor says it's okay. I don't want to rush it and make things worse.",
  'feel ready to take':        "I think if I had a clear plan and knew what the duties would look like, that would help a lot.",
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
    { speaker: 'CM',     text: "Thanks for picking up Jamie. How are you feeling today?" },
    { speaker: 'Worker', text: "Oh, you know. Still sore. The back is giving me a lot of trouble in the mornings." },
    { speaker: 'CM',     text: "I'm sorry to hear that. Have you been able to see your treating doctor recently?" },
    { speaker: 'Worker', text: "Yeah, I saw Dr Patel last Thursday. She said the physio is helping but slowly. She wants me to keep going twice a week." },
  ],
  employer: [
    { speaker: 'CM',       text: "Hi, thanks for making time today. I'm calling about Jamie's return-to-work plan." },
    { speaker: 'Employer', text: "Of course. We want to support the process as much as we can." },
    { speaker: 'CM',       text: "That's great to hear. Can you tell me a bit about the roles you have available at the moment?" },
    { speaker: 'Employer', text: "We've got some admin and light packing work that wouldn't involve any heavy lifting." },
  ],
  medical: [
    { speaker: 'CM',      text: "Good morning, thanks for speaking with me. I'm the case manager for Jamie's workers' comp claim." },
    { speaker: 'Medical', text: "Yes, I've been treating Jamie for about three weeks now." },
    { speaker: 'CM',      text: "Can you give me an overview of their current functional capacity?" },
    { speaker: 'Medical', text: "Currently restricted from any heavy lifting over five kilograms. Sedentary to light duties only at this stage." },
  ],
  legal: [
    { speaker: 'CM',    text: "Good afternoon. I understand you're representing Jamie in relation to their claim." },
    { speaker: 'Legal', text: "That's correct. My client has asked me to be present for all case management communications going forward." },
    { speaker: 'CM',    text: "Understood. Can you confirm the current medical position as documented by the treating practitioner?" },
    { speaker: 'Legal', text: "The treating doctor has certified Jamie as unfit for the pre-injury role but potentially suitable for alternative duties." },
  ],
}

export const SCRIPT_RESPONSES = {
  worker: [
    { speaker: 'Worker', text: "She said maybe six weeks if things keep improving. But she hasn't given me a certificate yet for any duties." },
    { speaker: 'Worker', text: "Honestly, a bit anxious. I'm worried about being in that warehouse environment again. It's a physical job." },
    { speaker: 'Worker', text: "Yeah, the financial side is stressful. I've got a mortgage. The payments have been tight." },
    { speaker: 'Worker', text: "Not directly. My manager sent a message early on but I haven't replied. I didn't know what to say." },
    { speaker: 'Worker', text: "That would help a lot actually. Knowing there's a plan makes it feel less daunting." },
  ],
  employer: [
    { speaker: 'Employer', text: "HR is aware and supportive. We just need to know what restrictions we're working with." },
    { speaker: 'Employer', text: "We could have something available within a week once we get the medical clearance." },
    { speaker: 'Employer', text: "The team is fine. We've been covering the shifts. There's no pressure from our side." },
  ],
  medical: [
    { speaker: 'Medical', text: "No surgical intervention planned. The main goal is pain management and gradual strengthening." },
    { speaker: 'Medical', text: "I'd want to see four more weeks of consistent physio before signing off on anything beyond light duties." },
    { speaker: 'Medical', text: "Psychosocially Jamie seems a bit flat. Worth monitoring — I haven't referred to psych yet but may consider it." },
  ],
  legal: [
    { speaker: 'Legal', text: "My client is willing to participate in the RTW process provided suitable duties are genuinely available." },
    { speaker: 'Legal', text: "We'll need all proposed suitable duties plans provided in writing before my client commits to anything." },
  ],
}
