 
export default function stockid({ params }: { params: { name: string } }) {
  return <h1 className="text-center">The stock is {params.name}</h1>;
}
 