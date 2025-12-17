'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating FAQ entries.
 *
 * - suggestFaqEntries - A function that generates FAQ entries.
 * - SuggestFaqEntriesInput - The input type for the suggestFaqEntries function.
 * - SuggestFaqEntriesOutput - The return type for the suggestFaqEntries function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFaqEntriesInputSchema = z.object({
  topic: z.string().describe('The topic for which FAQ entries should be generated.'),
  context: z
    .string()
    .optional()
    .describe(
      'Additional context or information to guide the generation of FAQ entries.'
    ),
});
export type SuggestFaqEntriesInput = z.infer<typeof SuggestFaqEntriesInputSchema>;

const SuggestFaqEntriesOutputSchema = z.object({
  faqEntries: z
    .array(
      z.object({
        question: z.string().describe('A frequently asked question.'),
        answer: z.string().describe('The answer to the frequently asked question.'),
      })
    )
    .describe('An array of FAQ entries, each containing a question and its answer.'),
});
export type SuggestFaqEntriesOutput = z.infer<typeof SuggestFaqEntriesOutputSchema>;

export async function suggestFaqEntries(input: SuggestFaqEntriesInput): Promise<SuggestFaqEntriesOutput> {
  return suggestFaqEntriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFaqEntriesPrompt',
  input: {schema: SuggestFaqEntriesInputSchema},
  output: {schema: SuggestFaqEntriesOutputSchema},
  prompt: `You are an AI assistant helping to generate Frequently Asked Questions (FAQ) and answers for a Model United Nations conference website.

  Based on the following topic and context, suggest 3 potential FAQ entries, each including a question and a concise, helpful answer:

  Topic: {{{topic}}}
  Context: {{{context}}}

  Return the FAQ entries as a JSON array of objects, where each object has a "question" and an "answer" field.
  `,
});

const suggestFaqEntriesFlow = ai.defineFlow(
  {
    name: 'suggestFaqEntriesFlow',
    inputSchema: SuggestFaqEntriesInputSchema,
    outputSchema: SuggestFaqEntriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
