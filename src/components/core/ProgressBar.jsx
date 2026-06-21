const styles = {
  container: {
    position: 'relative',
    width: '100%',
    backgroundColor: '#202020',
    borderRadius: '8px',
    overflow: 'hidden',
    height: '24px',
  },
  bar: {
    height: '75%',
    borderRadius: '8px',
    margin: '3px',
    backgroundColor: '#006633',
    borderTop: '1px solid white',
    transition: 'width 0.3s ease-in-out',
  },
  text: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontWeight: 'bold',
    zIndex: 1,
    pointerEvents: 'none',
  },
};

export default function ProgressBar({progress}){
  return (
    <div style={styles.container}>
      <div
        style={{ ...styles.bar, width: `${progress}%` }}
      >
      </div>
      <div style={styles.text}>
        {progress} / 100
      </div>
    </div>
  );
}
