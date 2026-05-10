import { useState, useRef, useCallback } from 'react';

export function useKeystrokeDynamics() {
  const [keyEvents, setKeyEvents] = useState([]);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [currentKey, setCurrentKey] = useState(null);
  const [waveformData, setWaveformData] = useState([]);
  const [heatmapData, setHeatmapData] = useState({});

  const startTimeRef = useRef(null);
  const keyDownTimesRef = useRef({});
  const lastKeyUpRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    const key = e.key;
    if (key === 'Tab' || key === 'Shift' || key === 'Control' || key === 'Alt' || key === 'Meta') return;

    const now = Date.now();

    if (!startTimeRef.current) {
      startTimeRef.current = now;
    }

    if (!keyDownTimesRef.current[key]) {
      keyDownTimesRef.current[key] = now;
    }

    setIsTyping(true);
    setCurrentKey(key);
  }, []);

  const handleKeyUp = useCallback((e) => {
    const key = e.key;
    if (key === 'Tab' || key === 'Shift' || key === 'Control' || key === 'Alt' || key === 'Meta') return;

    const now = Date.now();
    const downTime = keyDownTimesRef.current[key];

    if (downTime) {
      const holdDuration = now - downTime;
      const flightTime = lastKeyUpRef.current ? downTime - lastKeyUpRef.current : 0;
      const totalElapsed = now - startTimeRef.current;

      const event = {
        key,
        holdDuration,
        flightTime: Math.max(0, flightTime),
        timestamp: totalElapsed,
        downTime,
        upTime: now,
      };

      setKeyEvents(prev => [...prev, event]);
      setTotalDuration(totalElapsed);
      setWaveformData(prev => [...prev, { time: totalElapsed, hold: holdDuration, flight: Math.max(0, flightTime) }]);

      setHeatmapData(prev => ({
        ...prev,
        [key.toLowerCase()]: {
          count: (prev[key.toLowerCase()]?.count || 0) + 1,
          avgHold: ((prev[key.toLowerCase()]?.avgHold || 0) * (prev[key.toLowerCase()]?.count || 0) + holdDuration) / ((prev[key.toLowerCase()]?.count || 0) + 1),
        }
      }));

      delete keyDownTimesRef.current[key];
      lastKeyUpRef.current = now;
    }

    setIsTyping(false);
    setCurrentKey(null);
  }, []);

  const reset = useCallback(() => {
    setKeyEvents([]);
    setTotalDuration(0);
    setIsTyping(false);
    setCurrentKey(null);
    setWaveformData([]);
    setHeatmapData({});
    startTimeRef.current = null;
    keyDownTimesRef.current = {};
    lastKeyUpRef.current = null;
  }, []);

  const getStats = useCallback(() => {
    if (keyEvents.length === 0) return null;
    const holds = keyEvents.map(e => e.holdDuration);
    const flights = keyEvents.filter(e => e.flightTime > 0).map(e => e.flightTime);
    return {
      totalKeys: keyEvents.length,
      totalDuration,
      avgHoldTime: holds.reduce((a, b) => a + b, 0) / holds.length,
      avgFlightTime: flights.length > 0 ? flights.reduce((a, b) => a + b, 0) / flights.length : 0,
      minHold: Math.min(...holds),
      maxHold: Math.max(...holds),
      wpm: keyEvents.length > 0 ? Math.round((keyEvents.length / 5) / (totalDuration / 60000)) : 0,
    };
  }, [keyEvents, totalDuration]);

  return {
    keyEvents,
    totalDuration,
    isTyping,
    currentKey,
    waveformData,
    heatmapData,
    handleKeyDown,
    handleKeyUp,
    reset,
    getStats,
  };
}
