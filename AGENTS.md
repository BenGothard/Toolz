# Toolz Agents

This file documents the available agents and their interfaces.

## summarize_agent
- **Purpose:** Summarize text.
- **Model:** `t5-small` via Transformers.js CDN.
- **Input:** `{ text: string }`
- **Output:** `{ summary: string }`
- **Fallback:** none (stub allowed)
- **Runtime:** WebAssembly/WebGPU

## sentiment_agent
- **Purpose:** Sentiment analysis.
- **Model:** `distilbert-base-uncased-finetuned-sst-2-english` via Transformers.js CDN.
- **Input:** `{ text: string }`
- **Output:** `{ label: string, score: number }`
- **Fallback:** none

## speech_agent
- **Purpose:** Speech to text using browser API.
- **Model:** Browser SpeechRecognition API.
- **Input:** none
- **Output:** `{ text: string }`
- **Fallback:** none
- **Runtime:** Microphone permissions required.

## embed_agent
- **Purpose:** Generate vector embeddings and store them.
- **Model:** `all-MiniLM-L6-v2` via Transformers.js CDN.
- **Input:** `{ text: string }`
- **Output:** `{ vector: number[] }`
- **Fallback:** none
- **Runtime:** IndexedDB for storage
