// PDF Receipt Generator
// Uses browser's print-to-PDF functionality

/**
 * Generate and download PDF receipt
 */
export function downloadPDFReceipt(guest) {
  // Create a new window for PDF generation
  const printWindow = window.open('', '_blank', 'width=800,height=600')
  
  if (!printWindow) {
    alert('Please allow popups to download PDF receipts')
    return
  }
  const checkIn = new Date(guest.check_in)
  const checkOut = new Date(guest.check_out)
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
  
  // PDF-optimized CSS
  const pdfCSS = `
    @page {
      size: A4;
      margin: 20mm;
    }
    
    @media print {
      body {
        font-family: Arial, sans-serif;
        font-size: 12pt;
        line-height: 1.6;
        color: #000;
      }
      
      .receipt-container {
        max-width: 700px;
        margin: 0 auto;
      }
      
      .receipt-header {
        text-align: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 3px solid #333;
      }
      
      .hotel-name {
        font-size: 28pt;
        font-weight: bold;
        color: #2c5282;
        margin-bottom: 10px;
      }
      
      .hotel-info {
        font-size: 10pt;
        color: #666;
        margin: 5px 0;
      }
      
      .receipt-title {
        font-size: 20pt;
        font-weight: bold;
        text-align: center;
        margin: 20px 0;
        text-transform: uppercase;
      }
      
      .receipt-meta {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
        padding: 15px;
        background: #f7fafc;
        border-radius: 5px;
      }
      
      .section {
        margin-bottom: 25px;
      }
      
      .section-title {
        font-size: 14pt;
        font-weight: bold;
        color: #2c5282;
        margin-bottom: 15px;
        padding-bottom: 5px;
        border-bottom: 2px solid #e2e8f0;
      }
      
      .info-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #e2e8f0;
      }
      
      .info-label {
        font-weight: bold;
        color: #4a5568;
      }
      
      .info-value {
        color: #1a202c;
      }
      
      .receipt-footer {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 3px solid #333;
        text-align: center;
      }
      
      .footer-message {
        font-size: 11pt;
        color: #2c5282;
        font-weight: bold;
        margin-bottom: 10px;
      }
      
      .footer-note {
        font-size: 9pt;
        color: #666;
      }
      
      .status-badge {
        display: inline-block;
        padding: 5px 15px;
        border-radius: 20px;
        font-weight: bold;
        text-transform: uppercase;
      }
      
      .status-active {
        background: #c6f6d5;
        color: #22543d;
      }
      
      .status-checked-out {
        background: #bee3f8;
        color: #2c5282;
      }
      
      .status-removed {
        background: #fed7d7;
        color: #742a2a;
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
      <style>${pdfCSS}</style>
    </head>
    <body>
      <div class="receipt-container">
        <div class="receipt-header">
          <div class="hotel-name">SMART HOTEL</div>
          <div class="hotel-info">Community 6, SOS Road, Tema, Ghana</div>
          <div class="hotel-info">Phone: +233 30 321 7656 / +233 30 331 9430 / +233 248 724 661</div>
          <div class="hotel-info">Email: Smarthotel24@gmail.com</div>
        </div>
        
        <div class="receipt-title">Guest Receipt</div>
        
        <div class="receipt-meta">
          <div>
            <strong>Receipt #:</strong> ${guest.id}
          </div>
          <div>
            <strong>Date:</strong> ${new Date(guest.created_at).toLocaleDateString()}
          </div>
          <div>
            <strong>Time:</strong> ${new Date(guest.created_at).toLocaleTimeString()}
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Guest Information</div>
          <div class="info-row">
            <span class="info-label">Full Name:</span>
            <span class="info-value">${guest.name}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Phone Number:</span>
            <span class="info-value">${guest.phone}</span>
          </div>
          ${guest.email ? `
          <div class="info-row">
            <span class="info-label">Email Address:</span>
            <span class="info-value">${guest.email}</span>
          </div>
          ` : ''}
        </div>
        
        <div class="section">
          <div class="section-title">Accommodation Details</div>
          <div class="info-row">
            <span class="info-label">Room Type:</span>
            <span class="info-value">${guest.room_name}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Check-in Date:</span>
            <span class="info-value">${checkIn.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Check-out Date:</span>
            <span class="info-value">${checkOut.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Number of Nights:</span>
            <span class="info-value">${nights}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Number of Guests:</span>
            <span class="info-value">${guest.guests}</span>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Services & Amenities</div>
          <div class="info-row">
            <span class="info-label">Breakfast Included:</span>
            <span class="info-value">${guest.breakfast ? 'Yes' : 'No'}</span>
          </div>
          ${guest.extra_breakfast > 0 ? `
          <div class="info-row">
            <span class="info-label">Extra Breakfast Orders:</span>
            <span class="info-value">${guest.extra_breakfast} order${guest.extra_breakfast > 1 ? 's' : ''}</span>
          </div>
          ` : ''}
          <div class="info-row">
            <span class="info-label">Laundry Service:</span>
            <span class="info-value">${guest.laundry ? 'Yes' : 'No'}</span>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Booking Information</div>
          <div class="info-row">
            <span class="info-label">Status:</span>
            <span class="info-value">
              <span class="status-badge status-${guest.status}">${guest.status.toUpperCase()}</span>
            </span>
          </div>
          <div class="info-row">
            <span class="info-label">Processed By:</span>
            <span class="info-value">${guest.added_by}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Booking Date:</span>
            <span class="info-value">${new Date(guest.created_at).toLocaleString()}</span>
          </div>
        </div>
        
        <div class="receipt-footer">
          <div class="footer-message">Thank you for choosing Smart Hotel!</div>
          <div class="footer-note">True serenity for smart people. We hope you enjoyed your stay and look forward to welcoming you again.</div>
          <div class="footer-note" style="margin-top: 20px;">
            This is a computer-generated receipt and does not require a signature.
          </div>
        </div>
      </div>
    </body>
    </html>
  `
  
  printWindow.document.open()
  printWindow.document.write(receiptHTML)
  printWindow.document.close()
  
  // Wait for content to load, then trigger print to PDF
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.focus()
      printWindow.print()
      // Window will close after print dialog is dismissed
      setTimeout(() => {
        printWindow.close()
      }, 100)
    }, 250)
  }
}

/**
 * Check if PDF generation is supported
 */
export function isPDFSupported() {
  return 'print' in window
}
