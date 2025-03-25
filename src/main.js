document.getElementById('searchButton').addEventListener('click', async () => {
  const keyword = document.getElementById('keywordInput').value.trim();
  if (!keyword) {
      alert('Please enter a keyword!');
      return;
  }

  document.getElementById('results').innerHTML = '<p>Loading...</p>';
  
  try {
      const response = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
      const data = await response.json();
      
      if (!data.products || data.products.length === 0) {
          document.getElementById('results').innerHTML = '<p>No products found!</p>';
          return;
      }
      
      const resultsContainer = document.getElementById('results');
      resultsContainer.innerHTML = '';
      
      data.products.forEach(product => {
          const productCard = document.createElement('div');
          productCard.classList.add('product', 'border', 'rounded-lg', 'shadow-md', 'p-4', 'mb-4', 'hover:shadow-lg', 'transition', 'duration-200', 'ease-in-out');
          productCard.innerHTML = `
              <h3 class="text-xl font-semibold text-gray-800 mb-2 truncate">${product.title}</h3>
              <img 
              class="w-auto h-auto object-fill" 
              src="${product.image}" 
              /
              <p class="text-gray-600 text-sm mb-2">Reviews: ${product.reviews || 'N/A'}</p>
              <p class="text-gray-600 text-sm mb-2">Rating: ${product.rating || 'N/A'}</p>
              <a
                href="https://www.amazon.com${product.link}" 
                class="text-blue-600 hover:text-blue-800 text-sm font-medium" 
                target="_blank">
                View on Amazon
              </a>
          `;
          resultsContainer.appendChild(productCard);
      });
  } catch (error) {
      console.error('Error fetching products:', error);
      document.getElementById('results').innerHTML = '<p>An error occurred. Please try again later.</p>';
  }
});