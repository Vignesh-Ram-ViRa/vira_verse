# Cloudinary Integration Guide for Vira Verse

This guide explains how Cloudinary is integrated with Supabase for secure image uploads in the Vira Verse project.

## Overview

Vira Verse uses a secure server-side approach for image uploads:
- Frontend sends images to a Supabase Edge Function
- Edge Function uploads to Cloudinary using server-side credentials
- Frontend receives the Cloudinary URL for storage in the database
- This approach keeps API secrets secure and prevents client-side exposure

## Cloudinary Account Setup

### Step 1: Account Information
Your Cloudinary account details:
- **Cloud Name**: `dnar75gig`
- **API Key**: `754821641134353`
- **API Secret**: `eChu8_YfG5FeJG9gdO1w_BaOwUQ`

### Step 2: Folder Structure
All uploads are organized in Cloudinary:
- **Folder**: `/vira_verse/`
- **Naming Pattern**: `{user_id}_{timestamp}_{sanitized_filename}`

## Integration Architecture

```
[Frontend] → [Supabase Edge Function] → [Cloudinary] → [Database]
    ↓              ↓                        ↓           ↓
  File Upload   Secure Upload         Store Image    Save URL
```

### Security Benefits:
1. **API Keys Protected**: Never exposed to frontend
2. **User Authentication**: Only authenticated users can upload
3. **File Validation**: Server-side type and size checking
4. **Organized Storage**: User-based file naming and folders

## Edge Function Details

### File: `utilities/supabase/cloudinary-upload-function.js`

**Features:**
- CORS handling for frontend requests
- User authentication verification
- File type validation (images only)
- File size validation (max 5MB)
- Unique filename generation
- Secure Cloudinary API integration

**Supported File Types:**
- JPEG/JPG
- PNG
- WebP
- GIF

**File Size Limit:**
- Maximum: 5MB per file

## Frontend Usage

### Import the upload function:
```javascript
import { uploadImage } from '../utils/supabase';
```

### Upload an image:
```javascript
const handleImageUpload = async (file) => {
  try {
    const imageUrl = await uploadImage(file);
    console.log('Image uploaded:', imageUrl);
    // Use imageUrl in your project data
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Example with form:
```javascript
const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  setUploading(true);
  try {
    const url = await uploadImage(file);
    setProjectData(prev => ({
      ...prev,
      preview_image_url: url
    }));
  } catch (error) {
    setError('Failed to upload image');
  } finally {
    setUploading(false);
  }
};
```

## Environment Configuration

### Supabase Environment Variables
Set these in your Supabase project settings:

```
CLOUDINARY_CLOUD_NAME=dnar75gig
CLOUDINARY_API_KEY=754821641134353
CLOUDINARY_API_SECRET=eChu8_YfG5FeJG9gdO1w_BaOwUQ
```

### Frontend Environment Variables
In your `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment Steps

### 1. Deploy Edge Function
```bash
# Login to Supabase CLI
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Create function (if not exists)
supabase functions new cloudinary-upload

# Deploy function
supabase functions deploy cloudinary-upload
```

### 2. Set Environment Variables
In Supabase Dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add Cloudinary credentials
3. Restart edge functions if needed

### 3. Test Upload
```javascript
// Test upload in browser console
const testUpload = async () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const url = await uploadImage(file);
        console.log('Test upload successful:', url);
      } catch (error) {
        console.error('Test upload failed:', error);
      }
    }
  };
  input.click();
};
```

## Error Handling

### Common Errors and Solutions:

**1. Unauthorized (401)**
- Ensure user is logged in
- Check authorization header is included
- Verify Supabase session is valid

**2. File Type Error (400)**
- Only image files are allowed
- Check file.type is in allowed types
- Ensure file is not corrupted

**3. File Size Error (400)**
- Maximum file size is 5MB
- Compress images before upload
- Use image optimization tools

**4. Cloudinary Configuration Missing (500)**
- Check environment variables are set in Supabase
- Verify variable names match exactly
- Restart edge functions after setting variables

**5. Upload Failed (500)**
- Check Cloudinary account limits
- Verify API credentials are correct
- Check network connectivity

## Image Optimization

### Recommended Practices:
1. **Compress images** before upload (use tools like TinyPNG)
2. **Use WebP format** for better compression
3. **Resize images** to appropriate dimensions
4. **Optimize for web** to reduce file sizes

### Cloudinary Transformations:
You can add URL transformations for automatic optimization:

```javascript
// Example: Auto-optimize and resize
const optimizedUrl = imageUrl.replace(
  '/upload/',
  '/upload/f_auto,q_auto,w_800,h_600,c_fit/'
);
```

## Monitoring and Analytics

### Check Upload Status:
1. **Supabase Logs**: Monitor edge function executions
2. **Cloudinary Dashboard**: View upload statistics
3. **Browser Network Tab**: Debug upload requests

### Performance Metrics:
- Track upload success/failure rates
- Monitor file sizes and types
- Observe upload response times

## Security Best Practices

### Server-Side Validation:
- ✅ File type checking
- ✅ File size limits
- ✅ User authentication
- ✅ Secure API credentials

### Additional Security:
- Consider adding virus scanning
- Implement rate limiting
- Add content moderation for public images
- Monitor for abuse patterns

## Troubleshooting

### Debug Steps:
1. **Check Supabase Logs**:
   - Go to Edge Functions → cloudinary-upload → Logs
   - Look for error messages and stack traces

2. **Test Edge Function Directly**:
   ```bash
   curl -X POST 'YOUR_SUPABASE_URL/functions/v1/cloudinary-upload' \
     -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
     -F 'file=@path/to/test-image.jpg'
   ```

3. **Verify Environment Variables**:
   ```sql
   -- In Supabase SQL Editor (check if vars are set)
   SELECT * FROM pg_settings WHERE name LIKE 'cloudinary%';
   ```

4. **Test Cloudinary Directly**:
   ```bash
   # Test direct upload to Cloudinary
   curl -X POST 'https://api.cloudinary.com/v1_1/dnar75gig/image/upload' \
     -F 'file=@test-image.jpg' \
     -F 'api_key=754821641134353' \
     -F 'timestamp=1234567890' \
     -F 'signature=your_generated_signature'
   ```

## Production Considerations

### Before Going Live:
1. **Rotate API Keys**: Generate new Cloudinary credentials
2. **Set Proper CORS**: Configure allowed origins
3. **Add Rate Limiting**: Prevent abuse
4. **Monitor Usage**: Track storage and bandwidth
5. **Backup Strategy**: Consider backup solutions

### Scaling Considerations:
- Monitor Cloudinary usage limits
- Consider CDN for image delivery
- Implement caching strategies
- Plan for storage growth

This integration provides a secure, scalable solution for image management in Vira Verse while maintaining good security practices and user experience. 