import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonToast, IonTitle, IonButton, IonIcon, IonList, IonItem, IonLabel, IonCheckbox } from '@ionic/react';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProducts, getCategories } from '../api/api';
import { useCart } from '../contexts/CartContext';
import { filterOutline, checkmarkOutline, closeOutline } from 'ionicons/icons';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Product.css';
import '../styles/ProductsMobile.css';

const Products: React.FC = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  
  // Add toast notification state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Use cart context
  const { addToCart } = useCart();

  // Fetch products and categories from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        
        if (productsResponse.error) {
          setError(productsResponse.message);
          setAllProducts([]);
        } else {
          setAllProducts(productsResponse.data || []);
          setError(null);
        }
        
        if (!categoriesResponse.error) {
          setCategories(categoriesResponse.data || []);
        }
      } catch (err) {
        setError('Failed to fetch data');
        setAllProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search and filtering
  useEffect(() => {
    // Get search term from URL query parameters
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    const category = params.get('category') || 'all';
    const featured = params.get('featured') === 'true';
    
    setSearchTerm(search);
    setSelectedCategory(category);
    setShowFeaturedOnly(featured);
    
    filterProducts(search, category, featured);
  }, [location.search, allProducts]);

  // Filter products based on search term, category and featured status
  const filterProducts = (search: string, category: string, featured: boolean = false) => {
    let filtered = allProducts;
    
    // Filter by featured if requested
    if (featured) {
      filtered = filtered.filter(product => product.featured === true);
    }
    
    // Filter by category
    if (category && category !== 'all') {
      filtered = filtered.filter(product => 
        product.category?._id === category || 
        product.category?.name?.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by search term
    if (search.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category?.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value;
    setSearchTerm(search);
    filterProducts(search, selectedCategory, showFeaturedOnly);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    filterProducts(searchTerm, categoryId, showFeaturedOnly);
    setIsCategoryDropdownOpen(false);
  };

  // Handle adding product to cart
  const handleAddToCart = (product: any) => {
    addToCart(product);
    setToastMessage(`${product.name} added to cart!`);
    setShowToast(true);
  };

  // Get product count for each category
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return allProducts.length;
    return allProducts.filter(product => product.category?._id === categoryId).length;
  };

  // Get selected category name
  const getSelectedCategoryName = () => {
    if (selectedCategory === 'all') return 'All Products';
    const category = categories.find(c => c._id === selectedCategory);
    return category ? category.name : 'All Products';
  };

  // Handle opening the categories dropdown
  const handleCategoriesButtonClick = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  return (
    <IonPage className="products-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" text="" />
          </IonButtons>
          <IonTitle>Products</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="products-content">
        {loading ? (
          <LoadingSpinner message="Loading products..." size="large" fullPage={true} />
        ) : (
          <>
            <div className="products-header">
              <h1 className="products-title">Products</h1>
              
              {/* Search Bar */}
              <input
                className="home-search products-search"
                type="text"
                placeholder="Search groceries..."
                value={searchTerm}
                onChange={handleSearch}
                aria-label="Search products"
                style={{
                  color: 'var(--ion-text-color)',
                  backgroundColor: 'var(--ion-card-background)',
                  borderColor: 'var(--ion-input-border)'
                }}
              />
              
              {/* Categories Button with Dropdown - Only show if categories exist */}
              {categories.length > 0 && (
                <div className="categories-dropdown-container">
                  <button 
                    className="categories-button"
                    onClick={handleCategoriesButtonClick}
                    aria-label="Filter by category"
                  >
                    <IonIcon icon={filterOutline} />
                    <span>Categories</span>
                    <span className="selected-category">({getSelectedCategoryName()})</span>
                  </button>
                  
                  {isCategoryDropdownOpen && (
                    <div className="categories-dropdown">
                      <div 
                        className={`category-item ${selectedCategory === 'all' ? 'selected' : ''}`}
                        onClick={() => handleCategorySelect('all')}
                      >
                        <span>All Products</span>
                        <span className="item-count">({getCategoryCount('all')})</span>
                        {selectedCategory === 'all' && <IonIcon icon={checkmarkOutline} />}
                      </div>
                      
                      {categories.map(category => (
                        <div 
                          key={category._id}
                          className={`category-item ${selectedCategory === category._id ? 'selected' : ''}`}
                          onClick={() => handleCategorySelect(category._id)}
                        >
                          <span>{category.name}</span>
                          <span className="item-count">({getCategoryCount(category._id)})</span>
                          {selectedCategory === category._id && <IonIcon icon={checkmarkOutline} />}
                        </div>
                      ))}
                      
                      {/* Featured products filter */}
                      <div 
                        className="category-item featured-filter"
                        onClick={() => {
                          setShowFeaturedOnly(!showFeaturedOnly);
                          filterProducts(searchTerm, selectedCategory, !showFeaturedOnly);
                        }}
                      >
                        <span>Featured Products Only</span>
                        <IonCheckbox 
                          checked={showFeaturedOnly} 
                          onIonChange={(e) => {
                            setShowFeaturedOnly(e.detail.checked);
                            filterProducts(searchTerm, selectedCategory, e.detail.checked);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="products-list">
              {error ? (
                <div className="error-message">{error}</div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <div className="product-card" key={product._id}>
                    <img className="product-image" src={product.image} alt={product.name} />
                    <div className="product-info">
                      <div className="product-name">{product.name}</div>
                      <div className="product-price">₹{product.price}</div>
                      <div className="product-category">{product.category?.name}</div>
                    </div>
                    <button 
                      className="product-add-btn" 
                      onClick={() => handleAddToCart(product)}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      Add to Cart
                    </button>
                  </div>
                ))
              ) : (
                <div className="no-products">
                  <p>
                    {searchTerm && selectedCategory !== 'all' 
                      ? `No products found matching "${searchTerm}" in ${categories.find(c => c._id === selectedCategory)?.name || 'selected category'}`
                      : searchTerm 
                        ? `No products found matching "${searchTerm}"`
                        : selectedCategory !== 'all'
                          ? `No products found in ${categories.find(c => c._id === selectedCategory)?.name || 'selected category'}`
                          : 'No products found'
                    }
                  </p>
                </div>
              )}
            </div>
          </>
        )}
        
        {/* Toast notification for cart additions */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="top"
          color="success"
          buttons={[
            {
              text: 'Dismiss',
              role: 'cancel'
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Products;