import styles from './skeleton.module.css';

export const Skeleton = ({ width, height, borderRadius = '4px', className = '' }) => {
    return (
        <div
            className={`${styles.skeleton} ${className}`}
            style={{
                width: width || '100%',
                height: height || '1rem',
                borderRadius
            }}
        />
    );
};

export const SkeletonCircle = ({ size = '40px' }) => {
    return (
        <div
            className={styles.skeleton}
            style={{
                width: size,
                height: size,
                borderRadius: '50%'
            }}
        />
    );
};

export const SkeletonText = ({ lines = 1, width = '100%', height = '1rem' }) => {
    return (
        <div className={styles.skeletonTextContainer}>
            {Array.from({ length: lines }).map((_, index) => (
                <Skeleton
                    key={index}
                    width={width}
                    height={height}
                    className={index < lines - 1 ? styles.skeletonLine : ''}
                />
            ))}
        </div>
    );
};