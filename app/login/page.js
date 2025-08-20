'use client'

import { useForm } from 'react-hook-form'
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    setError("");
    startTransition(async () => {
      const result = await signIn("credentials", {
        email: data.email.trim(),
        password: data.password.trim(),
        redirect: false, // We will handle redirect manually
      });

      if (result.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        // On successful sign-in, NextAuth will set the session cookie.
        // Then we can redirect.
        router.push('/dashboard');
        router.refresh(); // Refresh the page to reflect the new session
      }
    });
  };

  return (
    <section className="h-screen w-full flex items-center justify-center">
      <div className="p-5">
        <div className="flex flex-col items-center">
          <Image src="/logo.png" alt="website logo" width={180} height={72} />
          <h2 className="text-center text-2xl font-bold mb-8 mt-3">
            Sign In to the Dashboard
          </h2>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-md w-[25rem] flex flex-col gap-6"
        >
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your Email"
              className="h-12"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your Password"
              className="h-12"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" disabled={isPending} className="cursor-pointer">
            {isPending ? 'Logging in...' : 'Login'}
          </Button>
          <a href="#">Forgot password?</a>
        </form>
      </div>
    </section>
  )
}