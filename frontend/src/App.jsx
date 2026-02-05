import React, { useState } from 'react';
import Proposal from './components/Proposal';
import LoveLetter from './components/LoveLetter';
import './App.css';
import { motion } from 'framer-motion';

function App() {
  const [screen, setScreen] = useState('home'); // 'home', 'letter', 'proposal'

  if (screen === 'letter') {
    return <LoveLetter onSubmit={() => setScreen('proposal')} />;
  }

  if (screen === 'proposal') {
    return <Proposal />;
  }

  // Home screen
  return (
    <div className="home-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="home-card"
      >
        <div className="home-header">
          <h1>💍 Make Your Proposal Special 💍</h1>
          <p>Express your love in a way they'll never forget</p>
        </div>

        <div className="options-grid">
          <motion.button
            className="option-card romantic"
            onClick={() => setScreen('letter')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="option-icon">💌</div>
            <h2>Start with a Love Letter</h2>
            <p>Write or choose a heartfelt message before the proposal. Build the perfect moment with words that matter.</p>
            <span className="option-cta">Begin →</span>
          </motion.button>

          <motion.button
            className="option-card direct"
            onClick={() => setScreen('proposal')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="option-icon">💍</div>
            <h2>Go Straight to Proposal</h2>
            <p>Skip the letter and jump right into the interactive proposal. Pop the question with style and fun!</p>
            <span className="option-cta">Propose Now →</span>
          </motion.button>
        </div>

        <div className="home-footer">
          <p>✨ Make every moment count. Choose the path that feels right for your love story. ✨</p>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
