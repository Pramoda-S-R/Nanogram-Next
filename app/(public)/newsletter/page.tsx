import React from "react";
import Link from "next/link";
import { getAllNewsletters } from "@/app/actions/api";
import PDFPage from "@/components/client/shared/PDFPage";
import { formatDate } from "@/utils";

const Newsletter = async () => {
  const newsletters = await getAllNewsletters();
  // Get the first newsletter to display as a featured item
  const featuredNewsletter = newsletters?.[0];

  // remove the first newsletter from the list to avoid duplication
  newsletters.shift();

  if (!newsletters) {
    return (
      <div className="w-full h-dvh flex items-center justify-center">
        <h2 className="text-2xl">No newsletters available at the moment.</h2>
      </div>
    );
  }
  return (
    <div className="w-full min-h-dvh bg-base-100">
      <div className="w-full flex justify-center font-serif items-center mt-4">
        <h1 className="text-7xl text-center">NANO THREADS</h1>
      </div>
      <div className="w-full flex justify-center items-center my-4">
        <div className="card md:card-side flex md:flex-row flex-col md:h-[18.14rem] bg-base-200 shadow-xl">
          <figure className="md:w-56 w-96 h-full">
            <PDFPage width={56} url={featuredNewsletter.fileUrl} />
          </figure>
          <div className="card-body w-96">
            <h2 className="card-title">{featuredNewsletter.title}</h2>
            <p className="text-xs text-base-content/50">
              {formatDate(
                featuredNewsletter.publishedAt.toString(),
                "MMMM DD, YYYY"
              )}
            </p>
            <p>{featuredNewsletter.description}</p>
            <div className="card-actions justify-end">
              <Link
                href={`/newsletter/${featuredNewsletter.route}`}
                className="btn btn-primary"
              >
                Read
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="divider"></div>
      <div className="block gap-4 p-4">
        {newsletters.map((newsletter) => (
          <div
            key={newsletter._id.toString()}
            className="card w-96 bg-base-200 shadow-xl p-4"
          >
            <div className="card-body">
              <h2 className="card-title">{newsletter.title}</h2>
              <p className="text-xs text-base-content/50">
                {formatDate(newsletter.publishedAt.toString(), "MMMM DD, YYYY")}
              </p>
              <p className="">{newsletter.description}</p>
              <div className="card-actions justify-end">
                <Link
                  href={`/newsletter/${newsletter.route}`}
                  className="btn btn-primary"
                >
                  Read
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Newsletter;
