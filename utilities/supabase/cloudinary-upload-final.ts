// Supabase Edge Function: cloudinary-upload
// FINAL WORKING VERSION - Uses upload preset (NO SIGNATURE NEEDED!)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 8192;
  
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.slice(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(binary);
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 FINAL Edge Function started')

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('✅ User authenticated:', user.id)

    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('📁 File:', { name: file.name, size: file.size, type: file.type })

    // Validate file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: 'Invalid file type' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ error: 'File too large' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME')

    if (!cloudName) {
      return new Response(JSON.stringify({ error: 'Cloudinary config missing' }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('🔧 Config OK, cloud:', cloudName)

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer()
    const base64String = arrayBufferToBase64(arrayBuffer)
    const base64Data = `data:${file.type};base64,${base64String}`

    console.log('✅ Base64 complete, length:', base64String.length)

    const timestamp = Math.round(new Date().getTime() / 1000)
    const fileName = `vira_verse_${user.id}_${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    
    // UNSIGNED UPLOAD WITH PRESET - NO SIGNATURE NEEDED!
    console.log('🎯 Using UNSIGNED upload with preset...')
    
    const uploadFormData = new FormData()
    uploadFormData.append('file', base64Data)
    uploadFormData.append('upload_preset', 'vira_verse_preset') // The preset you created
    uploadFormData.append('public_id', fileName)

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    
    console.log('☁️ Uploading to Cloudinary...')
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: uploadFormData,
    })

    console.log('📥 Response status:', response.status)
    const result = await response.json()
    console.log('📊 Result:', result)

    if (response.ok) {
      console.log('🎉 UPLOAD SUCCESSFUL!', result.secure_url)
      return new Response(
        JSON.stringify({ 
          url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
          success: true
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } else {
      console.error('❌ Upload failed:', result)
      return new Response(
        JSON.stringify({ 
          error: 'Upload failed',
          details: result
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

  } catch (error) {
    console.error('💥 Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}) 