# Supabase Authentication Setup

This project uses Supabase for authentication. Follow these steps to set it up:

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details:
   - Project name: `event-voting` (or your preferred name)
   - Database password: (save this securely)
   - Region: Choose the closest to your users
4. Wait for the project to be created (2-3 minutes)

## 2. Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll find two important values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: A long string starting with `eyJ...`

## 3. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update the Supabase values in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## 4. Authentication is Ready!

The authentication system is now configured with:

- ✅ **Email/Password registration**: Users can create accounts with email and password
- ✅ **Email/Password login**: Users can sign in with their credentials
- ✅ **Session management**: Automatic session handling and persistence
- ✅ **Protected routes**: Authentication state is available throughout the app via `useAuth()` hook

## Usage in Components

```typescript
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, loading, signOut } = useAuth()

  if (loading) return <div>Loading...</div>

  if (!user) return <div>Please login</div>

  return (
    <div>
      <p>Welcome, {user.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

## Features

### Login Modal (PaymentFlow Component)

The login modal includes:

- 🎨 **Luxury tech design**: Deep black (#0E0E0E) with gold accents (#FFD76A)
- ✨ **Animated glow orbs**: Subtle background animation
- 🔄 **Loading animation**: 3 bouncing gold dots during authentication
- 🎊 **Confetti effect**: Celebration animation on successful login/registration
- 🔀 **Toggle registration/login**: Easy switch between modes
- ⚠️ **Error handling**: User-friendly error messages in Vietnamese
- 🔒 **Input validation**: Email and password validation before submission

### Authentication Features

- **Automatic redirect**: Logged-in users skip directly to payment
- **Session persistence**: Users stay logged in across page refreshes
- **Google OAuth**: Ready for Google Sign-In integration (requires Supabase OAuth setup)
- **Password requirements**: Minimum 6 characters enforced

## Optional: Enable Google OAuth

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Enable **Google** provider
3. Follow the setup instructions to configure Google OAuth
4. The "Sign in with Google" button will automatically work

## Security Notes

- Never commit `.env.local` to version control
- The `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe to expose in client-side code
- Keep your `SUPABASE_SERVICE_ROLE_KEY` secret (not used in client components)
- Supabase handles password hashing and security automatically

## Troubleshooting

### "Invalid API key"
- Double-check your `NEXT_PUBLIC_SUPABASE_ANON_KEY` matches the one in Supabase dashboard
- Make sure there are no extra spaces in your `.env.local` file

### "Email not confirmed"
- By default, Supabase requires email confirmation
- To disable for testing: Supabase Dashboard → **Authentication** → **Providers** → **Email** → Disable "Confirm email"

### "User already registered"
- This means the email is already in use
- Switch to login mode instead

## Database Schema

Supabase automatically creates the authentication tables. No manual setup required!

The `auth.users` table stores user information:
- `id`: UUID (primary key)
- `email`: User's email
- `created_at`: Registration timestamp
- Plus other Supabase-managed fields

You can extend this with custom user profiles if needed.
