import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, Select } from '@/components/ui'
import { signupSchema, type SignupValues } from './schemas'
import { useSignup } from './hooks'
import { AuthShell } from './AuthShell'

export function SignupPage() {
  const navigate = useNavigate()
  const signup = useSignup()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: 'GUEST' },
  })

  const onSubmit = (values: SignupValues) => {
    signup.mutate(
      { name: values.name, email: values.email, password: values.password, roles: [values.role] },
      { onSuccess: () => navigate('/', { replace: true }) },
    )
  }

  return (
    <AuthShell title="Create your account" subtitle="Join YATRIK and start booking stays.">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <Input
          label="Full name"
          placeholder="Asha Traveler"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          error={errors.password?.message}
          {...register('password')}
        />
        <Select
          label="I want to"
          error={errors.role?.message}
          options={[
            { value: 'GUEST', label: 'Book stays (Guest)' },
            { value: 'HOTEL_MANAGER', label: 'List my hotel (Manager)' },
          ]}
          {...register('role')}
        />
        <Button type="submit" fullWidth isLoading={signup.isPending} className="mt-2">
          Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}
