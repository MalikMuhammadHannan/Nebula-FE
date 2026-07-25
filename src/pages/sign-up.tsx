import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"

import { AuthCard } from "@/components/auth/auth-card"
import { FormField } from "@/components/auth/form-field"
import { PageTransition } from "@/components/layout/page-transition"
import { Button } from "@/components/ui/button"
import { EMAIL_REGEX } from "@/constants"

const MIN_PASSWORD_LENGTH = 8

interface SignUpValues {
  name: string
  email: string
  password: string
  confirmPassword: string
}

type SignUpErrors = Partial<Record<keyof SignUpValues, string>>

const SignUp = () => {
  const navigate = useNavigate()
  const [values, setValues] = useState<SignUpValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<SignUpErrors>({})
  const [submitted, setSubmitted] = useState(false)

  function updateField(field: keyof SignUpValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: SignUpErrors = {}
    if (!values.name.trim()) nextErrors.name = "Name is required."
    if (!values.email) nextErrors.email = "Email is required."
    else if (!EMAIL_REGEX.test(values.email)) nextErrors.email = "Enter a valid email address."
    if (!values.password) nextErrors.password = "Password is required."
    else if (values.password.length < MIN_PASSWORD_LENGTH)
      nextErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
    if (values.confirmPassword !== values.password)
      nextErrors.confirmPassword = "Passwords don't match."

    setErrors(nextErrors)

    // UI-only form — no backend is wired up in this project yet.
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true)
      window.setTimeout(() => navigate("/"), 900)
    }
  }

  return (
    <PageTransition>
      <AuthCard
        title="Create your account"
        subtitle="Join Nebula and start publishing."
        footer={
          <>
            Already have an account?{" "}
            <Link to="/sign-in" className="font-medium text-gradient-brand">
              Sign in
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <FormField
            id="name"
            label="Name"
            type="text"
            autoComplete="name"
            placeholder="Ada Lovelace"
            value={values.name}
            error={errors.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
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
            autoComplete="new-password"
            placeholder="••••••••"
            value={values.password}
            error={errors.password}
            onChange={(event) => updateField("password", event.target.value)}
          />
          <FormField
            id="confirmPassword"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={values.confirmPassword}
            error={errors.confirmPassword}
            onChange={(event) => updateField("confirmPassword", event.target.value)}
          />

          <Button
            type="submit"
            size="lg"
            className="mt-2 bg-gradient-brand text-white hover:opacity-90"
          >
            {submitted ? "Account created — redirecting…" : "Sign up"}
          </Button>
        </form>
      </AuthCard>
    </PageTransition>
  )
}

export default SignUp