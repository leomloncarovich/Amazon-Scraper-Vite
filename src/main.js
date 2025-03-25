// Add an event listener to the search button
document.getElementById('searchButton').addEventListener('click', async () => {

    // Gets the value entered in the search field.(.trim() is used to remove extra spaces)
    const keyword = document.getElementById('keywordInput').value.trim();

    // If the search field is empty, display an alert and stop execution
    if (!keyword) {
        alert('Please enter a keyword!');
        return;
  }
    // Displays a loading message while fetching results
    document.getElementById('results').innerHTML = '<p>Loading...</p>';
  
    try {
        // Make an HTTP request to the API that will scrape the products
        const response = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);

        // Converts the request response to JSON
        const data = await response.json();

        // Checks if the response contains no products or if the product list is empty
        if (!data.products || data.products.length === 0) {
            document.getElementById('results').innerHTML = '<p>No products found!</p>';
            return;
      }
        // Gets the element where the results will be displayed
        const resultsContainer = document.getElementById('results');

        // Clears previous results
        resultsContainer.innerHTML = '';
      
        // Iterates over the products returned by the API and creates a card for each one
        data.products.forEach(product => {
            // Create a new 'div' element for the product card and add the style classes
            const productCard = document.createElement('div');
            productCard.classList.add('product', 'border', 'rounded-lg', 'shadow-md', 'p-4', 'mb-4', 'hover:shadow-lg', 'transition', 'duration-200', 'ease-in-out');

            // Defines the HTML content of the product card, including title, image, information, and link
            productCard.innerHTML = `
                <h3 class="text-xl font-semibold text-gray-800 mb-2 truncate">${product.title}</h3>
                <img 
                    class="w-auto h-auto object-fill" 
                    src="${product.image}" 
                />
                <p class="text-gray-600 text-sm mb-2">Reviews: ${product.reviews || 'N/A'}</p>
                <p class="text-gray-600 text-sm mb-2">Rating: ${product.rating || 'N/A'}</p>
                <a
                    href="https://www.amazon.com${product.link}" 
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium" 
                    target="_blank"
                >
                View on Amazon
                </a>
            `;
            // Add the product card to the results container
            resultsContainer.appendChild(productCard);
      });
  } catch (error) {
        // If an error occurs during the request, display an error message
        console.error('Error fetching products:', error);
        document.getElementById('results').innerHTML = '<p>An error occurred. Please try again later.</p>';
  }
});