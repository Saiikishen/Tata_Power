'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PATHS } from '@/lib/constants';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { GoogleSignInButton } from './GoogleSignInButton';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  name: z.string().optional(), // Only for signup
});

type AuthFormValues = z.infer<typeof formSchema>;

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  async function onSubmit(values: AuthFormValues) {
    startTransition(async () => {
      try {
        if (mode === 'signup') {
          if (!values.name) {
            form.setError("name", { type: "manual", message: "Name is required for signup." });
            return;
          }
          const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
          await updateProfile(userCredential.user, { displayName: values.name });
          toast({ title: "Account created successfully!", description: "You are now logged in." });
          router.push(PATHS.DASHBOARD);
        } else {
          await signInWithEmailAndPassword(auth, values.email, values.password);
          toast({ title: "Login successful!", description: "Welcome back." });
          router.push(PATHS.DASHBOARD);
        }
      } catch (error: any) {
        const errorCode = error.code;
        let errorMessage = "An unexpected error occurred. Please try again.";
        if (errorCode === "auth/email-already-in-use") {
          errorMessage = "This email is already in use. Please try logging in.";
        } else if (errorCode === "auth/invalid-email") {
          errorMessage = "The email address is not valid.";
        } else if (errorCode === "auth/operation-not-allowed") {
          errorMessage = "Email/password accounts are not enabled.";
        } else if (errorCode === "auth/weak-password") {
          errorMessage = "The password is too weak.";
        } else if (errorCode === "auth/user-not-found" || errorCode === "auth/wrong-password" || errorCode === "auth/invalid-credential") {
          errorMessage = "Invalid email or password.";
        }
        toast({ title: mode === 'signup' ? 'Signup Failed' : 'Login Failed', description: errorMessage, variant: 'destructive' });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {mode === 'signup' && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (mode === 'signup' ? 'Signing Up...' : 'Logging In...') : (mode === 'signup' ? 'Sign Up' : 'Log In')}
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <GoogleSignInButton disabled={isPending}/>
      </form>
    </Form>
  );
}
