# ClearPath

Real-Time AI Assistant for Workers' Compensation Case Management.

Built on the C.A.R.E. framework (Capacity · Alignment · Recovery Barriers · Engagement).

## Local Development

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Vercel will auto-detect Vite — no configuration needed
4. Click Deploy

## Project Structure

```
src/
  App.jsx              # Top-level screen router
  constants.js         # All static data (pillars, questions, scripts)
  index.css            # Global styles and animations
  main.jsx             # React entry point
  hooks/
    useCARE.js         # CARE coverage analysis hook
  components/
    CAREPillarTile.jsx  # Individual C.A.R.E. progress tile
    ExitModal.jsx       # Exit confirmation with report prompt
    PostCallReport.jsx  # Post-call structured case summary
    QuestionCard.jsx    # Suggested question with inject button
    RedFlagBanner.jsx   # Escalation alert banner
    TranscriptLine.jsx  # Single transcript message
  screens/
    SetupScreen.jsx     # Stakeholder selection and call start
    CallScreen.jsx      # Active and ended call interface
```

## Disclaimer

ClearPath is a documentation support tool only. It does not provide medical, legal, or clinical advice.
All AI-generated outputs must be reviewed and confirmed by the case manager.
