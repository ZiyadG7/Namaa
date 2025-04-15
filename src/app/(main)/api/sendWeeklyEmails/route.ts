import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';
import { Resend } from 'resend';


// Initialize the Supabase client using environment variables.
// These variables must be set in your environment (e.g., .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize the Resend client using the API key from your environment.
const resendApiKey = process.env.RESEND_API_KEY!;
const resend = new Resend(resendApiKey);

/**
 * Helper function to build the HTML content for the email
 * using the user's stocks data.
 */

function createEmailContent(stocks: any[]): string {
  if (!stocks || stocks.length === 0) {
    return `<p>You are not following any stocks at the moment.</p>`;
  }

  // Define the table header and styles (with the updated columns).
  const tableHeader = `
    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th>Company Name</th>
          <th>Sector</th>
          <th>Latest Price (Date)</th>
          <th>Previous Price (Date)</th>
        </tr>
      </thead>
      <tbody>
  `;

  // Build each row of the table for each stock.
  const tableRows = stocks
    .map((stock: any) => {
      // Format prices with a dollar sign, or return 'N/A' if missing.
      const latestPrice = stock.latest_price ? `$${stock.latest_price}` : 'N/A';
      const latestDate = stock.latest_date ? new Date(stock.latest_date).toLocaleDateString() : 'N/A';
      const previousPrice = stock.previous_price ? `$${stock.previous_price}` : 'N/A';
      const previousDate = stock.previous_date ? new Date(stock.previous_date).toLocaleDateString() : 'N/A';

      return `
        <tr>
          <td>${stock.company_name}</td>
          <td>${stock.sector}</td>
          <td>${latestPrice} (on ${latestDate})</td>
          <td>${previousPrice} (on ${previousDate})</td>
        </tr>
      `;
    })
    .join('');

  // Close the table tag.
  const tableFooter = `
      </tbody>
    </table>
  `;

  // Return the complete HTML content.
  return `<p>Here is your weekly stock update:</p>${tableHeader}${tableRows}${tableFooter}`;
}


/**
 * POST handler for our API route.
 * This will:
 * - Call the Supabase RPC function 'get_user_stock_data'
 * - Iterate through each user record
 * - Build and send an email using Resend.
 */
export async function POST() {
  try {
    // Call the custom RPC function defined in Supabase.
    const { data, error } = await (await supabase).rpc('get_user_stock_data');
    if (error) {
      console.error('Error fetching user stock data:', error);
      return NextResponse.json(
        { error: 'Error fetching data from Supabase' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      console.log('No user data available to process.');
      return NextResponse.json({ message: 'No user data to process' });
    }

    // Loop through each record and send emails.
    for (const record of data) {
      const { email, stocks } = record; // 'stocks' is our aggregated JSON array.
      const emailHtml = createEmailContent(stocks);

      try {
        await resend.emails.send({
          from: 'Weekly-Update@bahamdan.info', // Replace with your verified sender email.
          // to: email,
          to: ["Fares.bahamdan@gmail.com"],
          subject: 'Your Weekly Stock Update',
          html: emailHtml,
        });
        console.log(`Email successfully sent to ${email}`);
      } catch (sendErr) {
        console.error(`Error sending email to ${email}:`, sendErr);
      }
    }

    return NextResponse.json({ message: 'Emails sent successfully' });
  } catch (err) {
    console.error('General error in processing weekly emails:', err);
    return NextResponse.json(
      { error: 'An error occurred while sending weekly emails' },
      { status: 500 }
    );
  }
}
