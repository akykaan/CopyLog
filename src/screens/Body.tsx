import CardItems from "./CardItems";

export default function Body() {
  return (
    <div className="p-4 mb-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700 hover:scrollbar-thumb-gray-400">
      <div className="space-y-3">
        <CardItems />
      </div>
    </div>
  );
}
