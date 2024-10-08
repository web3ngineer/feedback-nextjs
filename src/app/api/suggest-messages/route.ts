import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {GoogleGenerativeAIStream, OpenAIStream, StreamingTextResponse,} from "ai";
import { NextResponse } from "next/server";

// const openAi = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const genAi = new GoogleGenerativeAI(process.env.GENAI_API_KEY || "");

// Set the runtime to edge for best performance
export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const prompt =
    "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

  try {
    //************ OPEN AI ***************/
    // Ask OpenAI for a streaming completion given the prompt
    // const response = await openAi.completions.create({
    //   model: "gpt-3.5-turbo-instruct",
    //   max_tokens: 400,
    //   stream: true,
    //   prompt,
    // });
    // console.log(response);

    // Convert the response into a friendly text-stream
    // const stream = OpenAIStream(response);
    // console.log(stream);

    //************ GEMINI AI ***************/
    // Using the correct function to create a completion stream
    const response = await genAi
      .getGenerativeModel({ model: "gemini-pro" })
      .generateContentStream({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
    // Convert the response into a friendly text-stream
    const stream = GoogleGenerativeAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error: any) {
    // if (error instanceof OpenAI.APIError) {
    //   const { name, status, headers, message } = error;
    //   return NextResponse.json(
    //     {
    //       name,
    //       status,
    //       headers,
    //       message,
    //     },
    //     { status }
    //   );
    // } else {
    //   console.log("Error in request", error);
    //   throw error;
    // }

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Error getting response from googleAI",
        error,
      },
      { status: 500 }
    );
  }
}
