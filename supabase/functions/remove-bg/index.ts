import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const REMOVE_BG_API_KEY = Deno.env.get("REMOVE_BG_API_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

serve(async (req) => {
  // CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    });
  }

  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File;
    const bgColor = formData.get("bg_color") as string || "#FFFFFF";
    const format = formData.get("format") as string || "passport";
    const userId = formData.get("user_id") as string;

    if (!imageFile) {
      return new Response(JSON.stringify({ error: "이미지가 필요합니다" }), { status: 400 });
    }

    // Supabase 클라이언트
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 크레딧 확인 및 차감
    if (userId) {
      const { data: hasCredit } = await supabase.rpc("use_credit", { p_user_id: userId });
      if (!hasCredit) {
        return new Response(JSON.stringify({ error: "크레딧이 부족합니다. 프리미엄을 구매해주세요." }), { status: 402 });
      }
    }

    // remove.bg API 호출
    const removeBgForm = new FormData();
    removeBgForm.append("image_file", imageFile);
    removeBgForm.append("size", "full");
    removeBgForm.append("bg_color", bgColor.replace("#", ""));

    const removeBgRes = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": REMOVE_BG_API_KEY },
      body: removeBgForm,
    });

    if (!removeBgRes.ok) {
      const errText = await removeBgRes.text();
      return new Response(JSON.stringify({ error: "배경 제거 실패", detail: errText }), { status: 500 });
    }

    const resultBlob = await removeBgRes.blob();
    const resultBuffer = await resultBlob.arrayBuffer();
    const resultBytes = new Uint8Array(resultBuffer);

    // Supabase Storage에 저장
    const fileName = `${userId || "anonymous"}/${Date.now()}.png`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("photos")
      .upload(fileName, resultBytes, { contentType: "image/png", upsert: true });

    if (uploadError) {
      // Storage 실패해도 이미지는 반환
      console.error("Storage upload error:", uploadError);
    }

    const publicUrl = uploadData
      ? supabase.storage.from("photos").getPublicUrl(fileName).data.publicUrl
      : null;

    // 사진 기록 저장
    if (userId) {
      await supabase.from("photos").insert({
        user_id: userId,
        format_name: format,
        background_color: bgColor,
        processed_url: publicUrl,
        status: "completed",
      });
    }

    // base64로 반환
    const base64 = btoa(String.fromCharCode(...resultBytes));

    return new Response(
      JSON.stringify({
        success: true,
        image_base64: base64,
        image_url: publicUrl,
        content_type: "image/png",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
