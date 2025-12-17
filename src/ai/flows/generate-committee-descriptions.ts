'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating committee descriptions.
 *
 * - generateCommitteeDescriptions - A function that generates committee descriptions.
 * - GenerateCommitteeDescriptionsInput - The input type for the generateCommitteeDescriptions function.
 * - GenerateCommitteeDescriptionsOutput - The return type for the generateCommitteeDescriptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCommitteeDescriptionsInputSchema = z.object({
  committeeName: z.string().describe('The name of the committee.'),
  topic: z.string().describe('The main topic of discussion for the committee.'),
  description: z.string().optional().describe('Existing description of the committee.'),
});
export type GenerateCommitteeDescriptionsInput = z.infer<typeof GenerateCommitteeDescriptionsInputSchema>;

const GenerateCommitteeDescriptionsOutputSchema = z.object({
  description: z.string().describe('A short, engaging description for the committee.'),
});
export type GenerateCommitteeDescriptionsOutput = z.infer<typeof GenerateCommitteeDescriptionsOutputSchema>;

export async function generateCommitteeDescriptions(input: GenerateCommitteeDescriptionsInput): Promise<GenerateCommitteeDescriptionsOutput> {
  return generateCommitteeDescriptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCommitteeDescriptionsPrompt',
  input: {schema: GenerateCommitteeDescriptionsInputSchema},
  output: {schema: GenerateCommitteeDescriptionsOutputSchema},
  prompt: `You are an expert in Model United Nations conferences. You will generate a short, engaging description for each committee.

  Here is the committee name: {{{committeeName}}}
  Here is the topic of discussion: {{{topic}}}
  Here is the existing description (if there is one): {{{description}}}

  Please generate a new description for the committee that will attract prospective delegates. The description should be no more than 100 words.
  `,
});

const generateCommitteeDescriptionsFlow = ai.defineFlow(
  {
    name: 'generateCommitteeDescriptionsFlow',
    inputSchema: GenerateCommitteeDescriptionsInputSchema,
    outputSchema: GenerateCommitteeDescriptionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
