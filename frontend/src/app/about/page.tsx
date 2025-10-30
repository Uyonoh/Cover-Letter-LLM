"use client";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground px-6 md:px-12 lg:px-24 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About Cover Letter AI</h1>
          <p className="text-lg text-muted-foreground">
            Cover Letter AI was born from the simple idea of making the job application process faster, smarter, and more personal. 
            Writing unique cover letters for every position can be time-consuming and stressful, so we set out to build a tool 
            that blends automation with authenticity.
          </p>
        </section>

        <section className="space-y-4">
          <p className="text-lg text-muted-foreground">
            What started as a personal project to ease one person’s burden quickly evolved into something bigger. 
            We realized that countless job seekers face the same challenge of finding the balance between efficiency 
            and personalization. That insight became the foundation for Cover Letter AI.
          </p>

          <p className="text-lg text-muted-foreground">
            Today, Cover Letter AI helps users craft professional, tailored cover letters in minutes. 
            By combining intuitive design, intelligent automation, and flexibility, we help people 
            focus on what really matters — telling their story and landing the right opportunity.
          </p>
        </section>
      </div>
    </main>
  );
}
