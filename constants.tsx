
import React from 'react';
import { TherapyModality } from './types';

export const MODALITIES: { label: string; value: TherapyModality; icon: string; color: string }[] = [
  { label: 'CBT (Cognitive Behavioral)', value: 'CBT', icon: 'fa-brain', color: 'bg-blue-100 text-blue-700' },
  { label: 'DBT (Dialectical Behavior)', value: 'DBT', icon: 'fa-balance-scale', color: 'bg-emerald-100 text-emerald-700' },
  { label: 'ACT (Acceptance & Commitment)', value: 'ACT', icon: 'fa-leaf', color: 'bg-indigo-100 text-indigo-700' },
  { label: 'SFT (Solution Focused)', value: 'SFT', icon: 'fa-lightbulb', color: 'bg-amber-100 text-amber-700' },
  { label: 'Psychodynamic', value: 'Psychodynamic', icon: 'fa-ghost', color: 'bg-purple-100 text-purple-700' },
  { label: 'Humanistic', value: 'Humanistic', icon: 'fa-heart', color: 'bg-rose-100 text-rose-700' },
  { label: 'Custom Protocol', value: 'Custom', icon: 'fa-wand-magic-sparkles', color: 'bg-slate-100 text-slate-700' },
];

export const SYSTEM_PROMPT = `
You are a master psychotherapist specializing in evidence-based modalities. 
Your task is to generate a highly professional, clinical-grade therapy worksheet.
The worksheet should be structured in a way that helps clients explore their thoughts, feelings, and behaviors based on the specific modality requested.

Output must be strictly JSON format following this schema:
{
  "title": "string",
  "modality": "string",
  "focus": "string",
  "introduction": "string",
  "sections": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "fields": [
        {
          "id": "string",
          "label": "string",
          "type": "text | textarea | checkbox | scale | checklist",
          "placeholder": "string",
          "options": ["string"] // only for checklist type
        }
      ]
    }
  ],
  "footer": "string"
}

Ensure the terminology is modality-specific (e.g., CBT uses "Cognitive Distortions", DBT uses "Wise Mind", ACT uses "Defusion").
`;
