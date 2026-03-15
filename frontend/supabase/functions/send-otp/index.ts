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
    const { phone } = await req.json();
    if (!phone) throw new Error("Phone number is required");

    const cleanPhone = phone.replace(/[\s+]/g, "").replace(/^91/, "");
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // DEMO MODE: Log OTP instead of sending real SMS
    console.log(`[arogyNetr DEMO] OTP for ${cleanPhone}: ${otp}`);
    console.log(`SMS would be: Your arogyNetr verification code is ${otp}. Do not share this code with anyone. This code will expire in 5 minutes.`);

    return new Response(
      JSON.stringify({ success: true, otp, message: "OTP generated (demo mode)" }),
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
