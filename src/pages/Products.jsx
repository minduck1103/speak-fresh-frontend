import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Pagination, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import cartService from '../services/cartService';
import productTranslationService from '../services/productTranslationService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import bannerBg from '../assets/banner-bg.jpg';

const Products = () => {
    const { t, i18n } = useTranslation();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('name-asc');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;

    // Update translation service when language changes
    useEffect(() => {
        productTranslationService.setLanguage(i18n.language);
    }, [i18n.language]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const [productsResponse, categoriesResponse] = await Promise.all([
                productService.getProducts(),
                categoryService.getCategories()
            ]);
            setProducts(productsResponse.data || []);
            setCategories(categoriesResponse.data || []);
            setError(null);
        } catch (err) {
            setError(t('messages.error', { ns: 'pages' }));
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (product) => {
        try {
            cartService.addToCart(product);
            toast.success(t('messages.add_to_cart_success', { ns: 'pages' }));
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (err) {
            toast.error(t('messages.add_to_cart_error', { ns: 'pages' }));
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Filter and sort products
    const filteredProducts = products
        .filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedCategory === 'all' || product.category === selectedCategory)
        )
        .filter(product => {
            if (minPrice && product.price < Number(minPrice)) return false;
            if (maxPrice && product.price > Number(maxPrice)) return false;
            return true;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                default:
                    return a.name.localeCompare(b.name);
            }
        });

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSortBy('name-asc');
        setMinPrice('');
        setMaxPrice('');
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-b from-green-50 to-white min-h-screen py-8 pt-24">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">{t('messages.loading', { ns: 'pages' })}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gradient-to-b from-green-50 to-white min-h-screen py-8 pt-24">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-center min-h-[60vh]">
                    <div className="text-center text-red-500">
                        <p>{error}</p>
                        <button
                            onClick={fetchProducts}
                            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                            {t('buttons.retry', { ns: 'common' })}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-green-50 to-white min-h-screen py-8 pt-24">
            {/* Banner */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="relative mb-10 rounded-3xl overflow-hidden shadow-lg">
                    <img
                        src={bannerBg}
                        alt="Products Banner"
                        className="w-full h-48 md:h-72 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/30 to-black/60 flex flex-col items-end justify-end text-white p-6 md:p-10">
                        <h1 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg text-right max-w-lg font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {t('products.banner_title', { ns: 'pages' })}
                        </h1>
                        <p className="text-base md:text-xl font-medium drop-shadow text-right max-w-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            {t('products.banner_subtitle', { ns: 'pages' })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="md:w-1/4 w-full">
                        <div className="bg-white rounded-2xl shadow p-6 mb-6 border border-green-100">
                            <h3 className="text-xl font-bold text-green-700 mb-4">{t('products.filter', { ns: 'pages' })}</h3>
                            <div className="mb-4">
                                <label className="block text-green-700 font-semibold mb-1">{t('products.category', { ns: 'pages' })}</label>
                                <select
                                    value={selectedCategory}
                                    onChange={e => setSelectedCategory(e.target.value)}
                                    className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                                >
                                    <option value="all">{t('products.all_categories', { ns: 'pages' })}</option>
                                    {categories.map(category => (
                                        <option key={category._id} value={category._id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-green-700 font-semibold mb-1">{t('products.price_range', { ns: 'pages' })}</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder={t('products.price_from', { ns: 'pages' })}
                                        value={minPrice}
                                        onChange={e => setMinPrice(e.target.value)}
                                        className="w-1/2 border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
                                    />
                                    <input
                                        type="number"
                                        placeholder={t('products.price_to', { ns: 'pages' })}
                                        value={maxPrice}
                                        onChange={e => setMaxPrice(e.target.value)}
                                        className="w-1/2 border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
                                    />
                                </div>
                            </div>
                            <button
                                className="w-full mt-2 py-2 rounded-lg bg-gray-200 text-green-700 font-bold hover:bg-green-100 transition-colors"
                                onClick={handleClearFilters}
                            >
                                {t('products.clear_filters', { ns: 'pages' })}
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="md:w-3/4 w-full">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <span className="inline-block w-2 h-8 bg-green-500 rounded-full"></span>
                                <h2 className="text-2xl md:text-3xl font-extrabold text-green-600 tracking-tight drop-shadow-sm" style={{letterSpacing: '0.01em'}}>{t('products.title', { ns: 'pages' })}</h2>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <input
                                    type="text"
                                    placeholder={t('products.search_placeholder', { ns: 'pages' })}
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="flex-1 border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                                />
                                <select
                                    value={sortBy}
                                    onChange={e => setSortBy(e.target.value)}
                                    className="border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                                >
                                    <option value="name-asc">{t('products.sort_options.name_a_z', { ns: 'pages' })}</option>
                                    <option value="name-desc">{t('products.sort_options.name_z_a', { ns: 'pages' })}</option>
                                    <option value="price-asc">{t('products.sort_options.price_low_high', { ns: 'pages' })}</option>
                                    <option value="price-desc">{t('products.sort_options.price_high_low', { ns: 'pages' })}</option>
                                </select>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {currentProducts.length === 0 ? (
                            <div className="text-center py-10">
                                <h4 className="text-gray-400">{t('products.no_products', { ns: 'pages' })}</h4>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {currentProducts.map(product => (
                                    <Link to={`/products/${product._id}`} key={product._id} className="group block no-underline">
                                        <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden h-full flex flex-col transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl no-underline" style={{minHeight: 320, maxHeight: 340}}>
                                            <div className="relative">
                                                <img
                                                    src={product.image || (product.images && (product.images[0]?.url || product.images[0])) || '/no-image.png'}
                                                    alt={productTranslationService.translateProductName(product.name)}
                                                    className="w-full h-40 object-contain group-hover:scale-105 transition-transform duration-200 no-underline"
                                                />
                                            </div>
                                            <div className="p-4 flex flex-col flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-base font-bold text-green-700 line-clamp-2 no-underline">{productTranslationService.translateProductName(product.name)}</h3>
                                                </div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="flex text-yellow-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <i key={i} className={`fas fa-star ${i < (product.ratings || 0) ? '' : 'text-gray-300'}`}></i>
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-gray-500">({product.reviews?.length || 0} {t('products.reviews', { ns: 'pages' })})</span>
                                                </div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-lg font-bold text-green-600">{formatPrice(product.price)}</span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{product.stock > 0 ? t('products.in_stock', { ns: 'pages' }) : t('products.out_of_stock', { ns: 'pages' })}</span>
                                                    {product.discount > 0 && (
                                                        <span className="text-sm text-gray-400 line-through ml-2">{formatPrice(product.price / (1 - product.discount / 100))}</span>
                                                    )}
                                                </div>
                                                <button
                                                    className={`mt-auto w-full py-2 rounded-lg font-bold transition-colors no-underline ${product.stock > 0 ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                                    disabled={product.stock <= 0}
                                                    onClick={e => { e.preventDefault(); handleAddToCart(product); }}
                                                >
                                                    {product.stock > 0 ? t('buttons.add_to_cart', { ns: 'common' }) : t('products.out_of_stock', { ns: 'pages' })}
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <nav className="inline-flex -space-x-px">
                                    <button onClick={() => paginate(1)} disabled={currentPage === 1} className="px-3 py-2 rounded-l-lg border border-green-200 bg-white text-green-700 hover:bg-green-100">&laquo;</button>
                                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 border border-green-200 bg-white text-green-700 hover:bg-green-100">&lsaquo;</button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                        <button
                                            key={number}
                                            onClick={() => paginate(number)}
                                            className={`px-3 py-2 border border-green-200 ${number === currentPage ? 'bg-green-500 text-white font-bold' : 'bg-white text-green-700 hover:bg-green-100'}`}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 border border-green-200 bg-white text-green-700 hover:bg-green-100">&rsaquo;</button>
                                    <button onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} className="px-3 py-2 rounded-r-lg border border-green-200 bg-white text-green-700 hover:bg-green-100">&raquo;</button>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;