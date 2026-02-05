import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './LoveLetter.css';

const LoveLetter = ({ onSubmit }) => {
    const [step, setStep] = useState('template'); // 'template', 'customize', 'preview', 'sent'
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [recipientName, setRecipientName] = useState('');
    const [senderName, setSenderName] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    const [generatedLetter, setGeneratedLetter] = useState('');

    const templates = [
        {
            id: 'romantic',
            title: '💕 Romantic',
            preview: 'A heartfelt declaration of love...',
            template: (recipient, sender, custom) => `My Dearest ${recipient},

From the moment I met you, my life has been filled with an indescribable warmth and joy. Your smile brightens my darkest days, and your presence makes every moment feel like a dream.

I admire your strength, your kindness, and the way you see beauty in the world. Every laugh we share, every moment we spend together, has carved a place in my heart that only you can fill.

${custom ? `${custom}\n\n` : ''}I don't have all the words to express what you mean to me, but I hope my actions speak louder than words ever could. You are my greatest blessing, and I cannot imagine a future without you.

With all my love and devotion,
${sender}`
        },
        {
            id: 'poetic',
            title: '✨ Poetic',
            preview: 'A lyrical expression of affection...',
            template: (recipient, sender, custom) => `Dearest ${recipient},

Like stars that dance across the night sky, you illuminate my world with an ethereal glow.
In the garden of my heart, you are the most beautiful rose that ever bloomed.
Every heartbeat echoes your name, every breath carries thoughts of you.

You are the melody to my song, the colour in my monochrome world, the reason my heart learns to beat again each morning.

${custom ? `${custom}\n\n` : ''}Forever yours,
${sender}`
        },
        {
            id: 'sweet',
            title: '🌟 Sweet & Playful',
            preview: 'A light-hearted, charming love note...',
            template: (recipient, sender, custom) => `Hey ${recipient},

I've tried to write this a thousand times, and each time I end up smiling like an idiot thinking about you.

You make my heart do things it's never done before. You make me want to be a better person, make you laugh, and create memories that last forever.

Life with you is my favorite adventure. Every day with you feels like a gift I don't deserve but am grateful to receive.

${custom ? `${custom}\n\n` : ''}Will you let me love you? For real this time?

Yours truly (and a little nervously),
${sender}`
        },
        {
            id: 'classic',
            title: '💌 Classic Elegance',
            preview: 'A timeless expression of devotion...',
            template: (recipient, sender, custom) => `My Beloved ${recipient},

In the quietest moments, when the world falls away, I find myself thinking of you. There is a grace in your presence, a kindness in your words, and a strength in your spirit that has captivated my soul.

You have become my reason, my purpose, and my greatest joy. The thought of building a life with you fills my heart with an indescribable peace.

${custom ? `${custom}\n\n` : ''}I wish to spend forever by your side, through every season of life, as your devoted companion and truest friend.

With eternal affection,
${sender}`
        }
    ];

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        setStep('customize');
    };

    const handleGenerate = () => {
        if (!recipientName.trim() || !senderName.trim()) {
            alert('Please fill in both names');
            return;
        }
        const letter = selectedTemplate.template(recipientName, senderName, customMessage);
        setGeneratedLetter(letter);
        setStep('preview');
    };

    const handleSend = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
            await axios.post(`${apiUrl}/api/love-letter`, {
                recipient: recipientName,
                sender: senderName,
                template: selectedTemplate.id,
                letter: generatedLetter
            });
            setStep('sent');
            setTimeout(() => onSubmit && onSubmit(), 3000);
        } catch (error) {
            console.error('Error sending love letter:', error);
            alert('Error sending letter. Please try again.');
        }
    };

    const handleReset = () => {
        setStep('template');
        setSelectedTemplate(null);
        setRecipientName('');
        setSenderName('');
        setCustomMessage('');
        setGeneratedLetter('');
    };

    return (
        <div className="love-letter-container">
            {step === 'template' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="template-selection"
                >
                    <h1 className="letter-title">💌 Choose Your Love Letter Style</h1>
                    <p className="letter-subtitle">Select a template to express your feelings</p>
                    <div className="template-grid">
                        {templates.map((template) => (
                            <motion.button
                                key={template.id}
                                className="template-card"
                                onClick={() => handleTemplateSelect(template)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <h3>{template.title}</h3>
                                <p>{template.preview}</p>
                                <span className="cta">Choose →</span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            )}

            {step === 'customize' && selectedTemplate && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="customize-form"
                >
                    <h1 className="letter-title">✍️ Customize Your Letter</h1>
                    <div className="form-group">
                        <label>Recipient's Name *</label>
                        <input
                            type="text"
                            placeholder="Their name"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Your Name *</label>
                        <input
                            type="text"
                            placeholder="Your name"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Add a Personal Message (Optional)</label>
                        <textarea
                            placeholder="Share a special memory or feeling..."
                            value={customMessage}
                            onChange={(e) => setCustomMessage(e.target.value)}
                            className="form-textarea"
                            rows="4"
                        />
                    </div>
                    <div className="button-group">
                        <button onClick={() => setStep('template')} className="btn btn-secondary">
                            Back
                        </button>
                        <button onClick={handleGenerate} className="btn btn-primary">
                            Preview Letter
                        </button>
                    </div>
                </motion.div>
            )}

            {step === 'preview' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="letter-preview"
                >
                    <h1 className="letter-title">📬 Your Love Letter</h1>
                    <div className="letter-content">
                        <p>{generatedLetter}</p>
                    </div>
                    <div className="button-group">
                        <button onClick={() => setStep('customize')} className="btn btn-secondary">
                            Edit
                        </button>
                        <button onClick={handleSend} className="btn btn-primary">
                            Send Letter 💌
                        </button>
                    </div>
                </motion.div>
            )}

            {step === 'sent' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="letter-sent"
                >
                    <div className="sent-icon">💕</div>
                    <h1>Letter Sent Successfully!</h1>
                    <p>Your heartfelt message has been delivered. Now, prepare for the proposal...</p>
                    <button onClick={handleReset} className="btn btn-primary">
                        Proceed to Proposal 💍
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default LoveLetter;
