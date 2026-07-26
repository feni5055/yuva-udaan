import { ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "react-router";

function PolicyPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: Array<{ heading: string; body: string }>;
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-5 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-body">
            <ArrowLeft size={14} /> Back to Magazine
          </Link>
        </div>
      </header>
      <article className="max-w-3xl mx-auto px-5 py-12 md:py-20">
        <BookOpen size={28} className="text-primary mb-5" aria-hidden="true" />
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{title}</h1>
        <p className="text-sm text-muted-foreground font-body leading-relaxed mb-10">{intro}</p>
        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-display font-bold mb-2">{section.heading}</h2>
              <p className="text-sm text-muted-foreground font-body leading-7">{section.body}</p>
            </section>
          ))}
        </div>
        <p className="text-xs text-muted-foreground font-body mt-12">Last updated: 26 July 2026</p>
      </article>
    </main>
  );
}

export function Terms() {
  return (
    <PolicyPage
      title="Terms of Service"
      intro="These terms explain the basic rules for using the Hindi Club Magazine website and member upload portal."
      sections={[
        {
          heading: "Accounts",
          body: "Provide accurate account details and keep your password private. You are responsible for activity performed through your account.",
        },
        {
          heading: "Magazine submissions",
          body: "Only upload work that you created or have permission to publish. Submissions must not contain unlawful, harmful, misleading, or infringing material.",
        },
        {
          heading: "Editorial review",
          body: "All magazine submissions may be reviewed, approved, rejected, unpublished, or removed by the Hindi Club administrators. Uploading does not guarantee publication.",
        },
        {
          heading: "Your content",
          body: "You keep ownership of your original work. By submitting it, you allow the Hindi Club to store, review, display, and distribute it through the magazine website.",
        },
        {
          heading: "Service availability",
          body: "The website is provided for the club community. Features may change, and access may occasionally be interrupted for maintenance or security reasons.",
        },
      ]}
    />
  );
}

export function Privacy() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro="This policy describes the information used to operate the Hindi Club Magazine website."
      sections={[
        {
          heading: "Information collected",
          body: "We collect account details such as your name and email, magazine submission details and files, comments, and information you send through the contact form.",
        },
        {
          heading: "How information is used",
          body: "Information is used to authenticate members, process and review magazine submissions, publish approved content, moderate comments, respond to messages, and protect the service.",
        },
        {
          heading: "Storage and providers",
          body: "Account and content records are stored with Supabase. Uploaded magazine files are stored with Cloudflare R2, and the website is hosted on Vercel.",
        },
        {
          heading: "Sharing",
          body: "We do not sell personal information. Approved magazine content becomes publicly accessible; private submissions remain limited to their owner and authorized administrators.",
        },
        {
          heading: "Your choices",
          body: "Members may delete eligible draft submissions through their account. For other access, correction, or deletion requests, use the website contact form.",
        },
      ]}
    />
  );
}
