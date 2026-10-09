---
layout: post
title: "NeuroSentry: Real-time Stroke-Risk Triage (Hack Western 12)"
---
Hackathon project built at Hack Western 12. NeuroSentry turns a phone into a stroke triage sensor: it tracks facial asymmetry and vital signs in real time and flags high-risk patients so clinicians can intervene sooner.

A SwiftUI iOS client streams facial-mesh landmarks and vitals (Presage SmartSpectra SDK) to a FastAPI backend, where a Gemini pipeline grounded in clinical guidelines returns structured JSON risk scores to a React + TypeScript dashboard.

**Programming Languages and Technologies:** Python, FastAPI, Gemini API, SwiftUI, React, TypeScript

**Member(s):** Team project

**[project page on Devpost (Available)](https://devpost.com/software/neutro-sentry)**
