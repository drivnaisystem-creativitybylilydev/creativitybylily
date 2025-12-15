import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * Generate a professional USPS-style shipping label
 * 
 * Creates a 4x6 inch label compatible with Rollo thermal printers
 * Format matches USPS Priority Mail label style
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const trackingNumber = searchParams.get('tracking');

    const supabase = createAdminClient();

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('id', id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const shippingAddress = order.shipping_address as any;
    const tracking = trackingNumber || order.tracking_number || 'TRACKING PENDING';
    
    // Calculate package weight (estimate)
    const itemCount = (order.order_items as any[])?.length || 1;
    const estimatedWeight = Math.max(0.5, itemCount * 0.5);

    // Business address (from address) - configure this in environment variables or admin settings
    const businessAddress = {
      name: 'Creativity by Lily',
      street: process.env.BUSINESS_STREET || 'Your Business Address',
      city: process.env.BUSINESS_CITY || 'Cape Cod',
      state: process.env.BUSINESS_STATE || 'MA',
      zip: process.env.BUSINESS_ZIP || '02601',
    };

    // Generate professional USPS-style label HTML
    const labelHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: 4in 6in;
      margin: 0;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      width: 4in;
      height: 6in;
      font-family: Arial, sans-serif;
      font-size: 9pt;
      margin: 0;
      padding: 0;
      background: white;
      overflow: hidden;
    }
    
    /* Top Section */
    .top-section {
      border-bottom: 4px solid #000;
      padding: 0.08in 0.1in;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      min-height: 0.85in;
    }
    
    .service-info {
      flex: 1;
    }
    
    .service-label {
      font-size: 8pt;
      font-weight: bold;
      margin-bottom: 0.02in;
    }
    
    .service-details {
      font-size: 7pt;
      line-height: 1.2;
    }
    
    .data-matrix {
      width: 0.5in;
      height: 0.5in;
      margin-left: 0.1in;
    }
    
    .top-right {
      text-align: right;
      font-size: 7pt;
      font-weight: bold;
    }
    
    /* Middle Section */
    .middle-section {
      padding: 0.12in 0.1in;
      border-bottom: 4px solid #000;
      min-height: 2.3in;
    }
    
    .mail-service {
      font-size: 20pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 0.12in;
      text-align: center;
      font-family: Arial, sans-serif;
    }
    
    .mail-service::after {
      content: '™';
      font-size: 12pt;
      vertical-align: super;
    }
    
    .address-container {
      display: flex;
      justify-content: space-between;
      gap: 0.2in;
    }
    
    .address-block {
      flex: 1;
    }
    
    .address-label {
      font-size: 8pt;
      font-weight: bold;
      margin-bottom: 0.05in;
      text-transform: uppercase;
    }
    
    .address {
      font-size: 10pt;
      line-height: 1.4;
      font-weight: normal;
    }
    
    .address-name {
      font-weight: bold;
      font-size: 11pt;
      margin-bottom: 0.02in;
    }
    
    .zone-number {
      font-size: 24pt;
      font-weight: bold;
      text-align: center;
      margin-top: 0.1in;
    }
    
    /* Bottom Section */
    .bottom-section {
      padding: 0.1in;
      text-align: center;
    }
    
    .tracking-label {
      font-size: 9pt;
      font-weight: bold;
      margin-bottom: 0.05in;
      text-transform: uppercase;
    }
    
    .barcode-container {
      margin: 0.05in 0;
      text-align: center;
    }
    
    .barcode-image {
      max-width: 100%;
      height: auto;
      image-rendering: crisp-edges;
    }
    
    .tracking-number {
      font-size: 14pt;
      font-weight: bold;
      letter-spacing: 1px;
      margin-top: 0.05in;
      font-family: 'Courier New', monospace;
    }
    
    .do-not-ship {
      font-size: 10pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-top: 0.1in;
      color: #000;
    }
    
    #barcode {
      width: 100%;
      height: 0.6in;
    }
    
    #dataMatrix {
      width: 0.55in;
      height: 0.55in;
      border: 2px solid #000;
      background: white;
      position: relative;
    }
    
    #dataMatrix::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        repeating-linear-gradient(0deg, transparent, transparent 6px, #000 6px, #000 7px),
        repeating-linear-gradient(90deg, transparent, transparent 6px, #000 6px, #000 7px);
      background-size: 100% 100%;
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
  <script>
    window.onload = function() {
      // Generate CODE128 barcode
      const tracking = '${tracking}';
      if (tracking && tracking !== 'TRACKING PENDING') {
        JsBarcode('#barcode', tracking, {
          format: 'CODE128',
          width: 2,
          height: 60,
          displayValue: false,
          margin: 0,
        });
      }
    };
  </script>
</head>
<body>
  <!-- Top Section -->
  <div class="top-section">
    <div style="display: flex; align-items: flex-start; gap: 0.1in; flex: 1;">
      <div style="font-size: 36pt; font-weight: bold; line-height: 1;">P</div>
      <div class="service-info">
        <div class="service-label">SAMPLE LABEL</div>
        <div class="service-details">
          ${estimatedWeight.toFixed(1)} LB PRIORITY MAIL RATE<br>
          ZONE 4 NO SURCHARGE<br>
          COMMERCIAL PLUS PRICING
        </div>
      </div>
    </div>
    <div class="data-matrix" id="dataMatrix"></div>
    <div class="top-right">
      ${order.order_number}<br>
      7689597<br>
      FROM ${businessAddress.zip}
    </div>
  </div>
  
  <!-- Middle Section -->
  <div class="middle-section">
    <div class="mail-service">PRIORITY MAIL 2-DAY</div>
    
    <div class="address-container">
      <div class="address-block">
        <div class="address-name">
          ${shippingAddress?.firstName || ''} ${shippingAddress?.lastName || ''}
        </div>
        <div class="address">
          ${shippingAddress?.address || ''}<br>
          ${shippingAddress?.address2 ? shippingAddress.address2 + '<br>' : ''}
          ${shippingAddress?.city || ''} ${shippingAddress?.state || ''} ${shippingAddress?.zip || ''}
        </div>
      </div>
      
      <div class="zone-number">99</div>
      
      <div class="address-block">
        <div class="address-label">
          <span style="font-weight: bold;">SHIP</span><br>
          <span style="font-weight: bold;">TO:</span>
        </div>
        <div class="address-name" style="color: #d00; font-size: 10pt; margin-top: 0.05in;">DO NOT SHIP</div>
        <div class="address" style="margin-top: 0.05in;">
          ${businessAddress.street}<br>
          ${businessAddress.city} ${businessAddress.state} ${businessAddress.zip}
        </div>
      </div>
    </div>
  </div>
  
  <!-- Bottom Section -->
  <div class="bottom-section">
    <div class="tracking-label">USPS TRACKING #</div>
    <div class="barcode-container">
      <svg id="barcode"></svg>
    </div>
    <div class="tracking-number">${tracking}</div>
    <div class="do-not-ship">DO NOT SHIP</div>
  </div>
</body>
</html>
    `;

    return new NextResponse(labelHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="label-${order.order_number}.html"`,
      },
    });
  } catch (error: any) {
    console.error('Error generating label PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate label PDF' },
      { status: 500 }
    );
  }
}

