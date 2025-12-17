'use server';

/**
 * @fileOverview A flow to suggest conference themes based on current global events and UN priorities.
 *
 * - suggestConferenceThemes - A function that suggests conference themes.
 * - SuggestConferenceThemesInput - The input type for the suggestConferenceThemes function.
 * - SuggestConferenceThemesOutput - The return type for the suggestConferenceThemes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestConferenceThemesInputSchema = z.object({
  context: z
    .string()
    .describe(
      'Information about current global events and UN priorities to inform the theme suggestions.'
    ),
});
export type SuggestConferenceThemesInput = z.infer<typeof SuggestConferenceThemesInputSchema>;

const SuggestConferenceThemesOutputSchema = z.object({
  themes: z
    .array(z.string())
    .describe('An array of suggested conference themes.'),
});
export type SuggestConferenceThemesOutput = z.infer<typeof SuggestConferenceThemesOutputSchema>;

export async function suggestConferenceThemes(input: SuggestConferenceThemesInput): Promise<SuggestConferenceThemesOutput> {
  return suggestConferenceThemesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestConferenceThemesPrompt',
  input: {schema: SuggestConferenceThemesInputSchema},
  output: {schema: SuggestConferenceThemesOutputSchema},
  prompt: `You are an AI assistant helping to brainstorm conference themes for an International Model United Nations conference.

  Suggest 3 potential conference themes based on the following context of current global events and UN priorities:

  Context: {{{context}}}

  The themes should be relevant, impactful, and suitable for a Model UN conference.

  Return the themes as a JSON array of strings.
  `,
});

const suggestConferenceThemesFlow = ai.defineFlow(
  {
    name: 'suggestConferenceThemesFlow',
    inputSchema: SuggestConferenceThemesInputSchema,
    outputSchema: SuggestConferenceThemesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
