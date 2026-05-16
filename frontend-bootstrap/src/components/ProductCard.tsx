import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { ProductDTO } from '../types';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
  product: ProductDTO;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { t } = useTranslation();
  const getFirstImage = (): string => {
    if (product.details && product.details.length > 0) {
      return product.details[0].imageDetail || 'https://via.placeholder.com/300x200?text=Laptop';
    }
    return 'https://via.placeholder.com/300x200?text=Laptop';
  };

  const getLowestPrice = (): number => {
    if (product.details && product.details.length > 0) {
      return Math.min(...product.details.map((d) => d.price));
    }
    return 0;
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div
      className="card-product animate-fade-in-up"
      style={{ animationDelay: `${index * 0.08}s`, opacity: 0 }}
    >
      <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="card-image" style={{ height: 200, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={getFirstImage()}
            alt={product.productName}
            style={{ height: '100%', width: '100%', objectFit: 'contain', padding: 16 }}
          />
        </div>
        <div style={{ padding: '20px 20px 16px' }}>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="badge-modern badge-primary">{product.categoryName}</span>
            <span className="badge-modern badge-success">{product.details?.length || 0} variants</span>
            {/* Discount badge - placeholder for when discounts are integrated with products */}
            {/* <span className="badge-modern badge-danger">-15%</span> */}
          </div>
          <h5 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 8, lineHeight: 1.4, minHeight: 44 }}>
            {product.productName}
          </h5>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.productDescription || t('public.noProducts')}
          </p>
          <div className="d-flex align-items-center justify-content-between">
            <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary)', fontFamily: "'Poppins', sans-serif" }}>
              {formatPrice(getLowestPrice())}
            </span>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                transition: 'all 0.2s',
              }}
              className="cart-icon-hover"
            >
              <ShoppingCart size={16} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
