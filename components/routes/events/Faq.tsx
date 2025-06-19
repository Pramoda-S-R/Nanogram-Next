import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/client/shared/ui/Accordion";

// FAQ Data (You can easily add new items here)
const faqData = [
  {
    question: "What kind of activities does the technical club organize?",
    answer:
      "We host workshops, project building, hackathons, and guest lectures. Our projects range from beginner-friendly to advanced, covering various technical domains.",
  },
  {
    question:
      "Who can become a member of the technical club, and who can join our events?",
    answer:
      "ECE students can officially become members, while students from other branches are welcome to attend our events and workshops!",
  },
  {
    question: "How can I become a member of the technical club?",
    answer:
      "Simply fill out our membership form on the website. We welcome new members throughout the year, and the best part is there are no membership fees!",
  },
  {
    question: "Do I need prior experience to participate?",
    answer:
      "No prior experience is required! The club is beginner-friendly, though some workshops may need a basic understanding of the topic. Most importantly, anyone with an interest and passion for learning is encouraged to participate.",
  },
  {
    question: "How can I stay updated on club activities?",
    answer:
      "Follow us on our social media platforms and regularly check our website for updates on meetings, events, and workshops.",
  },
];

const Faq = () => {
  return (
    <section
      className="max-w-7xl mx-auto pb-10 text-base-content-black"
      id="faq"
    >
      <div className="px-4 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2 md:gap-24">
          {/* Image Section */}
          <div className="w-full rounded-2xl">
            <img
              alt="Image"
              className="object-cover rounded-2xl"
              src="/assets/images/undraw_questions_g2px.svg"
              loading="lazy"
            />
          </div>
          {/* FAQ Section */}
          <div className="w-full">
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-6">
                <p className="font-semibold tracking-widest text-primary uppercase">
                  FAQs
                </p>
                <h1 className="text-5xl mb-12 font-semibold text-base-content-black">
                  Frequently Asked Questions
                </h1>
              </div>
            </div>

            {/* FAQ Items */}
            <div className="-my-8 divide-y divide-neutral-black/50">
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                  <AccordionItem value={index.toString()} key={index}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
