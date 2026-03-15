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
    const { phone, riskLevel, recommendations } = await req.json();
    if (!phone) throw new Error("Phone number is required");

    const cleanPhone = phone.replace(/[\s+]/g, "").replace(/^91/, "");
    const recText = (recommendations || []).slice(0, 2).map((r: string) => `- ${r}`).join(" ");

    // DEMO MODE: Log instead of sending real SMS
    console.log(`[arogyNetr DEMO] Health Result SMS for ${cleanPhone}: Status: ${riskLevel || "Unknown"}. ${recText} Thank you for using arogyNetr.`);

    return new Response(
      JSON.stringify({ success: true, message: "Health result SMS logged (demo mode)" }),
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
