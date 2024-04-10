'use client'
import React from "react"
import { sortedSoundSource } from "./data/sounds"
import NavBar from "../components/molecules/NavBar/NavBar"
import FancyButton from "../components/molecules/FancyButton/FancyButton"
const SecretSoundBoard = () => {
    const bigButtonSound = sortedSoundSource.find(sound => sound.title === "Yeahhh Baybeeee")
    return (
        <>
            <NavBar title="Secret Sounds" />
            <div className="m-4">
                <div className="my-4">
                    <FancyButton
                        title={'YEAH BAYBEE!'}
                        path={bigButtonSound.path}
                        giant={true}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 justify-center items-center">
                    {sortedSoundSource.map((sound, index) => {
                        return (
                            <div key={index} className="flex justify-center items-center">
                                <FancyButton
                                    title={sound.title}
                                    path={sound.path}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}


export default SecretSoundBoard
