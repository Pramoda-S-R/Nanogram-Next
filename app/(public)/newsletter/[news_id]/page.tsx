import { getNewsletterByRoute } from "@/app/actions/api";
import PDFViewer from "@/components/client/PDFViewer";

export default async function NewsPaperPage({
  params,
}: {
  params: Promise<{ news_id: string }>;
}) {
  const { news_id: route } = await params;
  console.log("route: ", route);
  const paper = await getNewsletterByRoute(route);

  if (!paper) {
    return (
      <div className="w-full h-dvh flex items-center justify-center">
        <h2 className="text-2xl">Newsletter not found.</h2>
      </div>
    );
  }

  return <PDFViewer pdfUrl={paper.fileUrl} />;
}
