
export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const body = await request.json();
    const question = body.question;

    if (
      typeof question !== "string" ||
      !question.trim() ||
      question.length > 1000
    ) {
      return Response.json(
        { error: "質問は1〜1000文字で入力してください。" },
        { status: 400 }
      );
    }

    const messages = [
      {
        role: "system",
        content:
          "あなたは親切な学習ガイダンスAIです。" +
          "日本語で回答してください。" +
          "学習者の理解を助けるため、" +
          "わかりやすい説明と具体例を示してください。" +
          "最後に理解を深める問いを1つ提示してください。"
      },
      {
        role: "user",
        content: question.trim()
      }
    ];

    const result = await env.AI.run(
      "@cf/meta/llama-4-scout-17b-16e-instruct",
      {
        messages,
        max_tokens: 400
      }
    );

    return Response.json({
      answer: result.response || "回答を取得できませんでした。"
    });

  } catch (error) {
    console.error("AI request failed:", error);

    return Response.json(
      { error: "AIとの通信に失敗しました。" },
      { status: 500 }
    );
  }
}
