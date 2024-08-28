import { forwardRef } from 'react';
import BeatLoader from 'react-spinners/BeatLoader'
import { SpinnerProps } from '../Interfaces/Interfaces';

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(({ loading }, ref) => {
    return (
        loading && (
            <div ref={ref} className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-90 z-50">
                <BeatLoader
                    loading={loading}
                    size={15}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>
        )
    );
});

export default Spinner;