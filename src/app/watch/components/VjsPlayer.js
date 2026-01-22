import VideoJS from "@/app/components/molecules/VideoPlayer/VideoJS";
import React, { useRef, memo, useEffect } from "react";
import { videoProgressService } from "@/services/videoProgressService";
import toast from "react-hot-toast";

const VjsPlayer = ({ downloadData, onVideoEnd }) => {
	const playerRef = useRef(null);
	const intervalRef = useRef(null);

	// Sets up all event listeners for the video player
	const setupEventListeners = (player) => {
		// Clean up any existing event listeners to prevent duplicates
		player.off("loadedmetadata");
		player.off("play");
		player.off("pause");
		player.off("waiting");
		player.off("loadeddata");
		player.off("dispose");
		player.off("ended");

		// Load saved progress when video metadata is loaded
		player.on("loadedmetadata", async function () {
			try {
				const savedProgress = await videoProgressService.getProgress(
					downloadData?.uuid
				);
				if (
					savedProgress?.currentTime &&
					(savedProgress?.watchedPercentage === undefined ||
						savedProgress?.watchedPercentage <= 85)
				) {
					player.currentTime(savedProgress.currentTime);
				}

				if (
					savedProgress?.watchedPercentage &&
					savedProgress?.watchedPercentage > 85
				) {
					toast("Continue watching time reset", {
						icon: "🔄",
						position: "bottom-right",
					});
				}
			} catch (error) {
				console.error("Failed to load video progress:", error);
			}
		});

		// Handle play button state
		player.on("play", () => {
			const playToggle = player
				.getChild("controlBar")
				.getChild("playToggle");
			if (playToggle) {
				playToggle.removeClass("vjs-paused");
				playToggle.addClass("vjs-playing");
			}
		});

		// Handle pause button state and ensure controls remain visible
		player.on("pause", () => {
			const playToggle = player
				.getChild("controlBar")
				.getChild("playToggle");
			if (playToggle) {
				playToggle.removeClass("vjs-playing");
				playToggle.addClass("vjs-paused");
			}
			player.trigger("useractive");
		});

		// Required event listeners to maintain player functionality
		player.on("waiting", () => {});
		player.on("loadeddata", () => {});
		player.on("dispose", () => {});

		// Handle video end callback
		player.on("ended", () => {
			if (onVideoEnd) {
				onVideoEnd();
			}
		});
	};

	// Sets up the interval that saves video progress periodically
	const setupProgressInterval = (player) => {
		// Clear any existing interval to prevent duplicates
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}

		// Save progress every 10 seconds while video is playing
		intervalRef.current = setInterval(async () => {
			if (!player.paused()) {
				try {
					await videoProgressService.saveProgress(
						downloadData?.uuid,
						player.currentTime(),
						player.duration()
					);
					await videoProgressService.cleanupOldEntries();
				} catch (error) {
					console.error("Failed to save video progress:", error);
				}
			}
		}, 10000);
	};

	// Initial setup when player is first created
	const handlePlayerReady = (player) => {
		playerRef.current = player;
		setupEventListeners(player);
		setupProgressInterval(player);
	};

	// Handle updates when downloadData changes
	useEffect(() => {
		// Re-initialize player settings if player exists
		if (playerRef.current) {
			const player = playerRef.current;
			setupEventListeners(player);
			setupProgressInterval(player);
		}

		// Cleanup function to remove intervals and event listeners
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			if (playerRef.current) {
				const player = playerRef.current;
				player.off("loadedmetadata");
				player.off("play");
				player.off("pause");
				player.off("waiting");
				player.off("loadeddata");
				player.off("dispose");
				player.off("ended");
			}
		};
	}, [downloadData?.uuid, onVideoEnd]);

	const videoFile = downloadData?.files?.find(
		(file) => file.file_ext === "mp4" || file.file_ext === "mkv"
	);

	const videoJsOptions = {
		autoplay: true,
		controls: true,
		responsive: true,
		fluid: true,
		sources: [
			{
				src: `https://archive.org/download/${downloadData.id}/${videoFile.name}`,
				type: "video/mp4",
			},
		],
	};

	return (
		<div className='video-wrapper mt-2 rounded-lg'>
			<VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
		</div>
	);
};

const areEqual = (prevProps, nextProps) => {
	return (
		prevProps.downloadData.id === nextProps.downloadData.id &&
		prevProps.downloadData.uuid === nextProps.downloadData.uuid &&
		prevProps.onVideoEnd === nextProps.onVideoEnd
	);
};

export default memo(VjsPlayer, areEqual);
