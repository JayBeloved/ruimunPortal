'use server';

/**
 * @fileOverview This file defines a Genkit flow for prefilling registration data for returning delegates.
 *
 * - prefillRegistrationData - A function that prefills registration data.
 * - PrefillRegistrationDataInput - The input type for the prefillRegistrationData function.
 * - PrefillRegistrationDataOutput - The return type for the prefillRegistrationData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrefillRegistrationDataInputSchema = z.object({
  previousData: z
    .string()
    .describe('The previous registration data of the delegate.'),
  profileInformation: z
    .string()
    .describe('Additional profile information of the delegate.'),
});
export type PrefillRegistrationDataInput = z.infer<typeof PrefillRegistrationDataInputSchema>;

const PrefillRegistrationDataOutputSchema = z.object({
  prefilledData: z
    .string()
    .describe('The prefilled registration data for the delegate.'),
});
export type PrefillRegistrationDataOutput = z.infer<typeof PrefillRegistrationDataOutputSchema>;

export async function prefillRegistrationData(input: PrefillRegistrationDataInput): Promise<PrefillRegistrationDataOutput> {
  return prefillRegistrationDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prefillRegistrationDataPrompt',
  input: {schema: PrefillRegistrationDataInputSchema},
  output: {schema: PrefillRegistrationDataOutputSchema},
  prompt: `You are an AI assistant helping to prefill registration data for returning delegates to the Redeemer\'s University International Model United Nations (RUIMUN) conference.\n\n  Based on the delegate\'s previous registration data and profile information, generate prefilled registration data that the delegate can review and update.\n\n  Previous Registration Data: {{{previousData}}}\n  Profile Information: {{{profileInformation}}}\n\n  Return the prefilled registration data as a JSON string.
  `,
});

const prefillRegistrationDataFlow = ai.defineFlow(
  {
    name: 'prefillRegistrationDataFlow',
    inputSchema: PrefillRegistrationDataInputSchema,
    outputSchema: PrefillRegistrationDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
