import { useEffect } from 'react';
import { X } from 'lucide-react';

interface RefundPolicyProps {
  onBack: () => void;
}

export function RefundPolicy({ onBack }: RefundPolicyProps) {
  // Handle escape key to go back
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onBack]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with close button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Refund Policy</h1>
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Policy Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="prose max-w-none">
            <p className="mb-4">You have 48 hours from the date of delivery to request a return.</p>
            
            <p className="mb-4">To be eligible for a return, your item must meet the following criteria:</p>
            
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>It must be in the same condition that you received it.</li>
              <li>It must be unworn or unused, with all original tags attached.</li>
              <li>It must be in its original packaging.</li>
              <li>You must provide a receipt or proof of purchase.</li>
            </ul>
            
            <h2 className="text-lg font-semibold mt-6 mb-3">How to Initiate a Return</h2>
            <p className="mb-4">
              To start a return, please contact us at <a href="mailto:info@threadtrends.in" className="text-blue-600 hover:underline">info@threadtrends.in</a>. 
              If your return request is accepted, we will send you a return shipping label along with detailed instructions 
              on how and where to send your package.
            </p>
            
            <p className="mb-4">
              Please note: Items sent back to us without first requesting a return will not be accepted.
            </p>
            
            <p className="mb-4">
              For any questions regarding returns, you can always contact us at <a href="mailto:info@threadtrends.in" className="text-blue-600 hover:underline">info@threadtrends.in</a>.
            </p>
            
            <h2 className="text-lg font-semibold mt-6 mb-3">Damages and Issues</h2>
            <p className="mb-4">
              We kindly ask that you inspect your order upon reception. Please contact us immediately if the item 
              is defective, damaged, or if you received the wrong item. This allows us to promptly evaluate the issue 
              and resolve it for you.
            </p>
            
            <h2 className="text-lg font-semibold mt-6 mb-3">Exceptions / Non-Returnable Items</h2>
            <p className="mb-4">
              Please be aware that we cannot accept returns on sale items.
            </p>
            
            <h2 className="text-lg font-semibold mt-6 mb-3">Exchanges</h2>
            <p className="mb-4">
              The most efficient way to exchange an item is to return the original product. Once the return has been 
              accepted, you may place a separate order for the new item.
            </p>
            
            <h2 className="text-lg font-semibold mt-6 mb-3">Refunds</h2>
            <p className="mb-4">
              We will notify you via email once we have received and inspected your return, and we will inform you 
              if the refund has been approved.
            </p>
            
            <p className="mb-4">
              If approved, your refund will be automatically processed to your original payment method within 10 
              business days. Please remember it can take additional time for your bank or credit card company to 
              process and post the refund to your account.
            </p>
            
            <p className="mb-4">
              If more than 15 business days have passed since your refund was approved, please contact us at 
              <a href="mailto:info@threadtrends.in" className="text-blue-600 hover:underline"> info@threadtrends.in</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}