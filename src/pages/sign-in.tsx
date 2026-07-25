import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"

import { AuthCard } from "@/components/auth/auth-card"
import { FormField } from "@/components/auth/form-field"
import { Button } from "@/components/ui/button"
import { PageTransition } from "@/components/layout/page-transition"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface SignInValues {
  email: string
  password: string
}

type SignInErrors = Partial<Record<keyof SignInValues, string>>

export function SignIn() {
  const navigate = useNavigate()
  const [values, setValues] = useState<SignInValues>({ email: "", password: "" })
  const [errors, setErrors] = useState<SignInErrors>({})
  const [submitted, setSubmitted] = useState(false)

  function updateField(field: keyof SignInValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: SignInErrors = {}
    if (!values.email) nextErrors.email = "Email is required."
    else if (!EMAIL_REGEX.test(values.email)) nextErrors.email = "Enter a valid email address."
    if (!values.password) nextErrors.password = "Password is required."

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true)
      window.setTimeout(() => navigate("/"), 900)
    }
  }

  return (
    <PageTransition>
      <AuthCard
        title="Welcome back"
        subtitle="Sign in to keep reading and writing."
        footer={
          <>
            Don&apos;t have an account?{" "}
            <Link to="/sign-up" className="font-medium text-gradient-brand">
              Sign up
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <FormField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            error={errors.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
          <FormField
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={values.password}
            error={errors.password}
            onChange={(event) => updateField("password", event.target.value)}
          />

          <Button
            type="submit"
            size="lg"
            className="mt-2 bg-gradient-brand text-white hover:opacity-90"
          >
            {submitted ? "Signed in — redirecting…" : "Sign in"}
          </Button>
        </form>
      </AuthCard>
    </PageTransition>
  )
}
