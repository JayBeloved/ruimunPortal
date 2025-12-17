import { config } from 'dotenv';
config();

import '@/ai/flows/generate-committee-descriptions.ts';
import '@/ai/flows/suggest-conference-themes.ts';
import '@/ai/flows/suggest-faq-entries.ts';
import '@/ai/flows/prefill-registration-data.ts';