import styles from './FancyButton.module.css'
import { useState, useEffect } from 'react'

const FancyButton = (props) => {
    const [audioElement, setAudioElement] = useState(null)
    const { title, path } = props
    useEffect(() => {
        setAudioElement(new Audio(path))
    }, [path])

    console.log(audioElement)
    const playSound = () => {
        audioElement.play()
    }

    return (
        <>
            <div>
                <button className={styles.pushable} onClick={playSound}>
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
