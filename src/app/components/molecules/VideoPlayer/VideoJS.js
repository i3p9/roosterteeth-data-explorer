import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./VideoJS.css";

export const VideoJS = (props) => {
	const videoRef = useRef(null);
	const playerRef = useRef(null);
	const { options, onReady, showSpinner } = props;

	useEffect(() => {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = "./VideoJS.css"; // Ensure this path is correct
		document.head.appendChild(link);
	}, [options]);


	useEffect(() => {
		if (!playerRef.current) {
			const videoElement = document.createElement("video-js");
			videoElement.classList.add(
				"vjs-big-play-centered",
				"shadow-xl",
				"rounded-lg"
			);
			videoElement.style.borderRadius = "0.5rem"; //rounded-lg
			videoElement.style.boxShadow =
				"0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"; //shadow-xl

			videoRef.current.appendChild(videoElement);

			const player = (playerRef.current = videojs(
				videoElement,
				options,
				() => {
					// videojs.log("player is ready");
					if (onReady) {
						onReady(player);
					}
				}
			));
		} else {
			const player = playerRef.current;
			player.autoplay(options.autoplay);
			player.src(options.sources);
		}
	}, [options]);

	useEffect(() => {
		const player = playerRef.current;
		// Clean up function to dispose the player after the component unmounts
		return () => {
			if (player && !player.isDisposed()) {
				player.dispose();
				playerRef.current = null;
			}
		};
	}, []);

	return (
		<div className='video-player' data-vjs-player>
			<div ref={videoRef} />
		</div>
	);
};

export default VideoJS;
