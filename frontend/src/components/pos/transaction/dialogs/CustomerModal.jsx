
import CreateCustomer from '@/components/pos/customers/createCustomer'; // Modal wrapper for CreateCustomer
import { Check } from 'lucide-react';
import { useState } from 'react';


const CustomerModal = ({ isModal, onCustomerAdded, onClose }) => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [newCustomer, setNewCustomer] = useState(null);

    const handleCustomerAdded = (customer) => {
        setNewCustomer(customer);
        setShowSuccess(true);

        // Option 1: Close immediately and pass customer up
        onCustomerAdded?.(customer);
        onClose?.();

        // Option 2: Show success then close after delay
        // setTimeout(() => {
        //     onClose?.();
        // }, 2000);
    };

    if (showSuccess) {
        // You can show a success message within the modal
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white w-[400px] rounded-xl p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <Check className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Customer Added Successfully!</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        {newCustomer?.firstName} {newCustomer?.lastName} has been added.
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full bg-primary text-white py-2 rounded-lg"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-xl p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black"
                >
                    ✕
                </button>
                <CreateCustomer
                    isModal={true}
                    onCustomerAdded={handleCustomerAdded}
                    onClose={onClose}
                />
            </div>
        </div>
    );
};
export default CustomerModal;
