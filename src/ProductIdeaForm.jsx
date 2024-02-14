import React, { useState } from 'react';
import axios from 'axios';

function ProductIdeaForm() {
  const [idea, setIdea] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(2);

  const handleInputChange = (event) => {
    setIdea(event.target.value);
    setImage(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const openAIResponse = await axios.post(
        'https://api.openai.com/v1/completions',
        {
          model: 'text-davinci-002',
          prompt: `Generate product ideas: ${idea}`,
          max_tokens: 50
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer apnaAPI',
          }
        }
      );

      const productIdeas = openAIResponse.data.choices.map(choice => choice.text.trim());
      setProducts(productIdeas);

      const imageGenerationResponse = await axios.post(
        'https://api.openai.com/v1/images/create',
        {
          prompt: idea,
          model: 'image-davinci-002'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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',
          }
        }
      );

      setImage(imageGenerationResponse.data.output.url);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setVisibleProducts(prevCount => prevCount + 2); 
  };

  return (
    <div>
      <h2>Product Idea Recommendations</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <div style={{ position: 'relative' }}>
            {image && (
              <img
                src={image}
                alt="Generated Image"
                style={{
                  position: 'absolute',
                  left: '5px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '20px',
                }}
              />
            )}
          </div>
          <input
            type="text"
            value={idea}
            onChange={handleInputChange}
            placeholder="Search Here"
            required
          />
        </label>
        <button type="submit" disabled={loading}>Submit</button>
      </form>
      {image && <div className="image-container"><img src={image} alt="Generated Image" /></div>}
      
      <div>
        <h3>Generated Product Ideas</h3>
        <div className="product-list">
          {products.slice(0, visibleProducts).map((product, index) => (
            <div key={index} className="product-card">
              <h4>{`Product ${index + 1}`}</h4>
              <p>{product}</p>
            </div>
          ))}
        </div>
        {products.length > visibleProducts && (
          <button onClick={handleLoadMore}>Read More</button>
        )}
      </div>
    </div>
  );
}

export default ProductIdeaForm;



