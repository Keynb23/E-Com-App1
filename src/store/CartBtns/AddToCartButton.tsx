import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import { ShoppingCart, CheckCircle, AlertTriangle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../../store/cartSlice'; // Adjust the path if needed
import cn from 'classnames';

interface AddToCartButtonProps {
    product: { 
        id: number;
        title: string;
        price: number;
        image: string;
    };
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1); 
    const [status, setStatus] = useState<'idle' | 'adding' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleAddToCart = async () => {
        setStatus('adding');
        setMessage('Adding to cart...');

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            dispatch(addItemToCart({ ...product, quantity })); 
            setStatus('success');
            setMessage(`${product.title} added to cart!`);
            setTimeout(() => {
                setStatus('idle');
                setMessage('');
            }, 3000);

        } catch {
            setStatus('error');
            setMessage('Failed to add to cart.');
            setTimeout(() => {
                setStatus('idle');
                setMessage('');
            }, 3000);
        }
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    -
                </Button>
                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || 1)}
                    className="w-16 text-center border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400"
                    aria-label="Quantity"
                />
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    +
                </Button>
            </div>

            <Button
                onClick={handleAddToCart}
                disabled={status === 'adding'}
                className={cn(
                    "flex items-center gap-2",
                    "bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200",
                    status === 'adding' && 'opacity-70 cursor-not-allowed',
                    status === 'success' && 'bg-green-500 hover:bg-green-600',
                    status === 'error' && 'bg-red-500 hover:bg-red-600',
                )}
            >
                {status === 'idle' && <ShoppingCart className="w-5 h-5" />}
                {status === 'adding' && <ShoppingCart className="w-5 h-5 animate-spin" />}
                {status === 'success' && <CheckCircle className="w-5 h-5" />}
                {status === 'error' && <AlertTriangle className="w-5 h-5" />}
                {status === 'idle' && 'Add to Cart'}
                {status === 'adding' && 'Adding...'}
                {status === 'success' && 'Added!'}
                {status === 'error' && 'Error'}
            </Button>

            {message && (
                <div
                    className={cn(
                        "text-sm transition-colors duration-300",
                        status === 'success' && 'text-green-500',
                        status === 'error' && 'text-red-500',
                        status === 'adding' && 'text-blue-500'
                    )}
                >
                    {message}
                </div>
            )}
        </div>
    );
};

export default AddToCartButton;
