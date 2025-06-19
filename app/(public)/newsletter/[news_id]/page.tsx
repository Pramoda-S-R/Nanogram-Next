import PDFViewer from "@/components/client/PDFViewer";

export const NewsLetterPage = async ({
  params,
}: {
  params: { news_id: string };
}) => {
  const { news_id } = params;

  return <PDFViewer />;
};
