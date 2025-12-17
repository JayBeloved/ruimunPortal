
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/logo";
import { Loader2 } from "lucide-react";
import { prefillRegistrationData } from "@/ai/flows/prefill-registration-data";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required." }),
  email: z.string().email(),
  phoneNumber: z.string().min(10, { message: "A valid phone number is required." }),
  university: z.string().min(3, { message: "University name is required." }),
  country: z.string().min(2, { message: "Country is required." }),
  major: z.string().min(2, { message: "Major is required." }),
  munExperience: z.enum(["Beginner", "Intermediate", "Advanced"]),
  committeePreference1: z.string().optional(),
  committeePreference2: z.string().optional(),
  committeePreference3: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

// Mock data, in a real app this would come from a database
const countries = ["Nigeria", "Ghana", "United States", "United Kingdom", "Canada"];
const committees = ["UNSC", "DISEC", "SOCHUM", "ECOFIN", "SPECPOL"];

function RegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isPrefilling, setIsPrefilling] = React.useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: searchParams.get("email") || "",
      fullName: "",
      phoneNumber: "",
      university: "",
      country: "",
      major: "",
      munExperience: "Beginner",
      committeePreference1: "",
      committeePreference2: "",
      committeePreference3: "",
    },
  });

  useEffect(() => {
    const email = searchParams.get("email");
    // This is a mock check for a returning delegate.
    // In a real app, you would query Firestore.
    if (email && email.includes("returning")) {
      const prefill = async () => {
        setIsPrefilling(true);
        toast({ title: "Welcome back!", description: "We've found your previous data. Pre-filling form..." });

        try {
          // Mocking previous data and profile info for the GenAI flow
          const previousData = JSON.stringify({
            fullName: "Returning Delegate",
            university: "Redeemer's University",
            country: "Nigeria",
            major: "International Relations",
            munExperience: "Intermediate",
          });
          const profileInformation = `The delegate with email ${email} has participated in two previous RUIMUN conferences.`;
          
          const result = await prefillRegistrationData({ previousData, profileInformation });
          const prefilled = JSON.parse(result.prefilledData);
          
          form.reset({
            ...form.getValues(),
            ...prefilled,
            email, // ensure email is not overwritten
          });

        } catch (error) {
          console.error("AI prefill error:", error);
          toast({ variant: "destructive", title: "Error", description: "Could not pre-fill your data." });
          // Fallback to manual fill
          form.setValue("fullName", "Returning Delegate");
          form.setValue("university", "Redeemer's University");
          form.setValue("country", "Nigeria");
          form.setValue("major", "International Relations");
          form.setValue("munExperience", "Intermediate");
        } finally {
          setIsPrefilling(false);
        }
      };
      prefill();
    }
  }, [searchParams, form, toast]);

  function onSubmit(values: FormData) {
    console.log(values);
    toast({
      title: "Registration Submitted!",
      description: "Your registration has been received. You will be redirected to the login page.",
    });
    // In a real app, this would trigger account creation and OTP flow.
    // For this prototype, we redirect to login.
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Delegate Registration</CardTitle>
            <CardDescription>
              {isPrefilling ? "Please wait while we pre-fill your information..." : "Complete the form below to register for RUIMUN '26."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPrefilling && <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-6 ${isPrefilling ? 'hidden' : ''}`}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="delegate@example.com" readOnly {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                    <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+1234567890" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="university" render={({ field }) => (
                    <FormItem><FormLabel>University</FormLabel><FormControl><Input placeholder="Your University" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField control={form.control} name="country" render={({ field }) => (
                        <FormItem><FormLabel>Country of Residence</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a country" /></SelectTrigger></FormControl>
                        <SelectContent>{countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="major" render={({ field }) => (
                        <FormItem><FormLabel>Major/Field of Study</FormLabel><FormControl><Input placeholder="e.g., Computer Science" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="munExperience" render={({ field }) => (
                    <FormItem><FormLabel>MUN Experience</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select your experience level" /></SelectTrigger></FormControl>
                    <SelectContent>{["Beginner", "Intermediate", "Advanced"].map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                    </Select><FormMessage /></FormItem>
                )} />
                <div>
                  <h3 className="mb-4 text-lg font-medium text-foreground">Committee Preferences</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <FormField control={form.control} name="committeePreference1" render={({ field }) => (
                        <FormItem><FormLabel>1st Preference</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select committee" /></SelectTrigger></FormControl>
                        <SelectContent>{committees.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="committeePreference2" render={({ field }) => (
                        <FormItem><FormLabel>2nd Preference</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select committee" /></SelectTrigger></FormControl>
                        <SelectContent>{committees.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="committeePreference3" render={({ field }) => (
                        <FormItem><FormLabel>3rd Preference</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select committee" /></SelectTrigger></FormControl>
                        <SelectContent>{committees.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select><FormMessage /></FormItem>
                    )} />
                  </div>
                </div>
                <Button type="submit" className="w-full" variant="accent" size="lg" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Submit Registration
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin"/></div>}>
      <RegistrationForm />
    </Suspense>
  )
}
