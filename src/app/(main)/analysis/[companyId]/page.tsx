import React from 'react'

const Page = async ({ params }: { params: { companyId: string } }) => {
  const { companyId } = params;

  return (
    <div>
      <h1>Details page {companyId}</h1>
    </div>
  );
};

export default Page;