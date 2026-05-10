export function analyzeKeystrokePattern(events) {
  if (!events || events.length < 2) return null;

  const holds = events.map(e => e.holdDuration);
  const flights = events.filter(e => e.flightTime > 0).map(e => e.flightTime);

  const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
  const std = arr => {
    const m = mean(arr);
    return Math.sqrt(arr.reduce((sum, val) => sum + (val - m) ** 2, 0) / arr.length);
  };

  return {
    holdMean: mean(holds),
    holdStd: std(holds),
    flightMean: flights.length > 0 ? mean(flights) : 0,
    flightStd: flights.length > 0 ? std(flights) : 0,
    rhythm: calculateRhythm(events),
    consistency: calculateConsistency(holds),
    speed: events.length > 0 ? (events.length / (events[events.length - 1].timestamp / 1000)) : 0,
  };
}

function calculateRhythm(events) {
  if (events.length < 3) return 0;
  const intervals = [];
  for (let i = 1; i < events.length; i++) {
    intervals.push(events[i].timestamp - events[i-1].timestamp);
  }
  const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const variance = intervals.reduce((sum, val) => sum + (val - mean) ** 2, 0) / intervals.length;
  return Math.max(0, 100 - Math.sqrt(variance));
}

function calculateConsistency(holds) {
  if (holds.length < 2) return 100;
  const mean = holds.reduce((a, b) => a + b, 0) / holds.length;
  const cv = (Math.sqrt(holds.reduce((sum, val) => sum + (val - mean) ** 2, 0) / holds.length)) / mean;
  return Math.max(0, Math.round((1 - cv) * 100));
}

export function comparePatterns(pattern1, pattern2, tolerance = 300) {
  if (!pattern1 || !pattern2) return { match: false, similarity: 0 };

  const holdDiff = Math.abs(pattern1.holdMean - pattern2.holdMean);
  const flightDiff = Math.abs(pattern1.flightMean - pattern2.flightMean);
  const rhythmDiff = Math.abs(pattern1.rhythm - pattern2.rhythm);

  const similarity = Math.max(0, 100 - (holdDiff + flightDiff) / 2);

  return {
    match: (holdDiff + flightDiff) / 2 <= tolerance,
    similarity: Math.round(similarity),
    details: { holdDiff, flightDiff, rhythmDiff },
  };
}
