export const typewriter = (phrases: string[]) => {
  let currentPhraseIndex = 0;
  let currentLength = 0;
  let isDeleting = false;
  let pauseCounter = 0;
  let cursorVisible = true;
  let cursorBlinkCounter = 0;
  const pauseAfterComplete = 25;
  const pauseAfterDelete = 10;
  const cursorBlinkSpeed = 5;
  
  const type = () => {
    const currentPhrase = phrases[currentPhraseIndex];
    
    cursorBlinkCounter++;
    if (cursorBlinkCounter >= cursorBlinkSpeed) {
      cursorVisible = !cursorVisible;
      cursorBlinkCounter = 0;
    }
    
    const cursor = cursorVisible ? '|' : '';
    
    if (pauseCounter > 0) {
      document.title = currentPhrase.substring(0, currentLength) + cursor;
      pauseCounter--;
      return;
    }
    
    if (!isDeleting) {
      if (currentLength <= currentPhrase.length) {
        document.title = currentPhrase.substring(0, currentLength) + '|';
        currentLength++;
        
        if (currentLength > currentPhrase.length) {
          pauseCounter = pauseAfterComplete;
          isDeleting = true;
          cursorBlinkCounter = 0;
          cursorVisible = true;
        }
      }
    } else {
      if (currentLength > 0) {
        currentLength--;
        document.title = currentPhrase.substring(0, currentLength) + '|';
        
        if (currentLength === 0) {
          pauseCounter = pauseAfterDelete;
          isDeleting = false;
          currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
          cursorBlinkCounter = 0;
          cursorVisible = true;
        }
      }
    }
  };
  
  return setInterval(type, 100);
};

export const loadingDots = () => {
  const states = ['⋅', '⋅⋅', '⋅⋅⋅', '⋅⋅', '⋅'];
  let index = 0;
  
  const animate = () => {
    document.title = states[index];
    index = (index + 1) % states.length;
  };
  
  return setInterval(animate, 300);
};