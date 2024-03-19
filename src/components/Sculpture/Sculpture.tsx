import sculpture from '../../images/sculpture.png'
import sculpture_500 from '../../images/sculpture-p-500.png'
import sculpture_800 from '../../images/sculpture-p-800.png'
import sculpture_1080 from '../../images/sculpture-p-1080.png'
import { useState, useEffect } from 'react';

function CountdownTimer({ targetDate }: { targetDate: string }) {
  // Initialize state with the time left until the target date
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));


  // Calculate the time left until the target date
  type TimeLeft = {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
  };
  
  function calculateTimeLeft(targetDate: string): TimeLeft {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft: TimeLeft = {};
  
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
  
    return timeLeft;
  }

  // Update the time left every second
  useEffect(() => {
    const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearTimeout(timer);
  });

  // Format the time left as DD:HH:MM:SS
  const formattedTimeLeft = `${timeLeft.days ? String(timeLeft.days).padStart(2, '0') : '00'}:${timeLeft.hours ? String(timeLeft.hours).padStart(2, '0') : '00'}:${timeLeft.minutes ? String(timeLeft.minutes).padStart(2, '0') : '00'}:${timeLeft.seconds ? String(timeLeft.seconds).padStart(2, '0') : '00'}`;

  return (
      <>
        {Object.keys(timeLeft).length ? formattedTimeLeft + ` till reveal at ETHCC!`: 'Game Over!'}
      </>
  );
}

export const Sculpture = () => {
  return (
    <div className="w-layout-vflex wrapper">
        <img src={sculpture} loading="lazy" width={670} sizes="(max-width: 479px) 100vw, 500px" alt=""
            srcSet={`${sculpture_500} 500w, ${sculpture_800} 800w, ${sculpture_1080} 1080w`}
            className="sculpture"/>
        <div className="w-layout-vflex main-content">
            <p className="paragraph">
              Submit a whole number between 1 and 100. The player who guesses closest to two thirds of the average wins.
            </p>
            <p className="timer">
              <CountdownTimer targetDate={new Date('2024-07-12T00:00:00').toISOString()} />
            </p>
        </div>
    </div> 
  );
};