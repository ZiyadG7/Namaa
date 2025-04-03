import React from 'react'

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  return (
    <div>
      <h1>Details page {id}</h1>
    </div>
  );
};

export default Page;
