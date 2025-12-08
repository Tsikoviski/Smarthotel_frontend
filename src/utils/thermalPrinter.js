// Thermal Receipt Printer Utility for POS systems

/**
 * Print receipt to thermal printer
 * This uses the browser's print API with thermal printer-specific formatting
 */
export function printThermalReceipt(guest) {
  const checkIn = new Date(guest.check_in)
  const checkOut = new Date(guest.check_out)
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
  
  // Create a hidden iframe for printing
  const printFrame = document.createElement('iframe')
  printFrame.style.position = 'absolute'
  printFrame.style.width = '0'
  printFrame.style.height = '0'
  printFrame.style.border = 'none'
  
  document.body.appendChild(printFrame)
  
  const printDocument = printFrame.contentWindow.document
  
  // Thermal printer CSS (58mm or 80mm paper width)
  const thermalCSS = `
    @page {
      size: 80mm auto;
      margin: 0;
    }
    
    @media print {
      body {
        width: 80mm;
        margin: 0;
        padding: 5mm;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        line-height: 1.4;
      }
      
      .receipt-header {
        text-align: center;
        margin-bottom: 10px;
        border-bottom: 2px dashed #000;
        padding-bottom: 10px;
      }
      
      .receipt-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 5px;
      }
      
      .receipt-subtitle {
        font-size: 10px;
        margin-bottom: 2px;
      }
      
      .receipt-section {
        margin: 10px 0;
        border-bottom: 1px dashed #000;
        padding-bottom: 10px;
      }
      
      .receipt-row {
        display: flex;
        justify-content: space-between;
        margin: 3px 0;
      }
      
      .receipt-label {
        font-weight: bold;
      }
      
      .receipt-footer {
        text-align: center;
        margin-top: 10px;
        font-size: 10px;
      }
      
      .receipt-barcode {
        text-align: center;
        font-size: 24px;
        letter-spacing: 2px;
        margin: 10px 0;
      }
    }
  `
  
  // Build receipt HTML
  const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Receipt - ${guest.name}</title>
      <style>${thermalCSS}</style>
    </head>
    <body>
      <div class="receipt-header">
        <div class="receipt-title">SMART HOTEL</div>
        <div class="receipt-subtitle">Community 6, SOS Road, Tema</div>
        <div class="receipt-subtitle">+233 30 321 7656 / +233 248 724 661</div>
        <div class="receipt-subtitle">Smarthotel24@gmail.com</div>
      </div>
      
      <div class="receipt-section">
        <div class="receipt-row">
          <span class="receipt-label">Receipt #:</span>
          <span>${guest.id}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Date:</span>
          <span>${new Date(guest.created_at).toLocaleString()}</span>
        </div>
      </div>
      
      <div class="receipt-section">
        <div style="font-weight: bold; margin-bottom: 5px;">GUEST INFORMATION</div>
        <div class="receipt-row">
          <span class="receipt-label">Name:</span>
          <span>${guest.name}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Phone:</span>
          <span>${guest.phone}</span>
        </div>
        ${guest.email ? `
        <div class="receipt-row">
          <span class="receipt-label">Email:</span>
          <span>${guest.email}</span>
        </div>
        ` : ''}
      </div>
      
      <div class="receipt-section">
        <div style="font-weight: bold; margin-bottom: 5px;">STAY DETAILS</div>
        <div class="receipt-row">
          <span class="receipt-label">Room:</span>
          <span>${guest.room_name}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Check-in:</span>
          <span>${checkIn.toLocaleDateString()}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Check-out:</span>
          <span>${checkOut.toLocaleDateString()}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Nights:</span>
          <span>${nights}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Guests:</span>
          <span>${guest.guests}</span>
        </div>
      </div>
      
      <div class="receipt-section">
        <div style="font-weight: bold; margin-bottom: 5px;">SERVICES</div>
        <div class="receipt-row">
          <span class="receipt-label">Breakfast:</span>
          <span>${guest.breakfast ? 'Included' : 'Not included'}</span>
        </div>
        ${guest.extra_breakfast > 0 ? `
        <div class="receipt-row">
          <span class="receipt-label">Extra Breakfast:</span>
          <span>${guest.extra_breakfast} orders</span>
        </div>
        ` : ''}
        <div class="receipt-row">
          <span class="receipt-label">Laundry:</span>
          <span>${guest.laundry ? 'Yes' : 'No'}</span>
        </div>
      </div>
      
      <div class="receipt-section">
        <div class="receipt-row">
          <span class="receipt-label">Status:</span>
          <span style="text-transform: uppercase;">${guest.status}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Added by:</span>
          <span>${guest.added_by}</span>
        </div>
      </div>
      
      <div class="receipt-footer">
        <div style="margin-bottom: 5px;">Thank you for choosing Smart Hotel!</div>
        <div>True serenity for smart people.</div>
      </div>
    </body>
    </html>
  `
  
  printDocument.open()
  printDocument.write(receiptHTML)
  printDocument.close()
  
  // Wait for content to load, then print
  printFrame.contentWindow.onload = () => {
    setTimeout(() => {
      printFrame.contentWindow.print()
      
      // Remove iframe after printing
      setTimeout(() => {
        document.body.removeChild(printFrame)
      }, 1000)
    }, 250)
  }
}

/**
 * Check if thermal printer is available
 * This is a basic check - actual printer detection requires more complex logic
 */
export function isThermalPrinterAvailable() {
  return 'print' in window
}

/**
 * Print multiple receipts (batch printing)
 */
export function printMultipleReceipts(guests) {
  guests.forEach((guest, index) => {
    setTimeout(() => {
      printThermalReceipt(guest)
    }, index * 2000) // 2 second delay between prints
  })
}
