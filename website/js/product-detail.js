
document.addEventListener('DOMContentLoaded', function() {
  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (!productId) {
    window.location.href = '404.html';
    return;
  }
  
  // Get product data
  const product = getProductById(productId);
  
  if (!product) {
    window.location.href = '404.html';
    return;
  }
  
  // Set page title
  document.title = `${product.name} - Overcomer Pool Cues`;
  
  // Populate product details
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
  document.getElementById('product-description').textContent = product.fullDescription;
  
  // Set main product image
  const mainImage = document.getElementById('main-product-image');
  mainImage.src = product.images[0];
  mainImage.alt = product.name;
  
  // Create thumbnail gallery
  const thumbnailGallery = document.getElementById('thumbnail-gallery');
  product.images.forEach((image, index) => {
    const thumbnail = document.createElement('div');
    thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
    
    const thumbnailImg = document.createElement('img');
    thumbnailImg.src = image;
    thumbnailImg.alt = `${product.name} - Thumbnail ${index + 1}`;
    
    thumbnail.appendChild(thumbnailImg);
    thumbnailGallery.appendChild(thumbnail);
    
    thumbnail.addEventListener('click', function() {
      mainImage.src = image;
      
      // Update active thumbnail
      document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
      });
      
      this.classList.add('active');
    });
  });
  
  // Populate features
  const featuresList = document.getElementById('product-features');
  product.features.forEach(feature => {
    const featureItem = document.createElement('li');
    
    const checkIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    checkIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    checkIcon.setAttribute('width', '20');
    checkIcon.setAttribute('height', '20');
    checkIcon.setAttribute('viewBox', '0 0 24 24');
    checkIcon.setAttribute('fill', 'none');
    checkIcon.setAttribute('stroke', 'currentColor');
    checkIcon.setAttribute('stroke-width', '2');
    checkIcon.setAttribute('stroke-linecap', 'round');
    checkIcon.setAttribute('stroke-linejoin', 'round');
    
    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('points', '20 6 9 17 4 12');
    checkIcon.appendChild(polyline);
    
    const featureText = document.createElement('div');
    
    const featureTitle = document.createElement('span');
    featureTitle.className = 'font-medium';
    featureTitle.textContent = `${feature.title} - `;
    
    const featureDescription = document.createElement('span');
    featureDescription.className = 'text-sm text-gray-600';
    featureDescription.textContent = feature.description;
    
    featureText.appendChild(featureTitle);
    featureText.appendChild(featureDescription);
    
    featureItem.appendChild(checkIcon);
    featureItem.appendChild(featureText);
    
    featuresList.appendChild(featureItem);
  });
  
  // Populate specifications
  const specsTable = document.getElementById('product-specs');
  product.specifications.forEach(spec => {
    const specRow = document.createElement('div');
    specRow.className = 'spec-row';
    
    const specLabel = document.createElement('div');
    specLabel.className = 'spec-label';
    specLabel.textContent = spec.name;
    
    const specValue = document.createElement('div');
    specValue.className = 'spec-value';
    specValue.textContent = spec.value;
    
    specRow.appendChild(specLabel);
    specRow.appendChild(specValue);
    
    specsTable.appendChild(specRow);
  });
  
  // Handle "Add to Cart" button
  document.getElementById('add-to-cart').addEventListener('click', function() {
    window.showNotification(`${product.name} added to cart`);
  });
});
