'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase/provider';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Committee } from '@/lib/types';

// --- Helper Components ---
function FormLoading() {
    return (
        <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2"><Skeleton className="h-6 w-24" /><Skeleton className="h-10" /></div>
                <div className="grid gap-2"><Skeleton className="h-6 w-24" /><Skeleton className="h-10" /></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2"><Skeleton className="h-6 w-24" /><Skeleton className="h-10" /></div>
                <div className="grid gap-2"><Skeleton className="h-6 w-24" /><Skeleton className="h-10" /></div>
            </div>
             <div className="grid gap-2"><Skeleton className="h-6 w-24" /><Skeleton className="h-20" /></div>
            <Skeleton className="h-12 w-full" />
        </div>
    );
}

const initialPreferences = [
    { order: 1, committeeId: '', country: '' },
    { order: 2, committeeId: '', country: '' },
    { order: 3, committeeId: '', country: '' },
];

// --- Main Component ---
export function DelegateRegistrationForm() {
  const { user, loading: authLoading } = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    delegate_type: '',
    gender: '',
    mun_experience: '',
    affiliation: '',
    position: '',
    department: '',
    matric_num: '',
    city: '',
    state: '',
    country: 'Nigeria',
    zipcode: '',
    advert: '',
    tshirt_size: '',
    medical: '',
    diet: '',
    referral: '',
    preferences: initialPreferences,
  });
  
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }
    if (!user) {
        router.push('/');
        return;
    }

    async function fetchData() {
        if (!db) return;
        try {
            // Fetch committees
            const committeesSnapshot = await getDocs(collection(db, 'committees'));
            const committeesData = committeesSnapshot.docs.map(doc => doc.data() as Committee);
            setCommittees(committeesData);

            // Fetch existing registration
            const docRef = doc(db, "registrations", user.uid);
            const docSnap = await getDoc(docRef);

            let initialData = { email: user.email || '', name: user.displayName || '' };

            if (docSnap.exists()) {
                const existingData = docSnap.data();
                // Ensure preferences are a full array of 3, even if partially filled
                const existingPrefs = existingData.preferences || [];
                const mergedPreferences = initialPreferences.map(p => {
                    const found = existingPrefs.find((ep: any) => ep.order === p.order);
                    return found ? { ...p, ...found } : p;
                });
                initialData = { ...initialData, ...existingData, preferences: mergedPreferences };
            }
            
            setFormData(prev => ({...prev, ...initialData}));

        } catch (err) {
            console.warn("Could not fetch initial data, starting with a blank form.", err);
            toast({ variant: "destructive", title: "Error", description: "Could not load initial registration data." });
        } finally {
            setLoading(false);
        }
    }

    fetchData();
  }, [user, authLoading, db, router, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handlePreferenceChange = (index: number, field: 'committeeId' | 'country', value: string) => {
      setFormData(prev => {
          const newPreferences = [...prev.preferences];
          newPreferences[index] = { ...newPreferences[index], [field]: value };

          // When committee is changed, reset the country selection
          if (field === 'committeeId') {
              newPreferences[index].country = '';
          }

          return { ...prev, preferences: newPreferences };
      });
  };

  const getAvailableCountries = (committeeId: string) => {
    if (!committeeId) return [];
    const selectedCommittee = committees.find(c => c.id === committeeId);
    return selectedCommittee ? selectedCommittee.countries : [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
        setError("You must be logged in to register.");
        return;
    }

    try {
        const idToken = await user.getIdToken();
        // TODO: The user mentioned updating this to /api/register in Part 3.3. I will do this in the next steps.
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "An unknown error occurred.");
        }
        
        toast({
            title: "Registration Submitted!",
            description: "Your registration has been submitted successfully.",
        });

        router.push("/dashboard/delegate"); // Redirect to the main dashboard page after success

    } catch (error: any) {
        setError(error.message);
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: error.message,
        });
    }
  };

  if (loading || authLoading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Delegate Registration Form</CardTitle>
                <CardDescription>Please fill out the form below to register for the conference.</CardDescription>
            </CardHeader>
            <CardContent><FormLoading /></CardContent>
        </Card>
    );
  }

  const selectedCommitteeIds = formData.preferences.map(p => p.committeeId).filter(Boolean);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delegate Registration Form</CardTitle>
        <CardDescription>Please fill out the form below to register for the conference.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-8">

          {/* Personal & Additional Info Sections (minimized for brevity - no changes needed here) */}
          <Card>
            <CardHeader><CardTitle>A. Personal Information</CardTitle></CardHeader>
            <CardContent className="grid gap-6">
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={handleChange} required disabled />
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select onValueChange={(value) => handleSelectChange('gender', value)} value={formData.gender} required>
                            <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                            <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="delegate_type">Delegate Type</Label>
                        <Select onValueChange={(value) => handleSelectChange('delegate_type', value)} value={formData.delegate_type} required>
                            <SelectTrigger><SelectValue placeholder="Select Delegate Type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="redeemer">Redeemer's University (₦80,000)</SelectItem>
                                <SelectItem value="nigerian">Nigerian Delegate (₦100,000)</SelectItem>
                                <SelectItem value="international">International Delegate ($150)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>B. Additional Information</CardTitle></CardHeader>
             <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                    <Label htmlFor="affiliation">Institution/University Name</Label>
                    <Input id="affiliation" value={formData.affiliation} onChange={handleChange} required={formData.delegate_type === 'nigerian' || formData.delegate_type === 'international'} />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="position">Position (e.g., Student, Analyst)</Label>
                    <Input id="position" value={formData.position} onChange={handleChange} required={formData.delegate_type === 'nigerian' || formData.delegate_type === 'international'} />
                    </div>
                </div>
                
                {formData.delegate_type === 'redeemer' && (
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="department">Department</Label>
                            <Input id="department" value={formData.department} onChange={handleChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="matric_num">Matriculation Number</Label>
                            <Input id="matric_num" value={formData.matric_num} onChange={handleChange} required />
                        </div>
                    </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={formData.city} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input id="state" value={formData.state} onChange={handleChange} />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" value={formData.country} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="zipcode">Zip/Postal Code</Label>
                    <Input id="zipcode" value={formData.zipcode} onChange={handleChange} />
                    </div>
                </div>
            </CardContent>
          </Card>

          {/* Section C: Committee Preferences (REFACTORED) */}
          <Card>
            <CardHeader>
                <CardTitle>C. Committee Preferences</CardTitle>
                <CardDescription>Select your preferred committees and countries. A country dropdown will activate once you select a committee.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                {formData.preferences.map((preference, index) => {
                    const availableCountries = getAvailableCountries(preference.committeeId);
                    const filteredCommittees = committees.filter(c => c.id === preference.committeeId || !selectedCommitteeIds.includes(c.id));

                    return (
                        <div key={preference.order} className="p-4 border rounded-md">
                            <h4 className="font-medium mb-4">{preference.order}{preference.order === 1 ? 'st' : preference.order === 2 ? 'nd' : 'rd'} Choice</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor={`committee_${index}`}>Committee</Label>
                                    <Select 
                                        onValueChange={(value) => handlePreferenceChange(index, 'committeeId', value)}
                                        value={preference.committeeId}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Select Committee" /></SelectTrigger>
                                        <SelectContent>
                                            {filteredCommittees.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor={`country_${index}`}>Country</Label>
                                    <Select 
                                        onValueChange={(value) => handlePreferenceChange(index, 'country', value)}
                                        value={preference.country}
                                        disabled={!preference.committeeId}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
                                        <SelectContent>
                                            {availableCountries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
          </Card>

           {/* Section D: Other Information (minimized for brevity - no changes needed here) */}
          <Card>
              <CardHeader><CardTitle>D. Other Information</CardTitle></CardHeader>
              <CardContent className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="mun_experience">MUN Experience</Label>
                    <Textarea id="mun_experience" placeholder="e.g., 3 conferences as delegate, 1 as chair..." value={formData.mun_experience} onChange={handleChange} required />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="advert">How did you hear about us?</Label>
                        <Select onValueChange={(value) => handleSelectChange('advert', value)} value={formData.advert}>
                            <SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="social_media">Social Media</SelectItem>
                                <SelectItem value="friend">Friend/Colleague</SelectItem>
                                <SelectItem value="university">University</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="tshirt_size">T-Shirt Size</Label>
                    <Select onValueChange={(value) => handleSelectChange('tshirt_size', value)} value={formData.tshirt_size}>
                        <SelectTrigger><SelectValue placeholder="Select T-Shirt Size" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="xs">XS</SelectItem>
                            <SelectItem value="s">S</SelectItem>
                            <SelectItem value="m">M</SelectItem>
                            <SelectItem value="l">L</SelectItem>
                            <SelectItem value="xl">XL</SelectItem>
                            <SelectItem value="xxl">XXL</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="diet">Dietary Restrictions</Label>
                        <Textarea id="diet" placeholder="e.g., Vegetarian, nut allergy" value={formData.diet} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="medical">Medical Conditions</Label>
                        <Textarea id="medical" placeholder="Please list any relevant medical conditions or allergies." value={formData.medical} onChange={handleChange} />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="referral">Referral Code (if any)</Label>
                    <Input id="referral" value={formData.referral} onChange={handleChange} />
                </div>
              </CardContent>
          </Card>

          <Button type="submit" size="lg">Submit Registration</Button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
