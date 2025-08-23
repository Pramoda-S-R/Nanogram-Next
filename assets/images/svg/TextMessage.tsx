import Image from "next/image";

export default function TextMessage() {
  return (
    <Image
      src="/assets/images/undraw_text-messages_978a.svg"
      alt="dude with a smartphone"
      width={400}
      height={400}
      className="md:w-1/2 h-1/2"
      priority={true}
    />
  );
}
