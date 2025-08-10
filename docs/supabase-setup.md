# Supabase Setup Guide for Vira Verse

This guide walks you through setting up Supabase for the Vira Verse project, including database schema, Row Level Security (RLS), and Edge Functions.

## Prerequisites

- Supabase account (free tier is sufficient for development)
- Basic understanding of PostgreSQL and SQL

## Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `vira-verse`
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose closest to your location
5. Click "Create new project"
6. Wait for the project to be provisioned (takes ~2 minutes)

## Step 2: Get Project Credentials

Once your project is ready:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **Anon public key** (starts with `eyJ`)
3. Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Create a new query
3. Copy and paste the contents of `utilities/database/schema.sql`
4. Click "Run" to execute the schema

This will create:
- `projects` table with all required fields
- Custom enum type for project status
- Indexes for performance optimization
- Triggers for automatic timestamp updates
- Comprehensive documentation comments

## Step 4: Set Up Row Level Security (RLS)

1. In SQL Editor, create another new query
2. Copy and paste the contents of `utilities/database/rls-policies.sql`
3. Click "Run" to execute the RLS policies

This will enable:
- **Owner access**: Users can view/edit/delete their own projects
- **Public access**: Anyone can view public projects (for guest mode)
- **Security isolation**: Private projects are completely hidden from other users

## Step 5: Add Sample Data (Optional)

1. First, you need to create a user or get your user ID after authentication is set up
2. In SQL Editor, create a new query
3. Copy the contents of `utilities/database/initial-data.sql`
4. **Replace `YOUR_USER_ID_HERE`** with an actual user UUID
5. Click "Run" to insert sample projects

## Step 6: Set Up Cloudinary Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

```
CLOUDINARY_CLOUD_NAME=dnar75gig
CLOUDINARY_API_KEY=754821641134353
CLOUDINARY_API_SECRET=eChu8_YfG5FeJG9gdO1w_BaOwUQ
```

## Step 7: Deploy Cloudinary Edge Function

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

4. Create the edge function directory:
```bash
supabase functions new cloudinary-upload
```

5. Replace the generated function code with the contents of `utilities/supabase/cloudinary-upload-function.js`

6. Deploy the function:
```bash
supabase functions deploy cloudinary-upload
```

## Step 8: Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure your site URL:
   - **Site URL**: `http://localhost:5173` (for development)
   - **Redirect URLs**: Add your production domain when deploying

3. Enable desired auth providers:
   - **Email**: Enabled by default
   - **OAuth providers**: Configure as needed (Google, GitHub, etc.)

## Step 9: Test Database Connection

1. Go to **Table Editor** in Supabase dashboard
2. You should see the `projects` table
3. Verify the table structure matches your schema
4. Test RLS by viewing data with different user contexts

## Step 10: Verify Edge Function

1. Go to **Edge Functions** in Supabase dashboard
2. You should see `cloudinary-upload` function
3. Check the logs for any deployment issues

## Environment Variables Summary

Your final `.env` file should look like:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Development
NODE_ENV=development
VITE_APP_NAME=Vira Verse
VITE_APP_VERSION=1.0.0
```

## Security Considerations

1. **Never expose your service role key** in frontend code
2. **Use environment variables** for all sensitive data
3. **RLS policies** ensure data isolation between users
4. **Cloudinary credentials** are stored securely in Supabase environment
5. **Edge functions** handle server-side operations safely

## Troubleshooting

### Common Issues:

1. **Connection refused**: Check your project URL and API key
2. **RLS blocking queries**: Ensure you're authenticated when testing
3. **Edge function errors**: Check Supabase logs for deployment issues
4. **Cloudinary upload fails**: Verify environment variables are set correctly

### Useful SQL Queries:

```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'projects';

-- List all policies on projects table
SELECT * FROM pg_policies WHERE tablename = 'projects';

-- Test project visibility (run as different users)
SELECT id, title, private, user_id FROM projects;
```

## Next Steps

After completing this setup:

1. Test authentication flow in your application
2. Verify CRUD operations work correctly
3. Test image upload functionality
4. Deploy to production with proper environment variables

For production deployment, remember to:
- Update site URLs in Supabase auth settings
- Set production environment variables
- Configure proper backup and monitoring
- Review and test all RLS policies

## Support

If you encounter issues:
1. Check Supabase documentation: https://supabase.com/docs
2. Review Supabase logs for detailed error messages
3. Test queries in the SQL Editor for debugging
4. Verify environment variables are correctly set 