// Supabase Edge Function for Cloudinary Image Upload
// This function handles secure image uploads to Cloudinary without exposing API keys to the frontend

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse the form data
    const formData = await req.formData()
    const file = formData.get('file')
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate file type (images only)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Only images are allowed.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({ error: 'File size too large. Maximum 5MB allowed.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get Cloudinary credentials from environment variables
    const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME')
    const apiKey = Deno.env.get('CLOUDINARY_API_KEY')
    const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET')

    if (!cloudName || !apiKey || !apiSecret) {
      return new Response(
        JSON.stringify({ error: 'Cloudinary configuration missing' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create a unique filename
    const timestamp = Math.round(new Date().getTime() / 1000)
    const fileName = `${user.id}_${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer()
    const base64String = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    const base64Data = `data:${file.type};base64,${base64String}`

    // Create Cloudinary upload URL
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

    // Prepare upload data
    const uploadData = new FormData()
    uploadData.append('file', base64Data)
    uploadData.append('api_key', apiKey)
    uploadData.append('folder', 'vira_verse')
    uploadData.append('public_id', fileName)
    uploadData.append('overwrite', 'true')
    uploadData.append('resource_type', 'image')
    
    // Generate signature for security (simplified version)
    // In production, you might want to add more parameters and proper signature generation
    const paramsToSign = `folder=vira_verse&overwrite=true&public_id=${fileName}&resource_type=image&timestamp=${timestamp}`
    const signature = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(apiSecret),
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    ).then(key => 
      crypto.subtle.sign('HMAC', key, new TextEncoder().encode(paramsToSign))
    ).then(signature => 
      Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    )

    uploadData.append('timestamp', timestamp.toString())
    uploadData.append('signature', signature)

    // Upload to Cloudinary
    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: uploadData,
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Cloudinary upload error:', result)
      return new Response(
        JSON.stringify({ error: 'Upload failed', details: result.error }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Return the Cloudinary URL
    return new Response(
      JSON.stringify({ 
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in cloudinary upload function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}) 