import styles from './FancyButton.module.css'
import { useState, useEffect } from 'react'

const FancyButton = (props) => {
    const [audioElement, setAudioElement] = useState(null)
    const { title, path, giant } = props
    useEffect(() => {
        setAudioElement(new Audio(path))
    }, [path])

    const playSound = () => {
        if (audioElement) {
            audioElement.currentTime = 0; // Reset the audio to the beginning
            audioElement.play();
        }
    }

    return (
        <>
            <div>
                <button
                    style={giant ? { width: '100%' } : null}
                    className={styles.pushable}
                    onClick={playSound}
                >
                    <span className={styles.shadow}></span>
                    <span className={styles.edge}></span>
                    <span className={styles.front}>
                        {title}
                    </span>
                </button>
            </div>
        </>
    )
}

export default FancyButton
