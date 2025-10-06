// src/components/AsteroidAIInsights.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function AsteroidAIInsights({ asteroid }) {
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // This function is now stable and will only be recreated if the 'asteroid' prop changes.
  const generateInsights = useCallback(async (abortController) => {
    if (!asteroid) return;

    setLoading(true);
    setError(null);
    setInsights('');

    try {
      const asteroidData = {
        name: asteroid.full_name || asteroid.identificador,
        diameter: asteroid.diameter,
        hazardous: asteroid.es_peligroso === true || asteroid.es_peligroso === 'Y',
        a: asteroid.a, // Semi-major axis
        e: asteroid.e, // Eccentricity
        i: asteroid.i, // Inclination
        om: asteroid.om, // Longitude of Ascending Node
        w: asteroid.w, // Argument of Periapsis
        q: asteroid.q, // Perihelion Distance
        ad: asteroid.ad, // Aphelion Distance
        periodDay: asteroid.periodo_rotacion_horas, // Rotation period in hours
        periodY: asteroid.periodo_orbital_anios,   // Orbital period in years
      };
      const prompt = `You are an expert astronomer providing brief, engaging facts for a public dashboard. Given the following data for an asteroid, generate 6-7 interesting insights in English.

**Formatting Rules:**
- Do NOT use any Markdown (no asterisks for bold, no hashes for titles, etc.).
- Each insight must start with a dash (-) followed by a space.
- Each insight must be on a new line.
- This data is from the next APIs: NeoWs API (Near Earth Object Web Service), NASA Small-Body Database (SBDB) APIs.

**Instructions for Content:**
- If the asteroid is clasified as PHA, explain the reason why
- Provide a creative size comparison for its diameter.
- Explain what its orbital period (in years) means in a relatable way.
- Briefly interpret its orbital eccentricity (e). A value close to 0 is a near-perfect circle, while close to 1 is a very elongated orbit.
- Mention something interesting about its inclination (i) if it's notable (e.g., highly tilted compared to Earth's orbit).
- Briefly explain what makes diferent this asteroid

**Asteroid Data:**
- Name: ${asteroidData.name}
- Diameter: ${asteroidData.diameter ? asteroidData.diameter.toFixed(2) + ' km' : 'Unknown'}
- Potentially Hazardous: ${asteroidData.hazardous ? 'Yes' : 'No'}
- Semi-Major Axis (a): ${asteroidData.a?.toFixed(2) || 'N/A'} AU
- Eccentricity (e): ${asteroidData.e?.toFixed(3) || 'N/A'}
- Inclination (i): ${asteroidData.i?.toFixed(2) || 'N/A'} degrees
- Orbital Period: ${asteroidData.periodY?.toFixed(2) || 'N/A'} Earth years
- Rotation Period: ${asteroidData.periodDay?.toFixed(2) || 'N/A'} hours

Respond only with the plain text facts.`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal: abortController.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin, 
          'X-Title': 'Asteroid Dashboard',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct:free', // Using a verified working model
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || 'Failed to generate insights');
      }

      const data = await response.json();
      setInsights(data.choices[0].message.content);

    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('AI data is not responding :(');
        console.error('Error generating insights:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [asteroid]);

  // This single useEffect hook now correctly handles the logic.
  useEffect(() => {
    const abortController = new AbortController();

    // Only fetch if the panel is expanded and we don't already have insights.
    if (isExpanded && !insights) {
      generateInsights(abortController);
    }

    // Cleanup function: aborts the request if the component is closed or the asteroid changes.
    return () => {
      abortController.abort();
    };
  }, [isExpanded, insights, generateInsights]);

  // This useEffect resets the state when a new asteroid is selected.
  useEffect(() => {
    setInsights('');
    setError(null);
    setIsExpanded(false); // Optionally, close the panel when a new asteroid is selected
  }, [asteroid]);

  return (
    <div className="aiInsightsContainer">
      <button 
        className="aiInsightsToggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>AI-steroid data</span>
        <span className={`arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="aiInsightsContent"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {loading && (
              <div className="aiInsightsLoading">
                <div className="spinner"></div>
                <p className='errormsg'>Loading data...</p>
              </div>
            )}

            {error && (
              <div className="aiInsightsError">
                <p className='errormsg'>{error}</p>
                <button onClick={() => generateInsights(new AbortController())} className="retryButton">
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && insights && (
              <motion.div 
                className="aiInsightsText"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br/>') }} />
              </motion.div>
            )}

            {!loading && !error && !insights && (
              <div className="aiInsightsEmpty">
                <p>Get interesting facts about this asteroid</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AsteroidAIInsights;