import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, name } = await req.json();
    if (!phone) throw new Error("Phone number is required");

    const cleanPhone = phone.replace(/[\s+]/g, "").replace(/^91/, "");

    // DEMO MODE: Log instead of sending real SMS
    console.log(`[arogyNetr DEMO] Welcome SMS for ${cleanPhone}: Welcome to arogyNetr! Hi ${name || "User"}, your registration was successful. Thank you for joining us. Stay healthy!`);

    return new Response(
      JSON.stringify({ success: true, message: "Welcome SMS logged (demo mode)" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
