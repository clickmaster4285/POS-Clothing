
import CreateCustomer from '@/components/pos/customers/createCustomer'; // Modal wrapper for CreateCustomer


const CustomerModal = ({ isModal, onCustomerAdded, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-xl p-6 relative">

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black"
                >
                    ✕
                </button>

                <CreateCustomer
                    isModal={true}
                    onCustomerAdded={onCustomerAdded}
                    onClose={onClose}
                />
            </div>
        </div>
    );
};

export default CustomerModal;
