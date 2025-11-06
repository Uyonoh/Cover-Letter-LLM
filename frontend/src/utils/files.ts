import { apiFetch } from "./api";
import type { letterBrief } from "@/types/letters";

export async function downloadLetter(letter: letterBrief, name: string, email: string, format: string = "pdf") {
    // const format = "pdf";
    const fileName = letter.jobs.title + " cover letter";
    const content = letter.content;
    const title = `Cover Letter for ${letter.jobs.title}`;
    const sender_name = name;
    const sender_email = email
    const recipient_name = "Hiring Manager";
    const recipient_company = letter.jobs.company;
    const recipient_address = "";
    const include_header = true;

    const data = {content, title, sender_name, sender_email,
                      recipient_name, recipient_company, recipient_address,
                      include_header, format,
                    } ;
    const payload = JSON.stringify(data);
    try {
      const blob: Blob = await apiFetch(
        `/letters/download`,{
          method: "POST",
          body: payload,
        }, "blob"
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error: unknown) {
      console.error("Failed download:", error);
    }
  }


function downloadLetterTxt(letter: letterBrief) {
    // Construct the text content
    const content = `Job Title: ${letter.jobs.title}
        Company: ${letter.jobs.company}
        Date: ${new Date(letter.created_at).toLocaleDateString()}

        ${letter.content || ""}`;

    // Create a blob and a temporary link
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${letter.jobs.title?.replace(/\s+/g, "_")}_cover_letter.txt`;
    a.click();

    // Clean up
    URL.revokeObjectURL(url);
  }