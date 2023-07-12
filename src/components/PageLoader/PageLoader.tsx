import { FC, useEffect, useRef, useState, memo } from 'react';
import { useLocation } from 'react-router-dom';
import LinearProgress from '@carrier-io/fds-react/LinearProgress';

interface PageLoaderProps {
  className?: string;
  speed?: number;
}

export const PageLoader: FC<PageLoaderProps> = memo(({ className, speed = 100 }: PageLoaderProps) => {
  const location = useLocation();
  const [value, setValue] = useState(1);
  const prevValue = useRef<number>(value);
  const timeoutId = useRef<ReturnType<typeof setTimeout>>();

  prevValue.current = value;

  const stopAnimate = () => {
    clearTimeout(timeoutId.current);
    setValue(0);
  };

  const animate = () => {
    if (prevValue.current < 100) {
      timeoutId.current = setTimeout(() => {
        setValue(prevValue.current + 10);
        animate();
      }, speed);
    } else {
      stopAnimate();
    }
  };

  useEffect(() => {
    animate();

    return () => {
      clearTimeout(timeoutId.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div className={`progress-bar ${className}`}>
      {value > 0 && <LinearProgress color="primary" value={value} valueBuffer={0} variant="determinate" />}
    </div>
  );
});

PageLoader.displayName = 'PageLoader';
