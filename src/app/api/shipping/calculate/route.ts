import { NextResponse } from 'next/server';
import { Shippo } from 'shippo';

/**
 * Calculate shipping rates for checkout
 * Returns real-time shipping costs from Shippo with markup applied
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { shippingAddress, items } = body;

    if (!shippingAddress || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Shipping address and items are required' },
        { status: 400 }
      );
    }

    // Validate Shippo API key
    const shippoApiKey = process.env.SHIPPO_API_KEY;
    if (!shippoApiKey) {
      return NextResponse.json(
        { error: 'Shipping service not configured' },
        { status: 500 }
      );
    }

    // Get business address from environment variables
    const fromAddress = {
      name: process.env.SHIPPO_FROM_NAME || 'Creativity by Lily',
      street1: process.env.SHIPPO_FROM_STREET || '',
      city: process.env.SHIPPO_FROM_CITY || '',
      state: process.env.SHIPPO_FROM_STATE || '',
      zip: process.env.SHIPPO_FROM_ZIP || '',
      country: process.env.SHIPPO_FROM_COUNTRY || 'US',
    };

    // Prepare to address
    const cleanZip = (shippingAddress.zip || '').replace(/[^0-9-]/g, '').substring(0, 10);
    const cleanState = (shippingAddress.state || '').trim().substring(0, 2).toUpperCase();
    
    const toAddress = {
      name: `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim() || 'Customer',
      street1: (shippingAddress.address || '').trim(),
      street2: (shippingAddress.address2 || '').trim() || undefined,
      city: (shippingAddress.city || '').trim(),
      state: cleanState,
      zip: cleanZip,
      country: (shippingAddress.country || 'US').toUpperCase().substring(0, 2),
    };

    // Remove empty optional fields
    if (!toAddress.street2) {
      delete toAddress.street2;
    }

    // Calculate package weight
    const itemCount = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
    const weightOz = Math.max(8, itemCount * 16); // Minimum 8 oz, 1 lb per item

    // Parcel dimensions
    const parcel = {
      length: (process.env.SHIPPO_PARCEL_LENGTH || '8'),
      width: (process.env.SHIPPO_PARCEL_WIDTH || '6'),
      height: (process.env.SHIPPO_PARCEL_HEIGHT || '4'),
      distanceUnit: 'in',
      weight: weightOz.toString(),
      massUnit: 'oz',
    };

    // Initialize Shippo client
    const shippo = new Shippo({ apiKeyHeader: shippoApiKey });

    // Create shipment to get rates
    const shipment = await shippo.shipments.create({
      addressFrom: fromAddress,
      addressTo: toAddress,
      parcels: [parcel],
      async: false,
    });

    if (!shipment || shipment.status === 'ERROR') {
      const errorMessage = shipment?.messages?.[0]?.text || 'Failed to calculate shipping rates';
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    // Get available rates
    if (!shipment.rates || shipment.rates.length === 0) {
      return NextResponse.json(
        { error: 'No shipping rates available for this address' },
        { status: 400 }
      );
    }

    // Filter to prefer USPS
    const allValidRates = shipment.rates.filter((rate: any) => rate.amount && parseFloat(rate.amount) > 0);
    const uspsRates = allValidRates.filter((rate: any) => {
      const provider = (rate.provider || '').toLowerCase();
      return provider === 'usps';
    });

    // Select cheapest USPS rate, or fallback to cheapest overall
    const ratesToUse = uspsRates.length > 0 ? uspsRates : allValidRates;
    ratesToUse.sort((a: any, b: any) => parseFloat(a.amount) - parseFloat(b.amount));
    const selectedRate = ratesToUse[0];

    if (!selectedRate) {
      return NextResponse.json(
        { error: 'No valid shipping rates found' },
        { status: 400 }
      );
    }

    // Calculate shipping cost with markup
    const baseShippingCost = parseFloat(selectedRate.amount);
    const markupAmount = parseFloat(process.env.SHIPPO_SHIPPING_MARKUP || '2.50'); // Default $2.50 markup
    const finalShippingCost = baseShippingCost + markupAmount;

    return NextResponse.json({
      success: true,
      shippingCost: parseFloat(finalShippingCost.toFixed(2)),
      baseCost: baseShippingCost,
      markup: markupAmount,
      carrier: selectedRate.provider,
      serviceLevel: selectedRate.servicelevel?.name || selectedRate.serviceLevel?.name || selectedRate.servicelevel?.token || selectedRate.serviceLevel?.token,
      estimatedDays: selectedRate.estimatedDays || selectedRate.estimated_days || null,
    });
  } catch (error: any) {
    console.error('Error calculating shipping:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate shipping rates' },
      { status: 500 }
    );
  }
}







