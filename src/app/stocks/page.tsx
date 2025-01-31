// app/companies/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Company {
  id: string;
  name: string;
  marketCap: string;
  balance: string;
  price: string;
  change30D: string;
  change1Y: string;
  changeToday: string;
  category: 'followed' | 'notFollowed';
}

export default function CompaniesPage() {
  const router = useRouter();
  const [followed, setFollowed] = useState<Company[]>([]);
  const [notFollowed, setNotFollowed] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateMockData = (): Company[] => {
    return [
      {
        id: 'AAPL',
        name: 'Apple Inc.',
        marketCap: '$2.8T',
        balance: '$123B',
        price: '$185.92',
        change30D: '+5.2%',
        change1Y: '+22.1%',
        changeToday: '-0.5%',
        category: 'followed'
      },
      {
        id: 'GOOGL',
        name: 'Alphabet Inc.',
        marketCap: '$1.6T',
        balance: '$89B',
        price: '$135.45',
        change30D: '+3.1%',
        change1Y: '+18.4%',
        changeToday: '+1.2%',
        category: 'followed'
      },
      {
        id: 'MSFT',
        name: 'Microsoft Corporation',
        marketCap: '$2.3T',
        balance: '$104B',
        price: '$310.65',
        change30D: '+2.8%',
        change1Y: '+25.7%',
        changeToday: '-0.3%',
        category: 'notFollowed'
      },
      {
        id: 'AMZN',
        name: 'Amazon.com Inc.',
        marketCap: '$1.3T',
        balance: '$64B',
        price: '$128.45',
        change30D: '+6.7%',
        change1Y: '+35.2%',
        changeToday: '+2.1%',
        category: 'notFollowed'
      },
      {
        id: 'Company',
        name: 'company.com Inc.',
        marketCap: '$1.9T',
        balance: '$640B',
        price: '$178.25',
        change30D: '+9.7%',
        change1Y: '+39.6%',
        changeToday: '+0.1%',
        category: 'notFollowed'
      },
    ];
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const mockData = generateMockData();
        setFollowed(mockData.filter(stock => stock.category === 'followed'));
        setNotFollowed(mockData.filter(stock => stock.category === 'notFollowed'));
        setLoading(false);
      } catch (err) {
        setError('Failed to load mock data');
        setLoading(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleRowClick = (companyId: string) => {
    router.push(`/stocks/${companyId}`);
  };

  const renderTable = (stocks: Company[], title: string) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-blue-900 underline decoration-blue-100 decoration-2 underline-offset-8">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-slate-100">
            <tr>
              <th className= "px-6 py-3 text-left p-4 font-bold text-gray-500 tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left p-4 font-bold text-gray-500 tracking-wider">
                Market Cap
              </th>
              <th className="px-6 py-3 text-left p-4 font-bold text-gray-500 tracking-wider">
                Balance
              </th>
              <th className="px-6 py-3 text-left p-4 font-bold text-gray-500 tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left p-4 font-bold text-gray-500 tracking-wider">
                30D
              </th>
              <th className="px-6 py-3 text-left p-4 font-bold text-gray-500 tracking-wider">
                1Y
              </th>
              <th className="px-6 py-3 text-left p-4 font-bold text-gray-500 tracking-wider">
                Today
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stocks.map((company) => (
              <tr
                key={company.id}
                onClick={() => handleRowClick(company.id)}
                className="hover:bg-gray-200 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap font-medium">{company.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{company.marketCap}</td>
                <td className="px-6 py-4 whitespace-nowrap">{company.balance}</td>
                <td className="px-6 py-4 whitespace-nowrap">{company.price}</td>
                <td className={`px-6 py-4 whitespace-nowrap ${
                  company.change30D.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {company.change30D}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap ${
                  company.change1Y.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {company.change1Y}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap ${
                  company.changeToday.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {company.changeToday}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) return <div className="p-4 text-center text-blue-900">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="p-4">
      {renderTable(followed, "Followed Stocks")}
      {renderTable(notFollowed, "Stocks")}
    </div>
  );
}