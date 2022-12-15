import ShareA from "~/shares/shares/ShareA";
import ShareB from "~/shares/shares/ShareB";

export default function IndexPage() {
  return (
    <div className="flex w-full h-screen bg-blue-300/20">
      <h1 className="text-2xl m-auto">Hello World</h1>

      <ShareA />
      <ShareB />
    </div>
  )
}