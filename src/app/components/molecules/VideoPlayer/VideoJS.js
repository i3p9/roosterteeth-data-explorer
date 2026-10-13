"use client";

import "@videojs/react/video/skin.css";
import { createPlayer, videoFeatures } from "@videojs/react";
import { VideoSkin, Video } from "@videojs/react/video";
import { useEffect, useRef } from "react";

const Player = createPlayer({ features: videoFeatures });

export { Player };

export const VideoPlayer = ({
	src,
	subtitles = [],
	autoPlay = true,
	onTimeUpdate,
	onEnded,
	onLoadedMetadata,
}) => {
	return (
		<Player.Provider>
			<VideoSkin className='aspect-video'>
				<Video src={src} autoPlay={autoPlay} playsInline>
					{subtitles.map((track, index) => (
						<track
							key={track.src}
							kind="subtitles"
							src={track.src}
							srcLang={track.lang || "en"}
							label={track.label || `Subtitles ${index + 1}`}
						/>
					))}
				</Video>
				<ClickToPlay />
			</VideoSkin>
			<PlayerEventBridge
				onTimeUpdate={onTimeUpdate}
				onEnded={onEnded}
				onLoadedMetadata={onLoadedMetadata}
			/>
		</Player.Provider>
	);
};

const ClickToPlay = () => {
	const media = Player.useMedia();
	const store = Player.usePlayer();

	const handleClick = () => {
		if (!media) return;
		if (media.paused) {
			store.play();
		} else {
			store.pause();
		}
	};

	const handleDoubleClick = () => {
		if (!document.fullscreenElement) {
			media?.closest("[data-media-root]")?.requestFullscreen?.();
		} else {
			document.exitFullscreen?.();
		}
	};

	return (
		<div
			onClick={handleClick}
			onDoubleClick={handleDoubleClick}
			style={{
				position: "absolute",
				inset: 0,
				zIndex: 1,
				cursor: "pointer",
			}}
		/>
	);
};

const PlayerEventBridge = ({ onTimeUpdate, onEnded, onLoadedMetadata }) => {
	const media = Player.useMedia();
	const intervalRef = useRef(null);
	const onTimeUpdateRef = useRef(onTimeUpdate);
	const onEndedRef = useRef(onEnded);
	const onLoadedMetadataRef = useRef(onLoadedMetadata);

	useEffect(() => {
		onTimeUpdateRef.current = onTimeUpdate;
		onEndedRef.current = onEnded;
		onLoadedMetadataRef.current = onLoadedMetadata;
	}, [onTimeUpdate, onEnded, onLoadedMetadata]);

	useEffect(() => {
		if (!media) return;

		const handleLoadedMetadata = () => {
			if (onLoadedMetadataRef.current) {
				onLoadedMetadataRef.current(media);
			}
		};

		const handleEnded = () => {
			if (onEndedRef.current) {
				onEndedRef.current();
			}
		};

		media.addEventListener("loadedmetadata", handleLoadedMetadata);
		media.addEventListener("ended", handleEnded);

		// Progress reporting interval (every 10s)
		if (onTimeUpdateRef.current) {
			intervalRef.current = setInterval(() => {
				if (!media.paused && onTimeUpdateRef.current) {
					onTimeUpdateRef.current(media.currentTime, media.duration);
				}
			}, 10000);
		}

		return () => {
			media.removeEventListener("loadedmetadata", handleLoadedMetadata);
			media.removeEventListener("ended", handleEnded);
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [media]);

	return null;
};

export default VideoPlayer;
